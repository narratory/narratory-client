import axios from 'axios'

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

export const getBaseUrl = (req: any): string => {
    const protocol = (req && req.headers.referer) ? req.headers.referer.split('://')[0] : "http" // default https, for deployed scenarios
    return req ? `${protocol}://${req.headers.host}` : "" // empty string as fallback base url
}

export const getRandomElement = (arr: Array<any>) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function isEmpty(obj: Object) {
    return Object.keys(obj).length === 0;
}