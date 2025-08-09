/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  moduleNameMapper: {
    '^ionicons/components/(.*)$': '<rootDir>/node_modules/ionicons/components/$1',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@ionic/core|@ionic/angular|@ionic/core|@stencil/core|ionicons|.*\\.mjs))',
  ],
};
