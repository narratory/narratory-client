import { narratoryCreateAgent } from "./createAgent"
import { narratoryChat } from "./chat"

export const chat = narratoryChat
export const create = narratoryCreateAgent

export interface Agent {
    agentName: string
    narrative: Array<BotTurn | string | string[]>
    questions: Array<UserTurn>
    bridges: string[]
    credentials: {
        project_id: string
        private_key: string
        client_email: string
    }
}

export interface Enum {
    alts: string[]
}

export interface Entity {
    name: string
    enums: Enum[]
    default?: string
}

export interface Intent {
    entities?: Entity[]
    examples: string[]
}

export interface UserTurn {
    intent: string[] | Intent
    fallback?: string
    followup?: BotTurn | string | string[]
    repair?: string | string[]
}

export interface Content {
    image_url?: string
    video_url?: string
    title?: string
    description?: string
}

export interface BotTurn {
    say: string | string[],
    content?: Content
    label?: string,
    goto?: string,
    event?: string,
    answers?: UserTurn[],
}

export const ANYTHING = "ANYTHING"