import os
import requests
import json
from collections import defaultdict
from dotenv import load_dotenv

from typing import Dict, Any, List, Tuple

load_dotenv()  # Load environment variables from .env

# ================== 配置部分 ==================
# 配置参数
FIGMA_TOKEN = os.getenv("FIGMA_TOKEN")  # 从环境变量读取Token，避免硬编码
FILE_ID = "ZuZWPWcPLSqaX8d1p9uTpX"                # 替换为你的Figma文件ID
NODE_IDS = "58-27"                  # 替换为你的按钮组件节点ID（多个用逗号分隔）
# https://www.figma.com/design/ZuZWPWcPLSqaX8d1p9uTpX/DesignSystem?node-id=48-12
# https://www.figma.com/design/ZuZWPWcPLSqaX8d1p9uTpX/DesignSystem?node-id=58-27

# 自定义属性名映射表（可扩展）
PROPERTY_ALIAS_MAP = {
    "rectangleCornerRadii": "cornerRadius",
    "fills": "backgroundColor",
    "RECTANGLE_TOP_LEFT_CORNER_RADIUS": "cornerRadius",
    "itemSpacing": "spacing"
}

UNMAPPED_PROP_FILE = "unmapped_properties.json"

# ================== 核心工具函数 ==================
def fetch_figma_data():
    """调用Figma API获取节点数据"""
    url = f"https://api.figma.com/v1/files/{FILE_ID}/nodes?ids={NODE_IDS}"
    headers = {"X-Figma-Token": FIGMA_TOKEN}
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # 如果HTTP请求失败则抛出异常
    
    return response.json()

def save_to_json(data, output_path="../design_system/output.json"):
    """保存解析后的数据到JSON文件"""
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ 数据已保存至 {os.path.abspath(output_path)}")

def rgb_to_hex(rgba: dict) -> str:
    """将Figma的RGBA值转为HEX（忽略alpha）"""
    r = int(rgba["r"] * 255)
    g = int(rgba["g"] * 255)
    b = int(rgba["b"] * 255)
    return f"#{r:02x}{g:02x}{b:02x}".upper()

def find_closest_color(hex_value: str, color_tokens: dict) -> str:
    """精确匹配颜色Token，未找到返回HEX值"""
    for category, shades in color_tokens.items():
        for shade, data in shades.items():
            if data["value"].upper() == hex_value.upper():
                return f"{category}.{shade}"
    return hex_value  # 直接返回HEX值

def find_closest_spacing(value: float, spacing_tokens: dict) -> str:
    """统一处理间距和圆角，未匹配时返回{value}px"""
    value_px = float(value)
    
    # 遍历所有spacing类别
    for category, sizes in spacing_tokens.items():
        for size_name, size_data in sizes.items():            
            if size_name != 'value': 
              continue            
            token_value = float(size_data)
            if abs(value_px - token_value) <= 0.01:
                return category  # 找到匹配项，直接返回category
    
    return f"{int(value_px)}px"  # 未匹配时返回24px格式

def resolve_property_name(raw_prop: str) -> str:
    """通过映射表解析属性名"""
    return PROPERTY_ALIAS_MAP.get(raw_prop, raw_prop)

def extract_actual_value(node_data: Dict, prop: str) -> Any:
    """
    从document中提取实际值，处理特殊结构
    返回 (是否成功, 值或错误信息)
    """
    try:
        # 处理嵌套属性（如rectangleCornerRadii.XXX）
        if "." in prop:
            parts = prop.split(".")
            value = node_data
            for p in parts:
                value = value[p]
            return (True, value)
        return (True, node_data[prop])
    except KeyError:
        return (False, f"Property {prop} not found in document")
    except TypeError:
        return (False, f"Invalid structure for {prop}")

def match_token(value: Any, token_type: str, tokens: dict) -> str:
    """新版Token匹配函数"""
    # try:
    # 颜色处理 ================================
    if token_type == "color":        
        # 类型检查1：处理数组结构 (如fills)
        if isinstance(value, list):
            if not value:
                return "transparent"  # 空颜色数组默认值
            value = value[0].get("color") if isinstance(value[0], dict) else value[0]
        
        # 类型检查2：确保是颜色字典
        if not isinstance(value, dict) or not all(k in value for k in ("r", "g", "b")):
            if isinstance(value, str) and value.startswith("#"):
                return find_closest_color(value, tokens.get("colors", {}))  # 直接处理HEX字符串
            return str(value)  # 非标准格式返回原始值
        
        # 转换为HEX
        hex_val = rgb_to_hex(value)
        return find_closest_color(hex_val, tokens.get("colors", {}))
    
    # 间距/圆角处理 ============================
    elif token_type in ["spacing", "radius"]:
        # 类型检查：转换为数值
        num_val = None
        if isinstance(value, (int, float)):
            num_val = float(value)
        elif isinstance(value, str) and "px" in value:
            try:
                num_val = float(value.replace("px", ""))
            except ValueError:
                return value  # 无法转换时返回原始值
        else:
            return str(value)
        
        return find_closest_spacing(num_val, tokens.get(token_type, {}))
    
    # 其他类型 ================================
    
    # 其他类型直接返回字符串
    else:
        return str(value)
    
    # except Exception as e:
    #     print(f"Token匹配错误: {e}")
    #     return f"error: {str(value)}"  # 保留原始值信息

