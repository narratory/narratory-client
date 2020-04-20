import { deploy } from "../api/deploy"
import { getAgent } from "./agent"

export const runDeploy = async ({ version }: { version: string }) => {
  if (!version) {
    console.error("Error: Version has to be set using flag --version. For example, 'npm run deploy -- --version=3'")
    process.exit()
  }
  console.log(`Deploying agent with version ${version} [Ctrl/Cmd + C to exit]\n`)
  await deploy({ agent: getAgent(), version, local: process.argv.includes("!local") })
}
