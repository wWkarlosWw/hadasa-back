export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
  reporters: [
    'default',
    ['jest-html-reporters', {
      pageTitle: 'Test Report',
      publicPath: './html-report',
      filename: 'test-report.html',
    }],
  ],
};