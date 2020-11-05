import { Language } from "./data/languages"

export const API_VERSION = "2"
export const CUSTOM_START_URL = "https://api.narratory.io/customStart"
export const CREATE_AGENT_URL = "https://api.narratory.io/create_v" + API_VERSION 
export const CREATE_AGENT_URL_LOCAL = "http://localhost:3000/create_v" + API_VERSION
export const DEPLOY_AGENT_URL = "https://api.narratory.io/deploy_v" + API_VERSION 
export const DEPLOY_AGENT_URL_LOCAL = "http://localhost:3000/deploy_v" + API_VERSION 
export const VALIDATE_AGENT_URL = "https://api.narratory.io/validate_v" + API_VERSION
export const VALIDATE_AGENT_URL_LOCAL = "http://localhost:3000/validate_v" + API_VERSION 
export const DIALOGFLOW_RETRY_ATTEMPTS = 2
export const DEFAULT_LANGUAGE = Language.EnglishUS
export const DELAY_AFTER_TRAINING = 5000