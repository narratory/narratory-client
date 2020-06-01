import { Language } from "./data/languages"
import { Content, Image } from "./richContent"

export interface Agent {
  agentName: string
  language: Language
  narrative: Array<AbstractBotTurn | string | string[]>
  userInitiatives?: Array<UserTurn>
  botInitiatives?: Array<AbstractBotTurn>
  bridges?: string[] | BotTurn[]
  defaultFallbacks?: string[]
  narratoryKey: string
  googleCredentials: GoogleCredentials
  maxMessagesPerTurn?: 1 | 2
  allowGateway?: boolean
  skipQueryRepeat?: boolean
  logWebhook?: string
  logLevel?: "NONE" | "FALLBACKS" | "ALL"
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
  type: "BUILD" | "SESSION" | "TURN"
}

export interface SystemEntity extends AbstractEntity {
  category: string
  description: string
  returns: string
  default: string
}

export interface Intent {
  name?: string
  entities?: EntityMap
  examples: string[]
  priority?: number
  noEntityReset?: boolean
  autoAnnotateEntities?: boolean
}

export type EntityMap = {
  [key: string]: AbstractEntity | Entity | SystemEntity
}

export interface UserTurn {
  id?: string
  intent: string[] | Intent
  bot:
    | BotTurn
    | DynamicBotTurn
    | OrderTurn
    | BridgeTurn
    | string
    | Array<BotTurn | DynamicBotTurn | OrderTurn | BridgeTurn | string>
}

export interface Order {
  type: string
  confirmationText: string
  merchantName: string
  name: string
  description: string
}

export type ConditionMap = {
  [key: string]: boolean | string | string[] | number | ConditionMap | undefined
  NOT?: ConditionMap
  OR?: ConditionMap
  AND?: ConditionMap
}

export type VariableMap = {
  [key: string]: string | boolean | number | object | Array<string | boolean | number | object>
}

export interface RichSay {
  text: string | string[]
  ssml?: string | string[]
  cond?: ConditionMap
  suggestions?: string[]
  content?: Content | any
  //| BasicCard | Image | BrowseCarousel | MediaObject | Table | List | Carousel
}

export interface AbstractBotTurn {
  id?: string
  say?: string | RichSay | Array<string | RichSay>
  repair?: boolean | "PARENT"
  label?: string
  goto?: string
  cond?: ConditionMap
  set?: VariableMap
  expectShortAnswer?: boolean
}

export interface BotTurn extends AbstractBotTurn {
  say: string | RichSay | Array<string | RichSay>
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
  orderType: "BOOK" | "RESERVE" | "BUY" | "PLACE_ORDER" | "PAY" | "SEND" | "RESERVE" | "SCHEDULE" | "SUBSCRIBE"
  name: string
  description: string
  imageUrl?: string
  merchantName?: string
  confirmationText: string
  onConfirmed: BotTurn | DynamicBotTurn
  onCancelled: BotTurn | DynamicBotTurn
}

export function isOrderBotTurn(abstractTurn: AbstractBotTurn | BotTurn | DynamicBotTurn | OrderTurn | BridgeTurn) {
  return abstractTurn && (abstractTurn as OrderTurn).onConfirmed !== undefined
}

export function isDynamicBotTurn(abstractTurn: AbstractBotTurn | BotTurn | DynamicBotTurn | OrderTurn | BridgeTurn) {
  return (
    abstractTurn && (abstractTurn as DynamicBotTurn).url !== undefined && (abstractTurn as BridgeTurn).bot === undefined
  )
}

export function isBridgeTurn(abstractTurn: AbstractBotTurn | BotTurn | DynamicBotTurn | OrderTurn | BridgeTurn) {
  return abstractTurn && (abstractTurn as BridgeTurn).bot !== undefined
}

export function isDynamicEntity(abstractEntity: AbstractEntity | Entity | DynamicEntity) {
  return abstractEntity && (abstractEntity as DynamicEntity).url !== undefined
}

export function isSystemEntity(abstractEntity: AbstractEntity | Entity | SystemEntity) {
  return abstractEntity && (abstractEntity as Entity).enums === undefined
}

export function turnHasWebhook(abstractTurn: AbstractBotTurn | BotTurn | DynamicBotTurn | OrderTurn | BridgeTurn) {
  return abstractTurn && (abstractTurn as DynamicBotTurn).url !== undefined
}

export interface LogTurn {
  id: string
  agentName: string
  userInput: string
  intentName: string
  parameters: { [key: string]: any }
  isFallback: boolean
  isEndOfConversation: boolean
  confidence: number
  botReplies: string[]
  timestamp: number
}

export interface LogMessage {
  sessionId: string
  platform: string
  turn: LogTurn
  lastTurn?: LogTurn
  text: string
}