import '../../../packages/react/src/styles.css';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      expanded: true,
    },
    layout: 'padded',
  },
};

export default preview;
