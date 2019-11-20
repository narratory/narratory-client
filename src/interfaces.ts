import { Language } from "./languages"

export interface Agent {
    agentName: string
    language?: Language,
    narrative: Array<BotTurn | string | string[]>
    questions?: Array<UserTurn>
    bridges?: string[]
    credentials: {
        project_id: string
        private_key: string
        client_email: string
    }
}

export interface Enum {
    alts: string[]
}

export interface AbstractEntity {
    name: string
    default?: string
}

export interface Entity extends AbstractEntity {
    enums: Enum[]
}

export interface SystemEntity extends AbstractEntity {
    category: string
    description: string
    returns: string
    default: string
}

export interface Intent {
    entities?: EntityMap
    examples: string[]
}

export type EntityMap = {
    [key: string]: AbstractEntity
}

export interface UserTurn {
    intent: string[] | Intent
    fallback?: string
    followup?: BotTurn | DynamicBotTurn | string | string[]
    repair?: string | string[]
}

export interface Content {
    image_url?: string
    video_url?: string
    title?: string
    description?: string
}

export interface RichMessage {
    say: string
    content: Content
}

export type ConditionMap = {
    [key: string]: boolean// | string | string[]
}

export interface AbstractBotTurn {
    label?: string,
    goto?: string,
    event?: string,
    answers?: UserTurn[],
    cond?: ConditionMap
}

export interface BotTurn extends AbstractBotTurn {
    say: string | string[],
    content?: Content
}

export interface DynamicBotTurn extends AbstractBotTurn {
    dynamic: string,
}

export function isDynamicBotTurn(abstractTurn: AbstractBotTurn | BotTurn | DynamicBotTurn) {
    return abstractTurn && (abstractTurn as DynamicBotTurn).dynamic !== undefined
}

export function isSystemEntity(abstractEntity: AbstractEntity | Entity | SystemEntity) {
    return abstractEntity && (abstractEntity as Entity).enums === undefined
}