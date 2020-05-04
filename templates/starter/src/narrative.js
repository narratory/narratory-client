"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var narratory_1 = require("narratory");
var intents = __importStar(require("./nlu"));
/*
    Narrative, i.e the bot-driven interaction
*/
var greeting = ["Hi there", "Greetings", "hello"];
var metBefore = {
    say: "have we met before?",
    user: [
        {
            intent: ["Yes", "Indeed", "Absolutely", "we have", "I think so"],
            bot: {
                say: "Oh really, do you remember when?",
                user: [{ intent: narratory_1.ANYTHING, bot: ["Interesting", "I see"] }]
            }
        },
        {
            intent: ["No", "I don't think so", "I have no idea", "I don't know"],
            bot: "Well, it is a pleasure to talk to you!"
        }
    ]
};
var favVirtualAssistant = {
    say: ["Which is your favorite virtual assistant?", "Who is your favorite virtual assistant?"],
    user: [
        { intent: intents.favAssistant, bot: "Oh, I love _myFavAssistant" },
        {
            intent: ["What is a virtual assistant", "what do you mean"],
            bot: {
                say: "For example, Alexa from Amazon, Google Assistant and of course Siri from Apple. Do you have a favorite?",
                repair: true
            }
        },
        {
            intent: ["No", "I don't have a favorite", "No one", "none", "They all stink"],
            bot: "Oh, well. That's okay. Maybe you'll like me more!"
        }
    ]
};
var builtAssistantApp = {
    cond: { myFavAssistant: true },
    say: "Have you tried building an app for _myFavAssistant?",
    user: [
        {
            intent: ["yes", "I have", "yep", "of course", "absolutely"],
            bot: "Oh, that is fantastic. I'm glad you're about to try building one with me now!"
        },
        {
            intent: ["no", "I have not", "nope", "not yet"],
            bot: "I see. Well, happy to have you here!"
        }
    ]
};
var goodbye = {
    say: ["That's it for now, it was a pleasure to talk to you!"]
};
exports.default = [greeting, metBefore, favVirtualAssistant, builtAssistantApp, goodbye];
