module.exports = {
    extends: ['blitz'],
    rules: {
        indent: ['error', 4],
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'index', 'sibling', 'parent', 'internal', 'object'],
            },
        ],
    },
};
