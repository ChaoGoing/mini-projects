import replace from '@rollup/plugin-replace'

export default [
    {
        input: './src/index.js',
        output: {
            file: 'dist/base64.brower.js',
            format: 'esm'
        },
        plugins: [
            replace({ 'process.env.BROWSER': true })
        ]
    },{
        input: './src/index.js',
        output: {
            file: 'dist/base64.node.js',
            format: 'cjs'
        },
        plugins: [
            replace({ 'process.env.BROWSER': false })
        ]
    }
]