import * as systemEntities from "./intents"
import { Intent } from "./interfaces"

export { create } from "./createAgent"
export { chat } from "./chat"
export { getStartTurnIndex } from "./helpers"
export * from "./interfaces"

export { Language } from "./languages"
export const entities = systemEntities
export const ANYTHING : Intent = {
    examples: ["__ANYTHING"]
}