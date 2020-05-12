const tailwind = require('tailwindcss')
const compile = require('tailwindcss/lib/cli/compile').default

function buildCss(tailwindCss, configPath) {
  const output = compile({
    inputFile: tailwindCss,
    plugins: [tailwind(configPath)],
  })

  return output
}

module.exports = buildCss
