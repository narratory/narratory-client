import { execSync } from "child_process"

export const compileTypescript = async () => {
  try {
    execSync(`node node_modules/.bin/tsc`)
    return Promise.resolve()
  } catch (err) {
    console.log(err.message)
    
    return Promise.reject(
      new Error(`Errors compiling Typescript. Please review your code or run "tsc" to get a better error output`)
    )
  }
}
