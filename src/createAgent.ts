import { Agent } from "./index"
import axios from "axios"

export const narratoryCreateAgent = async (agent: Agent) => {
    const url = "https://europe-west1-ludvigtest-xbebjy.cloudfunctions.net/narratoryCreate"
    
    console.log("Creating agent. This may take up to a minute. Hold on!")
    
    const response = await axios({
        url: url,
        method: "POST",
        data: {
            agent
        }
    })
    
    console.log("Agent creation completed!")
    return response
}