import call from "./call";
import { Agent } from "./index"
import { AbstractBotTurn, BotTurn } from "./interfaces";
import Axios from "axios";
import { CUSTOM_START_URL } from "./settings";

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    removeHistoryDuplicates: true
})

const getMessage = (message: string, prompt: boolean) => `Bot: ${message + (prompt ? "\n>> " : "")}`

const getCustomStartEvent = async (agent: Agent, startingTurn: AbstractBotTurn | number): Promise<string> => {
    const result = await Axios.post(CUSTOM_START_URL, {agent, startingTurn})
    return result.data
}

export async function chat(agent: Agent, startingTurn?: AbstractBotTurn | number) {
    
    const startEvent = startingTurn ? await getCustomStartEvent(agent, startingTurn): "WELCOME" // Get start-event

    const response = await call(agent, { // Initiate the chat with the welcome event
        event: startEvent,
    })

    console.log(`Chat started with ${agent.agentName} (session id: ${response.sessionId}!\n`);

    handleResponse(agent, response) // And then, recursively, handle responses
}

function handleResponse(agent: Agent, response: any) {    
    response.messages.map((message, index) => {
        if (index == response.messages.length - 1) { // If last message, we make a prompt and then call our agent with the input
            if (response.endOfConversation) {
                console.log(getMessage(message.text, false))
                console.log("\nEnd of conversation")
                process.exit()
            }
            else {
                readline.question(getMessage(message.text, true), (input: string) => {
                    if (input !== "") {
                        call(agent, {
                            ...response,
                            message: input,
                        }).then(response => handleResponse(agent, response))
                    } else {
                        handleResponse(agent, {
                            ...response,
                            messages: [{
                                text: "<Input can't be empty>",
                                fromUser: false
                            }]
                        })
                    }
                })
            }
        } else {
            console.log(getMessage(message.text, false)) // Otherwise we just print the message
        }
    })
}