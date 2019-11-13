import call from "./call";
import { Agent } from "./index"

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const getMessage = (message: string, prompt: boolean) => `Bot: ${message + (prompt ? "\n>> " : "")}`

export async function narratoryChat(agent: Agent) {
    const response = await call(agent, { // Initiate the chat with the welcome event
        event: "WELCOME"
    })

    handleResponse(agent, response) // And then, recursively, handle responses
}

function handleResponse(agent: Agent, response: any) {
    response.messages.map((message, index) => {
        if (index == response.messages.length - 1) { // If last message, we make a prompt and then call our agent with the input
            readline.question(getMessage(message.text, true), (input) => {
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