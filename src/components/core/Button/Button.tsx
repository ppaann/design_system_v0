import { cva, VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex font-semibold items-center justify-center rounded-md transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 hover:bg-primary-600 text-white',
        secondary: 'bg-white text-gray-800 border-gray-400',
      },
      size: {
        default: 'px-md py-sm',
        large: 'px-6 py-3',
      },
      disabled: {
        false: null,
        true: ['opacity-50', 'cursor-not-allowed'],
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
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
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
        variant: variant,
        size,
        className,
      })}
      disabled={disabled || undefined}
      {...props}
    />
  );
};
