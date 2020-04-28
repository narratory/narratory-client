import { deploy } from "../api/deploy"
import { getAgent } from "./agent"
import { validateAgentCredentialsFormat } from "./helpers"

export const runDeploy = async ({ version }: { version: string }) => {
  if (!version) {
    console.error(
      "Error: Version has to be set using flag --version. For example, 'npm run deploy -- --version=3'"
    )
    process.exit()
  }

  const agent = getAgent()

  validateAgentCredentialsFormat(agent)

  console.log(
    `Deploying agent with version ${version} [Ctrl/Cmd + C to exit]\n`
  )
  await deploy({ agent, version, local: process.argv.includes("!local") })
}
