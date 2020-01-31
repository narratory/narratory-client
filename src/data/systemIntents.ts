import { Intent } from "../interfaces"

export const SignInSuccess: Intent = {
    examples: ["__SIGNIN_SUCCESS", "SUCCESS"]
}

export const SignInFailed: Intent = {
    examples: ["__SIGNIN_FAILED", "FAILED"]
}

export const ANYTHING: Intent = {
    examples: ["__ANYTHING"]
}

export const SILENCE: Intent = {
    examples: ["__SILENCE"]
}

export const EXIT = "__EXIT"