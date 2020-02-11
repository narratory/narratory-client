import { runDeploy } from "./functions";

const runAsync = async () => {
  await runDeploy()
  process.exit()
}

runAsync()