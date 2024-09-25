// lib/create.js
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const Generator = require("./Generator");

module.exports = async function (name, options) {
  console.log(">>> create.js", name, options);
  const targetDir = path.resolve(process.cwd(), name);

  const exist = fs.existsSync(targetDir);
  if (exist) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      // ask operator if need to overwrite
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "Target directory already exists Pick an action:",
          choices: [
            {
              name: "Overwrite",
              value: "overwrite",
            },
            {
              name: "Cancel",
              value: false,
            },
          ],
        },
      ]);

      if (!action) {
        return;
      } else if (action === "overwrite") {
        console.log(`\r\nRemoving...`);
        await fs.remove(targetDir);
      }
    }
  }

  const generator = new Generator(name, targetDir);

  generator.create();
};
