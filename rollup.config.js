export default {
  input: 'lib/terminal.js',
  output: {
    file: 'lib/cjs/terminal.cjs',
    format: 'cjs',
  },
  external: ['fs', 'url']
};