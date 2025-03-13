import { cva, VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex font-semibold items-center justify-center rounded-md transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 hover:bg-primary-600 text-white',
        disabled: 'bg-gray-300 cursor-not-allowed',
      },
      size: {
        default: 'px-md py-sm',
        large: 'px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {}

export const Button = ({
  variant,
  size,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={buttonVariants({
        variant: disabled ? 'disabled' : variant,
        size,
        className,
      })}
      disabled={disabled}
      {...props}
    />
  );
};
