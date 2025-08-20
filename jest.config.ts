import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { url: 'http://localhost' },
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { 
      tsconfig: 'tsconfig.jest.json', 
      useESM: true 
    }],
  },
  moduleNameMapper: {
    '\\.(css|sass|scss|less)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/src/**/__tests__/jest/**/*.(test|spec).(ts|tsx|js|jsx)']
};

export default config;
