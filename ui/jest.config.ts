import { Config } from 'jest'
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './ui',
})

const customJestConfig: Config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect", "<rootDir>/../test/mock-env.ts"],
  modulePaths: ["<rootDir>/app", "<rootDir>/../"],
  preset: "ts-jest/presets/js-with-ts",
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
    "^.+\\.m(t|j)s$": "ts-jest",
  },
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/../$1",
    "~/(.*)": "<rootDir>/app/$1",
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
