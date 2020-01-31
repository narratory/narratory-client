import { isEmpty } from "../helpers"

// extracted from https://cloud.google.com/dialogflow/docs/reference/system-entities
const systemEntitiesArray = require("../data/system_entities.json")
const systemEntitiesExamplesArray = require("../data/system_entities_examples.json")

const systemEntityExamples : Array<{name: string, default: string, language: string }> = systemEntitiesExamplesArray.slice(1).map(arr => {
    return {
        name: arr[1],
        default: arr[2],
        language: arr[0]
    }
})

const systemEntities = systemEntitiesArray.slice(1).map(arr => {
    const name = arr[1]
    const example = systemEntityExamples.find(ex => (ex.name == name && ex.language == "English (en)"))
    if (!example) {
        console.log("Example missing for ", name, ". Skipping it.");
        return {}
    } else {
        const nameWithoutAt = name.slice(1)
        const _def = example.default.split("<br>")[0].trim()
        return {
            category: arr[0],
            name: nameWithoutAt,
            description: arr[3],
            returns: arr[4],
            default: _def == "" ? example.default.split("<br>")[1].trim() : _def
        }
    }
}).filter(obj => !isEmpty(obj))

let str = "import { SystemEntity } from './interfaces'\n\n"

function getCamelCase(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })
}

systemEntities.forEach(obj => {
    str += `export const ${getCamelCase(obj.name.slice(4))} : SystemEntity = ${JSON.stringify(obj)}\n\n`
});

require("fs").writeFile("src/intents.ts", str, (err: any) => console.log("Failed writing intents.ts file. Err:", err))
