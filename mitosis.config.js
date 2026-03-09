module.exports = {
  files: 'packages/core/src/components/accordion/**/*.lite.tsx',
  targets: ['react', 'angular'],
  dest: '.generated/mitosis',
  commonOptions: {
    typescript: true,
  },
  options: {
    react: {
      type: 'dom',
      format: 'safe',
      stateType: 'useState',
      stylesType: 'style-tag',
      addUseClientDirectiveIfNeeded: false,
    },
    angular: {
      api: 'signals',
      standalone: true,
      preserveImports: true,
      defaultExportComponents: false,
      attributePassing: {
        enabled: true,
      },
    },
  },
};
