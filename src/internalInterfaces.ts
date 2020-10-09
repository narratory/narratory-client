import { RichSay } from "./interfaces"

export interface WebhookPayload {
  endOfConversation: boolean
  narratoryIntentName: string
  classificationConfidence: number
  richMessages: RichSay[]
  richContent: boolean
  handover: boolean
}

export interface NarratoryResponse {
  messages: {
    text: string
    fromUser: boolean
    richContent: boolean
    content?: any
    suggestions?: string[]
  }[]
  narratoryIntentName?: string
  classificationConfidence?: number
  contexts: any[]
  sessionId?: string
  endOfConversation: boolean
  responseTimeTotal?: number
  responseTimeWebhook?: number
  attempts: number
  rawResponse: any
  handover: boolean
}
