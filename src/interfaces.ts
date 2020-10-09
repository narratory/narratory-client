import { Language } from "./data/languages"
import { Content } from "./richContent"

export interface Agent {
  agentName: string
  builderId?: string
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
  id?: string
  name: string
  default?: string
}

export interface Entity extends AbstractEntity {
  enums: Enum[]
  fuzzyMatching?: boolean
}

export interface DynamicEntity extends Entity {
  url: string
  type: "BUILD" | "SESSION" | "TURN"
}

export interface CompositeEntity extends AbstractEntity {
  entities: EntityMap,
  fuzzyMatching?: boolean
  examples: string[]
  outputFormat?: string
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
  [key: string]: AbstractEntity | Entity | CompositeEntity | SystemEntity
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

export interface RepairObject {
  repair: boolean
  parent: boolean
  repeat: boolean
}

export interface AbstractBotTurn {
  id?: string
  say?: string | RichSay | Array<string | RichSay>
  repair?: boolean | "PARENT" | RepairObject
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

export function isSystemEntity(abstractEntity: AbstractEntity) {
  return abstractEntity && (abstractEntity as Entity).enums === undefined && !isCompositeEntity(abstractEntity)
}

export function isCompositeEntity(abstractEntity: AbstractEntity) {
  return abstractEntity && (abstractEntity as CompositeEntity).entities !== undefined
}

export function turnHasWebhook(abstractTurn: AbstractBotTurn | BotTurn | DynamicBotTurn | OrderTurn | BridgeTurn) {
  return abstractTurn && (abstractTurn as DynamicBotTurn).url !== undefined
}

export interface LogTurn {
  id: string
  message: RichSay
  nlu: {
    intentName?: string
    parameters: { [key: string]: any }
    isFallback: boolean
    confidence: number
  }
  sender: "USER" | "BOT" | "OPERATOR"
  receiver: "USER" | "BOT" | "OPERATOR"
  handoverTo: "BOT" | "OPERATOR" | null
  isEndOfConversation: boolean
  timestamp: number
}

export interface Log {
  projectId: string
  builderId: string
  platform: string
  sessionId: string
  turns: LogTurn[]
  fallbackCount: number
  fallbackStreak: number
  updatedAt: number
  createdAt: number
  servedBy: "BOT" | "OPERATOR"
  operatorId?: string // Uuid of user
  active: boolean
}

// Status: figuring out the data model above. Should then be possible to add to the Gateway (maybe it should be renamed broker) to "broker" the users messages to either the bot or not. If not, the frontend will subscribe to all Logs with active=true and servedBy=operator

// When sending new messages, they will be published as new entries in the log. 

// The client will need to subscribe to these messages somehow.. 
