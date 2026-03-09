import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: {
    channelOptions: {
      wsToken: 'accretion-ui-angular-storybook',
    },
  },
  docs: {
    defaultName: 'Overview',
  },
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
};

export default config;
