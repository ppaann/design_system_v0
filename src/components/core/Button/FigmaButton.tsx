import React from 'react';
import tokens from '../../../../design_system/output.json';

interface ButtonProps {
  variant?: 'primary' | 'secondary'; // Adjust variants as per your design tokens
  children: React.ReactNode;
}

interface TokenItem {
  variant: 'default' | 'primary' | 'secondary';
  classes: {
    color: string; // Tailwind class for color
    spacing: string; // Tailwind class for spacing
  };
}

const FigmaButton: React.FC<ButtonProps> = ({
  variant = 'default',
  children,
}) => {
  // Find the token configuration for the given variant
  const buttonConfig = (
    tokens as { name: string; color_token: string; spacing_token: string }[]
  )
    .map((item) => ({
      variant: item.name as 'default' | 'primary' | 'secondary',
      classes: {
        color: item.color_token,
        spacing: item.spacing_token,
      },
    }))
    .find((item) => item.variant === variant);

  if (!buttonConfig) {
    // Handle the case where no matching variant is found
    return <div>Variant not found</div>;
  }

  // Use the Tailwind classes from the token configuration
  const { color, spacing } = buttonConfig.classes;

  return (
    <button className={`${color} ${spacing} rounded-md font-medium`}>
      {children}
    </button>
  );
};

export default FigmaButton;
