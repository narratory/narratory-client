import { Language } from "./data/languages"

export const API_VERSION = "2"
export const CUSTOM_START_URL = "https://europe-west1-narratory-1.cloudfunctions.net/customStart"
export const CREATE_AGENT_URL = "https://europe-west1-narratory-1.cloudfunctions.net/create_v" + API_VERSION 
export const CREATE_AGENT_URL_LOCAL = "http://localhost:5000/narratory-1/europe-west1/create_v" + API_VERSION
export const DEPLOY_AGENT_URL = "https://europe-west1-narratory-1.cloudfunctions.net/deploy_v" + API_VERSION 
export const DEPLOY_AGENT_URL_LOCAL = "http://localhost:5000/narratory-1/europe-west1/deploy_v" + API_VERSION 
export const DIALOGFLOW_RETRY_ATTEMPTS = 2
export const DEFAULT_LANGUAGE = Language.EnglishUS