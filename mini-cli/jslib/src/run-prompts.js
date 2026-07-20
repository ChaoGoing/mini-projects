const inquirer = require("inquirer");
const validate = require("validate-npm-package-name");

async function runInitPrompts(pathname, argv) {
  const { name } = argv;
  const promtList = [
    {
      type: "input",
      message: "library name",
      name: "name",
      default: pathname || name,
      validate: (val) => {
        if (!val) return "please enter name";
        return true;
      },
    },
    {
      type: "input",
      message: "npm package name",
      name: "npmname",
      default: pathname || name,
      validate: function (val) {
        if (!validate(val).validForNewPackages) return "Forbidden npm name";
        return true;
      },
    },
    {
      type: "input",
      message: "github user name",
      name: "username",
      default: "min-cli",
    },
    {
      type: "confirm",
      name: "prettier",
      message: "use prettier",
      default: true,
    },
    {
      type: "confirm",
      name: "eslint",
      message: "use eslint?",
      default: true,
    },
    {
      type: "checkbox",
      message: "use commitlint:",
      name: "commitlint",
      choices: ["commitlint", "standard-version"],
      default: ["commitlint"],
      filter: function (values) {
        return values.reduce((res, cur) => {
          return { ...res, [cur]: true };
        }, {});
      },
    },
    {
      type: "checkbox",
      message: "use test:",
      name: "test",
      choices: ["mocha", "poppeteer"],
      default: ["mocha"],
      filter: function (values) {
        return values.reduce((res, cur) => ({ ...res, [cur]: true }), {});
      },
    },
    {
      type: "confirm",
      name: "husky",
      message: "use husky?",
      default: true,
    },
    {
      type: "list",
      message: "use cli:",
      name: "ci",
      choices: ["github", "circleci", "traivs", "none"],
      filter: function (value) {
        return {
          github: "github",
          circleci: "circleci",
          travis: "travis",
          none: "null",
        }[value];
      },
    },
  ];
  return inquirer.prompt(promtList);
}

exports.runInitPrompts = runInitPrompts;
