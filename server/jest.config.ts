import type {Config} from 'jest';

const config: Config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/../test/mock-env.ts"],
  preset: "ts-jest/presets/js-with-ts",
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
    "^.+\\.m(t|j)s$": "ts-jest",
  },
  modulePaths: ["<rootDir>/src", "<rootDir>/../"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/src/$1",
    "@/(.*)": "<rootDir>/../$1",
  },
}

export default config;
