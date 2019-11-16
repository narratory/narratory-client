import { Agent, Entity, Intent, UserTurn, BotTurn, create, chat, ANYTHING, RichMessage } from "../index"
import agent from "./dialog"
import axios from "axios"

const fetchGames = async (): Promise<string[]> => {
    try {
        const res = await axios.get("http://localhost:5000/ludvigtest-xbebjy/europe-west1/games")
        console.log(res.data)
        return res.data.games
    } catch (err) {
        console.log("error fetching games: ", err)
        return ["no", "games"]
    }
}

const main = async () => {
    const game: Entity = {
        name: "game",
        enums: (await fetchGames()).map(game => {
            return {
                alts: [game]
            }
        })
    }

    const howDidItGoOnX: Intent = {
        entities: [game],
        examples: ["How did it go on v75?", "who won in the football"]
    }

    const howDidItGoOnXandY: Intent = {
        entities: [game],
        examples: ["How did it go on v75 and football?", "who won in the football and foo"]
    }

    const howDidItGo: UserTurn = {
        intent: howDidItGoOnX, followup: {
            dynamic: "http://localhost:5000/ludvigtest-xbebjy/europe-west1/custom",
            answers: [{
                intent: [ANYTHING], followup: "That worked"
            }]
        }
    }

    const howDidItGoOnSeveral: UserTurn = {
        intent: howDidItGoOnXandY, followup: {
            dynamic: "http://localhost:5000/ludvigtest-xbebjy/europe-west1/custom"
        }
    }

    const dynamicAgent: Agent = {
        agentName: "poo",
        narrative: [["hi there"]],
        questions: [howDidItGo, howDidItGoOnSeveral],
        bridges: ["So"],
        credentials: require("./google_credentials.json")
    }

    const response = await create(dynamicAgent)
    
    if (response) {
        console.log(response.data);
    }
    chat(agent)
}

main()