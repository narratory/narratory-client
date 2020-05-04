"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var narrative_1 = __importDefault(require("./narrative"));
var userInitiatives_1 = __importDefault(require("./userInitiatives"));
var narratory_1 = require("narratory");
var agent = {
    agentName: "$AGENT_NAME$",
    language: narratory_1.Language.$LANGUAGE$,
    narrative: narrative_1.default,
    userInitiatives: userInitiatives_1.default,
    bridges: ["So", "Where were we", "Now"],
    narratoryKey: require("../narratory_credentials.json").narratoryKey,
    googleCredentials: require("../google_credentials.json") // Populate this file, or change the link to your existing credentials file. Check the README.md for how to create it.
};
exports.default = agent;
