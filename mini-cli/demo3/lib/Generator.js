const { getRepoList, getTagList } = require("./http");
const ora = require("ora");
const inquirer = require("inquirer");
const util = require("util");

const loadingFn = async (fn, message, ...args) => {
  const spinner = ora(message);
  spinner.start();

  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (e) {
    spinner.fail("request fail");
  }
};

module.exports = class Generator {
  constructor(name, dir) {
    this.name = name;
    this.dir = dir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async getRepo() {
    const repoList = await loadingFn(getRepoList, "wait fetch template");
    console.log(repoList);
    const repos = repoList.map((item) => item.name);
    const { repo } = inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "choose a template to create project",
    });

    return repo;
  }

  async create() {
    const target_repo = await this.getRepo();
    console.log("selected ", target_repo);
    const target_tag = await getTagList(target_repo);
    const files = this.downloadGitRepo(target_repo, target_tag);
  }
};
