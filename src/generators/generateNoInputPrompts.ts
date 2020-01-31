import Axios from "axios"

// https://docs.google.com/spreadsheets/d/1v9bbYRvvUF8VQ8TN65rmi-YVq4jRP6SICX8xGDL9QhQ/edit#gid=0
const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTw5Sb_0VY5Zv_5Zoib9r_bYPnu0MbcBk3Mh2I14njf0fbKD6Zt16M9iuf8mlOI7UIiiUrvVuXbZVth/pub?gid=0&single=true&output=csv"

async function parse(url: string) {
    const response = await Axios.get(url)
    console.log(response.data)
    console.log("====")
    let allTextLines = response.data.split(/\r|\n|\r/);
    
    let headers = allTextLines[0].split(',');
    let lines = [];

    for (let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(',');
        if (data.length === headers.length) {
            let tarr = [];
            for (let j = 0; j < headers.length; j++) {
                tarr.push(data[j]);
            }

            // log each row to see output 
            console.log(tarr);
            lines.push(tarr);
        }
    }
    
    const languages = lines.slice(1).map(arr => {
        return {
            lang: arr[0],
            noInputs: arr.slice(1)
        }
    })
    
    const str = `export const noInputs = ${JSON.stringify(languages, null, 2)}` 
        
    require("fs").writeFile("src/noInputs.ts", str, (err: any) => { if (err) console.log("Failed writing noInputs.ts file. Err:", err)})
    
}

parse(url)

// let reader: FileReader = new FileReader();
// reader.readAsText(this.fileReaded);

//  reader.onload = (e) => {
//  let csv: string = reader.result;
