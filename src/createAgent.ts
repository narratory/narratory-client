import { Agent } from "./index"
import axios from "axios"

export const narratoryCreateAgent = async (agent: Agent) => {
    const url = "https://europe-west1-ludvigtest-xbebjy.cloudfunctions.net/narratoryCreate"
   
    console.log("Creating agent. This may take up to a minute. Hold on!")

    try {
        const response = await axios.post(url, agent)
        
        if (response.data && response.data.status == 200)  {
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