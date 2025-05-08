module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@auth/(.*)$': '<rootDir>/auth/$1',
    '^@users/(.*)$': '<rootDir>/users/$1',
    '^@merchants/(.*)$': '<rootDir>/merchants/$1',
    '^@establishments/(.*)$': '<rootDir>/establishments/$1',
    '^@municipalities/(.*)$': '<rootDir>/municipalities/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
}; 