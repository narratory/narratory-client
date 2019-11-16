import { Agent } from "./index"
import axios from "axios"

export const create = async (agent: Agent) => {
    //const url = "https://europe-west1-ludvigtest-xbebjy.cloudfunctions.net/narratoryCreate"
    const url = "http://localhost:5000/ludvigtest-xbebjy/europe-west1/create"

    console.log("Creating agent. This may take up to a minute. Hold on!")

    try {
        const response = await axios.post(url, {
            agent: JSON.stringify(agent)
        })

        if (response.data && response.data.status == 200) {
            console.log("Agent created successfully. Please remember to enter the fulfillment url into the Dialogflow console.")
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