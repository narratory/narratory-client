import { runValidate } from "./functions";

const runAsync = async () => {
  await runValidate()
  process.exit()
}

runAsync()