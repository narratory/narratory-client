"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var nlu = __importStar(require("./nlu"));
/*
    Questions and other user-driven initiatives
*/
var nameQuery = {
    intent: ["What is your name", "who are you", "what can I call you"],
    bot: "I don't have any name yet, unfortunately."
};
var favoriteNumber = Math.floor(Math.random() * 9) + 1; // A number between 1 and 9. Note, this is calculated when the agent is created, not when it is run.
var favoriteQuestions = [
    { intent: nlu.favNumber, bot: "my favorite number is " + favoriteNumber },
    {
        intent: ["What time is it?", "what time is it right now?"],
        bot: "It's time to build some voice apps, that is for sure!"
    }
];
exports.default = __spreadArrays([nameQuery], favoriteQuestions);
