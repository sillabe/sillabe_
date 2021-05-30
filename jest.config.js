module.exports = {
    transform: {
        '.(ts|tsx)': 'ts-jest',
    },
    testEnvironment: 'node',
    testMatch: ['**/*.(spec|test).ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
    coverageThreshold: {
        global: {
            branches: 85,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
    collectCoverageFrom: ['src/**/{!(index),}.{js,ts}'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
};
