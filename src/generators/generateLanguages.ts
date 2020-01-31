// extracted from https://cloud.google.com/dialogflow/docs/reference/language
const languagesArray = require("../data/languages.json")

const languages = languagesArray.slice(1).map(arr => {
    return {
        name: arr[0],
        code: arr[1]
    }
})

let str = "export enum Language {\n"

function getCamelCase(str) {
    return str.split(" ").join("").replace(/-([A-z])/g, function (g) { return g[1].toUpperCase(); })
}

languages.forEach(obj => {
    str += `${getCamelCase(obj.name)} = "${obj.code}",\n`
});

str += "}"

require("fs").writeFile("src/languages.ts", str, (err: any) => { if (err) console.log("Failed writing languages.ts file. Err:", err)})
