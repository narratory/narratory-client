import { Agent } from "./index"
import axios from "axios"
import { CREATE_AGENT_URL } from "./settings"
import { Language } from "./languages"

export const create = async (agent: Agent) => {
    console.log("Creating and training agent. This could take up to 60 seconds. Hold on!")
    
    if (!agent.language) {
        agent.language = Language.English
    }

    try {
        const response = await axios.post(CREATE_AGENT_URL, {
            agent: JSON.stringify(agent)
        }, {
            headers: {
                "authorization": `Bearer ${agent.narratoryKey}`
            }
        })

        if (response.data && response.data.status == 200) {
            console.log(`Agent created and trained successfully in ${(response.data.timeElapsed / 1000).toFixed(0)} seconds`)
            // @TODO: add check if the agent is new, and then post the fulfillment-url
            // "Please remember to enter the fulfillment url into the Dialogflow console."
            return response
        } else {
            console.log("Something went wrong in agent creation. Message: ", response.data.message)
            return null
        }

    } catch (error) {
        console.log("Something went wrong in agent creation. Error message: ", error.message)
        return null
    }
}