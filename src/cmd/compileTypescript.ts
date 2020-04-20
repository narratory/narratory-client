import { execSync } from "child_process"

export const compileTypescript = () => {
  execSync("tsc")
}
