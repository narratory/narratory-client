import { call } from "./call"
import { Agent, DEFAULT_REGION, NarratoryResponse } from "narratory-lib"
import { printDebugMessage, sleep } from "../helpers"
import { v4 } from "uuid"

export async function checkAlive({
  agent,
  local = false,
}: {
  agent: Agent
  local?: boolean
}) {
  let response: NarratoryResponse

  console.log("Verifying that Agent is ready")

  const sessionId = v4()

  // Check every 1 seconds if our agent is ready
  while (
    !response ||
    !response.messages ||
    !(response.messages &&
      response.messages.length == 1 &&
      response.messages[0].text === "ALIVE")
  ) {
    response = await call({
      googleCredentials: agent.googleCredentials,
      language: agent.language,
      region: agent.region ? agent.region : DEFAULT_REGION,
      message: "alive check",
      local,
      contexts: [
        {
          name: `projects/${agent.googleCredentials.project_id}/agent/sessions/${sessionId}/contexts/aliveCheck`,
          lifespanCount: 1,
        },
      ],
      sessionId,
    })

    await sleep(1000)
  }

  console.log("Agent is ready")
}
