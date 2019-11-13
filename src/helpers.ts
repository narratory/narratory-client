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

export function isEmpty(obj: Object) {
    return Object.keys(obj).length === 0;
}