import { Language } from "./data/languages"

export interface Agent {
  agentName: string
  language: Language
  narrative: Array<AbstractBotTurn | string | string[]>
  userInitiatives?: Array<UserTurn>
  defaultFallbacks?: string[]
  bridges?: string[]
  narratoryKey: string
  googleCredentials: GoogleCredentials
  maxMessagesPerTurn?: 1 | 2
  allowGateway?: boolean
}

export interface GoogleCredentials {
  project_id: string
  private_key: string
  client_email: string
  [key: string]: any
}

export interface Enum {
  name: string
  alts?: string[]
}

export interface AbstractEntity {
  name: string
  default?: string
}

export interface Entity extends AbstractEntity {
  enums: Enum[]
}

export interface DynamicEntity extends Entity {
  url: string
  type: "ON_CREATE" | "AT_RUNTIME" | "ON_CREATE_AND_AT_RUNTIME"
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
  priority?: number
  noEntityReset?: boolean
}

export type EntityMap = {
  [key: string]: AbstractEntity
}

export interface UserTurn {
  intent: string[] | Intent
  bot:
    | BotTurn
    | DynamicBotTurn
    | OrderTurn
    | BridgeTurn
    | string
    | Array<BotTurn | DynamicBotTurn | OrderTurn | BridgeTurn | string>
}

export interface Content {
  image_url?: string
  video_url?: string
  title?: string
  description?: string
  order?: {
    type: string
    confirmationText: string
    merchantName: string
    name: string
    description: string
  }
}

export interface RichMessage {
  say: string
  content: Content
}

export type ConditionMap = {
  [key: string]: boolean | string | string[] | number
}

export type VariableMap = {
  [key: string]: string | boolean | number | object | Array<string | boolean | number | object>
}

export interface ConditionalSay {
  text: string | string[]
  cond?: ConditionMap
}

export interface AbstractBotTurn {
  say?: string | ConditionalSay | Array<string | ConditionalSay>
  content?: Content
  repair?: boolean | "PARENT"
  label?: string
  goto?: string
  cond?: ConditionMap
  set?: VariableMap
}

export interface BotTurn extends AbstractBotTurn {
  say: string | ConditionalSay | Array<string | ConditionalSay>
  user?: UserTurn[]
}

export interface BridgeTurn extends AbstractBotTurn {
  url?: string
  params?: string[]
  bot:
    | BotTurn
    | DynamicBotTurn
    | OrderTurn
    | BridgeTurn
    | string
    | Array<BotTurn | DynamicBotTurn | OrderTurn | BridgeTurn | string>
  asyncWebhook?: boolean
}

export interface DynamicBotTurn extends AbstractBotTurn {
  url: string
  user?: UserTurn[]
  params?: string[]
  asyncWebhook?: boolean
}

export interface WebhookResponse {
  say?: string
  set?: VariableMap
}

export interface OrderTurn extends AbstractBotTurn {
  orderType:
    | "BOOK"
    | "RESERVE"
    | "BUY"
    | "PLACE_ORDER"
    | "PAY"
    | "SEND"
    | "RESERVE"
    | "SCHEDULE"
    | "SUBSCRIBE"
  name: string
  description: string
  imageUrl?: string
  merchantName?: string
  confirmationText: string
  onConfirmed: BotTurn | DynamicBotTurn
  onCancelled: BotTurn | DynamicBotTurn
}

export function isOrderBotTurn(
  abstractTurn:
    | AbstractBotTurn
    | BotTurn
    | DynamicBotTurn
    | OrderTurn
    | BridgeTurn
) {
  return abstractTurn && (abstractTurn as OrderTurn).onConfirmed !== undefined
}

export function isDynamicBotTurn(
  abstractTurn:
    | AbstractBotTurn
    | BotTurn
    | DynamicBotTurn
    | OrderTurn
    | BridgeTurn
) {
  return (
    abstractTurn &&
    (abstractTurn as DynamicBotTurn).url !== undefined &&
    (abstractTurn as BridgeTurn).bot === undefined
  )
}

export function isBridgeTurn(
  abstractTurn:
    | AbstractBotTurn
    | BotTurn
    | DynamicBotTurn
    | OrderTurn
    | BridgeTurn
) {
  return abstractTurn && (abstractTurn as BridgeTurn).bot !== undefined
}

export function isDynamicEntity(
  abstractEntity: AbstractEntity | Entity | DynamicEntity
) {
  return abstractEntity && (abstractEntity as DynamicEntity).url !== undefined
}

export function isSystemEntity(
  abstractEntity: AbstractEntity | Entity | SystemEntity
) {
  return abstractEntity && (abstractEntity as Entity).enums === undefined
}

export function turnHasWebhook(
  abstractTurn:
    | AbstractBotTurn
    | BotTurn
    | DynamicBotTurn
    | OrderTurn
    | BridgeTurn
) {
  return abstractTurn && (abstractTurn as DynamicBotTurn).url !== undefined
}
