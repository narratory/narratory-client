import { execSync } from "child_process"

export const compileTypescript = () => {
  console.log("Compiling typescript")
  execSync("tsc")
}
