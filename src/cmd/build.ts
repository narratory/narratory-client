import { runBuild } from "./functions";

const runAsync = async () => {
  await runBuild()
  process.exit()
}

runAsync()