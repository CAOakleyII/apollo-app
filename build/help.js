var chalk = require('chalk')

console.log(`
  ${chalk.yellow("npm run dev")}       -     Runs a hot loading dev instance \n
  ${chalk.yellow("npm run build")}     -     transpiles and compiles the app into a bundled javascript file \n
  ${chalk.yellow("npm start")}         -     Starts the spa server without hot loading \n
  ${chalk.yellow("npm run lint")}      -     Runs eslints against the client folder. \n
  ${chalk.yellow("npm run help")}      -     Runs this command. \n`)