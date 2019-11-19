import call from "./call";
import { Agent } from "./index"
import { AbstractBotTurn, BotTurn } from "./interfaces";
import Axios from "axios";
import { CUSTOM_START_URL } from "./settings";

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const getMessage = (message: string, prompt: boolean) => `Bot: ${message + (prompt ? "\n>> " : "")}`

const getCustomStartEvent = async (agent: Agent, startingTurn: AbstractBotTurn | number): Promise<string> => {
    const result = await Axios.post(CUSTOM_START_URL, {agent, startingTurn})
    return result.data
}

export async function chat(agent: Agent, startingTurn?: AbstractBotTurn | number) {
    console.log(`Starting chat with ${agent.agentName}.`);
    
    const startEvent = startingTurn ? await getCustomStartEvent(agent, startingTurn): "WELCOME" // Get start-event

    const response = await call(agent, { // Initiate the chat with the welcome event
        event: startEvent,
    })

    console.log(`Chat started (session id: ${response.sessionId}!\n`);

    handleResponse(agent, response) // And then, recursively, handle responses
}

function handleResponse(agent: Agent, response: any) {
    response.messages.map((message, index) => {
        if (index == response.messages.length - 1) { // If last message, we make a prompt and then call our agent with the input
            readline.question(getMessage(message.text, true), (input: string) => {
                if (input == "exit") {
                    console.log("Exiting chat. Byebye!")
                    process.exit()
                }
                call(agent, {
                    message: input,
                    contexts: response.contexts,
                    sessionId: response.sessionId
                }).then(response => handleResponse(agent, response))
            })
        } else {
            console.log(getMessage(message.text, false)) // Otherwise we just print the message
        }
    })
}