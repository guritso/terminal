export default {
  input: 'lib/terminal.js',
  output: {
    file: 'lib/dist/terminal.cjs',
    format: 'cjs',
  },
  external: ['fs', 'url']
};