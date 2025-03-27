import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center font-medium transition-colors',
    // Base styles from design tokens
    'pl-20 pr-20', // paddingLeft/paddingRight: 24px → 24/4=6
    'pt-sm pb-sm', // paddingTop/paddingBottom: sm token
    'rounded-[4px]', // cornerRadius: 4px → custom value
    'bg-primary-500', // backgroundColor: primary.500 token
  ],
  {
    variants: {
      intent: {
        default: 'text-white bg-primary-500', // Based on component_details.type
      },
    },
    compoundVariants: [
      {
        intent: 'default',
        className: 'hover:bg-primary-600', // Based on state: hover
      },
    ],
    defaultVariants: {
      intent: 'default',
    },
  }
);

const AiButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ intent, ...props }, ref) => {
    return (
      <button className={buttonVariants({ intent })} ref={ref} {...props} />
    );
  }
);

AiButton.displayName = 'Button';

export default AiButton;
