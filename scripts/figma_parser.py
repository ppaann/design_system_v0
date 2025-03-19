import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

# 配置参数
FIGMA_TOKEN = os.getenv("FIGMA_TOKEN")  # 从环境变量读取Token，避免硬编码
FILE_ID = "ZuZWPWcPLSqaX8d1p9uTpX"                # 替换为你的Figma文件ID
NODE_IDS = "3-1377"                  # 替换为你的按钮组件节点ID（多个用逗号分隔）

def fetch_figma_data():
    """调用Figma API获取节点数据"""
    url = f"https://api.figma.com/v1/files/{FILE_ID}/nodes?ids={NODE_IDS}"
    headers = {"X-Figma-Token": FIGMA_TOKEN}
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # 如果HTTP请求失败则抛出异常
    
    return response.json()

def parse_button_data(raw_data):
    """解析Figma数据，提取按钮颜色和尺寸"""
    buttons = []
    
    for node_id, node_info in raw_data["nodes"].items():
        doc = node_info["document"]
        name_parts = doc["name"].split("/")  # 假设组件命名为 "Button/Primary"
        
        # 提取颜色（取第一个填充色）
        fills = doc.get("fills", [{}])[0].get("color", {})
        color = {
            "r": fills.get("r", 0),
            "g": fills.get("g", 0),
            "b": fills.get("b", 0),
            "a": fills.get("a", 1)
        }
        
        # 提取尺寸
        bbox = doc.get("absoluteBoundingBox", {})
        width = bbox.get("width", 100)  # 默认值100px
        height = bbox.get("height", 40) # 默认值40px
        
        buttons.append({
            "component": name_parts[0],
            "variant": name_parts[1] if len(name_parts) > 1 else "default",
            "color": color,
            "size": {"width": width, "height": height}
        })
    
    return buttons

def save_to_json(data, output_path="../design_system/output.json"):
    """保存解析后的数据到JSON文件"""
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ 数据已保存至 {os.path.abspath(output_path)}")

if __name__ == "__main__":
    # 执行流程
    raw_data = fetch_figma_data()
    buttons = parse_button_data(raw_data)
    save_to_json(buttons)