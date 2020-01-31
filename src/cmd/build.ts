import { build } from "./functions";

const runAsync = async () => {
  await build()
  process.exit()
}

runAsync()