/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
        isolatedModules: true
    }
  },
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/\__mocks__/\styleMock.js',
  }
};