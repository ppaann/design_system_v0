/** @type {import('tailwindcss').Config} */

import tokens from './design-tokens/tokens.json' assert { type: 'json' };

const transformTokenGroup = (colorTokens, prefix = '') => {
  return Object.entries(colorTokens).reduce((acc, [key, value]) => {
    if (value.value) {
      acc[`${prefix}${key}`] = value.value; // Store the color value
    } else {
      Object.assign(acc, transformTokenGroup(value, `${prefix}${key}-`)); // Recurse for nested objects
    }
    return acc;
  }, {});
};

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: transformTokenGroup(tokens.colors),
      spacing: transformTokenGroup(tokens.spacing),
    },
  },
  plugins: [],
};

console.log(transformTokenGroup(tokens.colors));

console.log(transformTokenGroup(tokens.spacing));
