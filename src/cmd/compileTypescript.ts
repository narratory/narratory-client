import { execSync } from "child_process"
import path from "path"

export const compileTypescript = async () => {
  try {
    // Try compiling with local typescript executable
    execSync(path.join("node_modules", ".bin", "tsc"))
    return Promise.resolve()
  } catch (err) {
    // Try compiling with global typescript executable
    try {
      execSync("tsc")
      return Promise.resolve()
    } catch(err) {
      return Promise.reject(
        new Error(`Errors compiling Typescript. Please review your code or run "tsc" to get a better error output`)
      )  
    }
  }
}
