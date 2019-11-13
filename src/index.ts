import { narratoryCreateAgent } from "./createAgent"
import { narratoryChat } from "./test"

export const chat = narratoryChat
export const create = narratoryCreateAgent

export interface Agent {
    agentName: string
    narrative: Array<RobotTurn | string | string[]>
    questions: Array<UserTurn>
    bridges: string[]
    credentials: any
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
    followup?: RobotTurn | string | string[]
    repair?: string | string[]
}

export interface Content {
    image_url?: string
    video_url?: string
    title?: string
    description?: string
}

export interface RobotTurn {
    say: string | string[],
    content?: Content
    label?: string,
    goto?: string,
    event?: string,
    answers?: UserTurn[],
}