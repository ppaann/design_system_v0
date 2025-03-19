import React from 'react';
import tokens from '../../../../design_system/output.json';

interface ButtonProps {
  variant?: 'primary' | 'secondary'; // Adjust variants as per your design tokens
  children: React.ReactNode;
}

interface TokenItem {
  variant: 'default' | 'primary' | 'secondary';
  size: {
    width: number;
    height: number;
  };
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

const FigmaButton: React.FC<ButtonProps> = ({
  variant = 'default',
  children,
}) => {
  const buttonConfig = (tokens as TokenItem[]).find(
    (item) => item.variant === variant
  );

  console.log(tokens, buttonConfig);
  if (!buttonConfig) {
    // Handle the case where no matching variant is found
    return <div>Variant not found{buttonConfig}</div>; // Or return null, or a default button
  }

  return (
    <button
      style={{
        width: buttonConfig.size.width + 'px',
        height: buttonConfig.size.height + 'px',
        backgroundColor: `rgba(
          ${buttonConfig.color.r * 255},
          ${buttonConfig.color.g * 255},
          ${buttonConfig.color.b * 255},
          ${buttonConfig.color.a}
        )`,
      }}
    >
      {children}
    </button>
  );
};

export default FigmaButton;
