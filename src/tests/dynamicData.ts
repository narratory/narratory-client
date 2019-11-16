import { Agent, Entity, Intent, UserTurn, BotTurn, create, chat, ANYTHING, RichMessage } from "../index"
import agent from "./dialog"

const dynamicallyFetchData = (data: any): RichMessage => {
    // Call some API, fetch some data..
    console.log(JSON.stringify(data))
    
    return {
        say: "The horse x won and horse y got second. See the rest in the table. Now say something..",
        content: {
            description: "This should probably be a table with data"
        }
    }
}

const game: Entity = {
    name: "game",
    enums: [
        { alts: ["v75"] },
        { alts: ["football"] }
    ]
}

const howDidItGoOnX: Intent = {
    entities: [game],
    examples: ["How did it go on v75?"]
}

const howDidItGo: UserTurn = {
    intent: howDidItGoOnX, followup: {
        dynamic: dynamicallyFetchData,
        answers: [{
            intent: [ANYTHING], followup: "That worked"
        }]
    }
}

const dynamicAgent: Agent = {
    agentName: "poo",
    narrative: [["hi there"]],
    questions: [howDidItGo],
    bridges: ["So"],
    credentials: require("./google_credentials.json")
}

const main = async () => {
    const response = await create(dynamicAgent)
    if (response) {
        console.log(response.data);
    }
    chat(agent)
}

main()