def extract_component_details(node_data:Dict)->Dict:
    """
    从节点名称提取组件详情（组件名、类型、状态）
    """
    node_name = node_data.get("name", "")
    name_parts = node_name.split("/")
    
    component_details = {}
    if len(name_parts) >= 1:
        component_details["component"] = name_parts[0]
    if len(name_parts) >= 2:
        component_details["type"] = name_parts[1]
    if len(name_parts) >= 3:
        component_details["state"] = name_parts[2]
    
    return component_details

# ================== 主解析逻辑 ==================
def analyze_node(node_id: str, node_data: Dict, tokens: Dict) -> Tuple[Dict, List]:
    """
    解析单个节点数据
    返回：(变量映射结果, 未处理的属性列表)
    """
    mappings = {}
    unmapped = []
    
    # Extract component details
    component_details = extract_component_details(node_data)
    mappings["component_details"] = component_details

    bound_vars = node_data.get("boundVariables", {})
    
    for raw_prop, var_info in bound_vars.items():
        # 1. 解析属性名
        prop = resolve_property_name(raw_prop)
        
        # 2. 提取实际值
        success, value = extract_actual_value(node_data, prop)
        if not success:
            unmapped.append({
                "node_id": node_id,
                "raw_property": raw_prop,
                "resolved_property": prop,
                "error": value
            })
            continue
        
        # 3. 确定变量类型
        token_type = "spacing" if "padding" in prop else \
                    "color" if "Color" in prop else \
                    "color" if "color" in prop else \
                    "radius" if "Radius" in prop else \
                    "other"
        
        # 4. 匹配或生成Token
        token = match_token(value, token_type, tokens)
        
        mappings[raw_prop] = {
            "resolved_property": prop,
            "value": value,
            "token": token,
            "token_type": token_type
        }
    
    return mappings, unmapped

def process_node(nodes:dict, tokens: dict) ->Tuple[dict, dict]:
    """
    处理节点数据
    """
    # 初始化报告
    all_mappings = {}
    all_unmapped = []
    for node_id, node_data in nodes.items():
        document = node_data.get("document", {})
        children = document.get("children", [])
        
        for child in children:
            if child.get("type") == "COMPONENT":
                node_id = child.get("id")
                # node_data = nodes.get(node_id, {})
                mappings, unmapped = analyze_node(node_id, child, tokens)
                all_mappings[node_id] = mappings
                all_unmapped.extend(unmapped)
        
    return all_mappings, all_unmapped
# ================== 执行示例 ==================
def main():
    # 加载现有tokens
    with open("/Users/Pan/Projects/Projects/Demo_DesignSystem/demo/design_system/tokens.json") as f:
    # with open("tokens.json") as f:
        tokens = json.load(f)
    
    # raw_data是API返回的原始数据
    # with open("/Users/Pan/Projects/Projects/Demo_DesignSystem/demo/design_system/raw.json") as f:
        # raw_data = json.load(f)
    raw_data = fetch_figma_data()
    save_to_json(raw_data, "/Users/Pan/Projects/Projects/Demo_DesignSystem/demo/design_system/framed_raw.json")
    
    # 遍历所有节点
    # 根节点
    nodes = raw_data.get("nodes", {});
    all_mappings, all_unmapped = process_node(nodes, tokens);

    # for node_id, node_data in raw_data.get("nodes", {}).items():
    #     mappings, unmapped = analyze_node(node_id, node_data, tokens)
    #     all_mappings[node_id] = mappings
    #     all_unmapped.extend(unmapped)
    
    # 保存结果
    with open("/Users/Pan/Projects/Projects/Demo_DesignSystem/demo/design_system/mapping/framed_variable_mappings.json", "w") as f:
        json.dump(all_mappings, f, indent=2)


    # 记录未处理属性
    if all_unmapped:
        with open(UNMAPPED_PROP_FILE, "w") as f:
            json.dump(all_unmapped, f, indent=2)
        print(f"⚠️ 发现 {len(all_unmapped)} 个未处理属性，已保存至 {UNMAPPED_PROP_FILE}")
    
    print("✅ 解析完成！变量映射已保存至 variable_mappings.json")

if __name__ == "__main__":
    main()
