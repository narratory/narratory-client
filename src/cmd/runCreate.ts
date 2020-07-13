import chalk from "chalk"
import fs from "fs-extra"
import { execSync } from "child_process"
import inquirer from "inquirer"
import path from "path"
import shell from "shelljs"
import kebabCase from "lodash.kebabcase"
import replace from "replace-in-file"
import { Language } from "../data/languages"

function hasYarn(): boolean {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" })
    return true
  } catch (e) {
    return false
  }
}

async function updatePkg(pkgPath: string, obj: any): Promise<void> {
  const content = await fs.readFile(pkgPath, "utf-8")
  const pkg = JSON.parse(content)
  const newPkg = Object.assign(pkg, obj)

  await fs.outputFile(pkgPath, JSON.stringify(newPkg, null, 2))
}

export async function initAgent({
  rootDir,
  agentName,
  reqTemplate = "starter",
}: {
  rootDir: string
  agentName?: string
  reqTemplate?: string
}): Promise<void> {
  const useYarn = hasYarn()
  const templatesDir = path.resolve(__dirname, "../../templates")
  const templates = fs
    .readdirSync(templatesDir)
    .filter((d) => !d.startsWith(".") && !d.startsWith("README"))

  const templateChoices = [...templates]

  let name = agentName

  // Prompt if siteName is not passed from CLI.
  if (!name) {
    const { name: promptedName } = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "What should we call your agent?",
      default: "MyFirstAgent",
    })
    name = promptedName
  }

  if (!name) {
    throw new Error(chalk.red("An agent name is required"))
  }

  const dest = path.resolve(rootDir, name)

  if (fs.existsSync(dest)) {
    throw new Error(`Directory already exists at ${dest} !`)
  }

  let template = reqTemplate
  // Prompt if template is not provided from CLI.
  if (templates.length > 1) {
    const { template: promptedTemplate } = await inquirer.prompt({
      type: "list",
      name: "template",
      message: "Choose a template for your agent...",
      choices: templateChoices,
    })
    template = promptedTemplate
  }

  const { language } = await inquirer.prompt({
    type: "list",
    name: "language",
    message: "What should be the main language for your agent?",
    choices: Object.keys(Language),
  })

  const { narratoryKey } = await inquirer.prompt({
    type: "input",
    name: "narratoryKey",
    message:
      "What is your Narratory key? You can find it on https://app.narratory.io/ [Press ENTER to do this later]",
  })

  // const { wantToInputgoogleCredentials } = await inquirer.prompt({
  //   type: "confirm",
  //   name: "wantToInputgoogleCredentials",
  //   message:
  //     "Do you want to paste in your Google Credentials for your Dialogflow agent? You can do this later aswell",
  // })

  let googleCredentials
  // if (wantToInputgoogleCredentials) {
  //   const { _googleCredentials } = await inquirer.prompt({
  //     type: "editor",
  //     name: "_googleCredentials",
  //     message:
  //       "This will open your default text editor allowing you to paste in the Google Credentials JSON file.",
  //   })
  //   googleCredentials = _googleCredentials
  // }

  console.log(chalk.cyan("\nCreating new Narratory agent ...\n"))

  if (template && templates.includes(template)) {
    // templates.
    try {
      await fs.copy(path.resolve(templatesDir, template), dest)
    } catch (err) {
      console.log(`Copying template: ${chalk.cyan(template)} failed!`)
      throw err
    }
  } else {
    throw new Error("Invalid template")
  }

  // Update package.json info.
  try {
    await updatePkg(path.join(dest, "package.json"), {
      name: kebabCase(name),
      version: "0.0.0",
      private: true,
    })
  } catch (err) {
    console.log(chalk.red("Failed to update package.json"))
    throw err
  }

  if (narratoryKey && narratoryKey.trim().toLowerCase() !== "skip") {
    try {
      await updatePkg(path.join(dest, "narratory_credentials.json"), {
        narratoryKey: narratoryKey.trim(),
      })
    } catch (err) {
      console.log(chalk.red("Failed to update narratory_credentials.json"))
      throw err
    }
  }

  // try {
  //   if (googleCredentials && JSON.parse(googleCredentials)) {
  //     await updatePkg(path.join(dest, "google_credentials.json"), {
  //       ...JSON.parse(googleCredentials),
  //     })
  //   }
  // } catch (err) {
  //   console.log(chalk.red("Failed to update google_credentials.json"))
  //   console.log(googleCredentials)

  //   throw err
  // }

  // We need to rename the gitignore file to .gitignore
  if (
    !fs.pathExistsSync(path.join(dest, ".gitignore")) &&
    fs.pathExistsSync(path.join(dest, "gitignore"))
  ) {
    await fs.move(path.join(dest, "gitignore"), path.join(dest, ".gitignore"))
  }
  if (fs.pathExistsSync(path.join(dest, "gitignore"))) {
    fs.removeSync(path.join(dest, "gitignore"))
  }

  const agentPath = path.join(dest, "src", "agent.ts")
  if (fs.pathExistsSync(agentPath)) {
    try {
      await replace.replaceInFile({
        files: agentPath,
        from: ["$AGENT_NAME$", "$LANGUAGE$"],
        to: [name, language],
      })
    } catch (error) {
      console.log(chalk.red("Error renaming agent.ts file"))
    }
  }

  const pkgManager = useYarn ? "yarn" : "npm"

  console.log(`Installing dependencies with: ${chalk.cyan(pkgManager)}`)

  try {
    shell.exec(`cd "${name}" && ${useYarn ? "yarn" : "npm install && node_modules/.bin/tsc"}`, {
      silent: true,
    })
  } catch (err) {
    console.log(chalk.red("Installation of dependencies failed"))
    throw err
  }
  console.log()

  // Display the most elegant way to cd.
  const cdpath =
    path.join(process.cwd(), name) === dest
      ? name
      : path.relative(process.cwd(), name)

  console.log(`Success! Created ${chalk.cyan(cdpath)}\n`)
  console.log("Inside that directory, you can run several commands:")
  console.log(
    chalk.cyan(`  narratory start`) +
      "    Builds and starts an interactive chat with your agent."
  )
  console.log(chalk.cyan(`  narratory build`) + "    Builds your agent")
  console.log(
    chalk.cyan(`  narratory chat`) +
      "     Starts an interactive chat with your agent."
  )

  if (!narratoryKey || !googleCredentials) {
    console.log()
    console.log(chalk.yellow("For the above commands to work you need to: \n"))
    if (!narratoryKey) {
      console.log(
        chalk.yellow(
          `- Paste in your Narratory key in ${chalk.bold(
            "narratory_credentials.json"
          )}. You can get it at https://app.narratory.io`
        )
      )
    }
    if (!googleCredentials) {
      console.log(
        chalk.yellow(
          `- Paste in your Google Credentials for your Dialogflow project in ${chalk.bold(
            "google_credentials.json"
          )}. Follow the guide at https://narratory.io/docs/setup to get your JSON credentials.`
        )
      )
    }
  } else {
    console.log("We suggest that you begin by typing:")
    console.log()
    console.log(chalk.cyan("  cd"), cdpath)
    console.log(`  ${chalk.cyan(`narratory start`)}`)
  }
  console.log()
  console.log(
    "Happy building! Feel free to reach out in our communities on either Slack or Facebook if you get stuck somewhere. You can also send an e-mail to support@narratory.io if you want to speak directly to someone from the Narratory-team."
  )
}
