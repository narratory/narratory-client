export interface WebhookPayload {
  endOfConversation: boolean
  narratoryIntentName: string
  classificationConfidence: number
}

export interface NarratoryResponse {
  messages: {
    text: string
    fromUser: boolean
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
}
