import axios from 'axios'
const fs = require("fs")

export const callApi = async (url: string, data: object): Promise<any> => {
    const repson = await axios({
        url,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data)
    })

    return await repson.data
}

export function isEmpty(obj: Object) {
    return Object.keys(obj).length === 0;
}

const expectedIndex = 2

export function getStartTurnIndex(args: string[], agent): number | undefined {
    if (args.length > expectedIndex &&
        !isNaN(args[expectedIndex] as any) &&
        parseInt(args[expectedIndex]) <= agent.narrative.length &&
        parseInt(args[expectedIndex]) > 1) {
        return parseInt(args[expectedIndex])
    }
    else {
        return undefined
    }
}

export async function listDir(dir: string) {
    try {
        return fs.promises.readdir(dir);
    } catch (err) {
        if (err) {
            console.error('Error occured while reading directory!', err);
        }
    }
}

export async function readFile(path: string) {
    try {
        return fs.promises.readFile(path);
    } catch (err) {
        if (err) {
            console.error('Error occured while reading file!', err);
        }
    }
}