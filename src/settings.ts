import { Language } from "./languages"

export const API_VERSION = "v2"
export const CUSTOM_START_URL = "https://europe-west1-narratory-1.cloudfunctions.net/customStart"
export const CREATE_AGENT_URL = "https://europe-west1-narratory-1.cloudfunctions.net/create_" + API_VERSION
export const DIALOGFLOW_RETRY_ATTEMPTS = 2
export const DEFAULT_LANGUAGE = Language.EnglishUS