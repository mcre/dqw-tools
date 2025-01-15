module.exports = {
  content: ['dist/**/*.html'],
  css: ['dist/assets/*.css'],
  safelist: {
    standard: [
      /-(leave|enter|appear)(|-(to|from|active))$/,
      /^(?!(|.*?:)cursor-move).+-move$/,
      /^router-link(|-exact)-active$/,
      /^scale/,
      /^fade/,
      /^(m[btlrxy]?|p[btlrxy]?)-\d+$/,
      /^(d|elevation|text|bg|rounded)-.+$/,
      /^grid(-.+)?$/,
      /^gap(-\d+)?$/,
      /^align(-.+)?$/,
      /^justify(-.+)?$/,
      /^order(-\d+)?$/,
      /^col(-\d+)?$/,
      /button/,
      /input/,
      /select/,
      /textarea/,
    ],
    greedy: [/data-v-.*/, /^v-/]
  },
  output: 'dist/assets/'
}
