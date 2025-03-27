import type { Meta, StoryObj } from '@storybook/react';
import AiButton from './AiButton';

const meta: Meta<typeof AiButton> = {
  title: 'Core/AiButton',
  component: AiButton,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ZuZWPWcPLSqaX8d1p9uTpX/DesignSystem', // Replace with your Figma design URL
    },
  },
};

export default meta;

type Story = StoryObj<typeof AiButton>;

export const Default: Story = {
  args: {
    children: 'Default Button',
    intent: 'default',
  },
};

export const Hover: Story = {
  args: {
    children: 'Hover Button',
    intent: 'default',
  },
  parameters: {
    pseudo: { hover: true }, // Simulates hover state
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    intent: 'default',
    disabled: true,
  },
};

export const CustomClass: Story = {
  args: {
    children: 'Custom Class Button',
    intent: 'default',
    className: 'bg-red-500 hover:bg-red-600',
  },
};
