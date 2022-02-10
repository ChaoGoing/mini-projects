const cp = require('child_process')
const git = (args) => cp.spawnSync('git', args, { stdio: 'inherit' });
const fs = require('fs');
const p = require('path');
const cwd = process.cwd();

exports.install = function(dir = '.minhusky') {
    // Ensure that we're not trying to install outside of cwd
  if (!p.resolve(process.cwd(), dir).startsWith(process.cwd())) {
    throw new Error(`.. not allowed (see ${url})`)
  }
  if (!fs.existsSync('.git')) {
    throw new Error(`.git can't be found (see ${url})`)
  }
  try {
    // Create .husky/_
    fs.mkdirSync(p.join(dir, '_'), { recursive: true })

    // Create .husky/_/.gitignore
    fs.writeFileSync(p.join(dir, '_/.gitignore'), '*')

    // Copy husky.sh to .husky/_/husky.sh
    fs.copyFileSync(p.join(__dirname, '../husky.sh'), p.join(dir, '_/husky.sh'))

    // Configure repo
    const { error } = git(['config', 'core.hooksPath', dir])
    if (error) {
      throw error
    }
  } catch (e) {
    throw e
  }
}
