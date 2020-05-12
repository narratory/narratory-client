import { BotTurn, ANYTHING } from "narratory"
import * as nlu from "./nlu"

/* 
    Narrative, i.e the bot-driven interaction
*/

const greeting = ["Hi there", "Greetings", "hello"]

const metBefore: BotTurn = {
  say: "have we met before?",
  user: [
    {
      intent: nlu.yes,
      bot: {
        say: "Oh really, do you remember when?",
        user: [{ intent: ANYTHING, bot: ["Interesting", "I see"] }]
      }
    },
    {
      intent: nlu.no,
      bot: "Well, it is a pleasure to talk to you!"
    }
  ]
}

const favVirtualAssistant: BotTurn = {
  say: [
    "Which is your favorite virtual assistant?",
    "Who is your favorite virtual assistant?"
  ],
  user: [
    { intent: nlu.favAssistant, bot: `Oh, I love _myFavAssistant` },
    {
      intent: ["What is a virtual assistant", "what do you mean"],
      bot: {
        say:
          "For example, Alexa from Amazon, Google Assistant and of course Siri from Apple. Do you have a favorite?",
        repair: true
      }
    },
    {
      intent: [
        ...nlu.no.examples,
        "No",
        "I don't have a favorite",
        "No one",
        "none",
        "They all stink"
      ],
      bot: "Oh, well. That's okay. Maybe you'll like me more!"
    }
  ]
}

const builtAssistantApp: BotTurn = {
  cond: { myFavAssistant: true },
  say: `Have you tried building an app for _myFavAssistant?`,
  user: [
    {
      intent: nlu.yes,
      bot:
        "Oh, that is fantastic. I'm glad you're about to try building one with me now!"
    },
    {
      intent: nlu.no,
      bot: "I see. Well, happy to have you here!"
    }
  ]
}

const goodbye: BotTurn = {
  say: ["That's it for now, it was a pleasure to talk to you!"]
}

export const narrative = [
  greeting,
  metBefore,
  favVirtualAssistant,
  builtAssistantApp,
  goodbye
]
