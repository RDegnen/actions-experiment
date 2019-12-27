const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')
const fs = require('fs')
const path = require('path')

function promisifyCallback(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

async function run() {
  try {
    const octokit = new GitHub(process.env.GITHUB_TOKEN)
    const { owner, repo } = context.repo
    const { email } = context.payload.pusher
    const packageFileName = 'package.json'
    const packageFilePath = path.join(
      process.env.GITHUB_WORKSPACE,
      packageFileName
    )
    const packageObj = JSON.parse(await promisifyCallback(fs.readFile, packageFilePath))
    packageObj.version = process.env.tag
    const jsonPackage = JSON.stringify(packageObj)
    //console.log(email)
    //console.log(context.repo)
    // To commit an update directly to a branch, might not need to checkout the release branch before this.
    // https://octokit.github.io/rest.js/#octokit-routes-repos-create-or-update-file

    const { data: { sha } } = await octokit.repos.getContents({
      owner,
      repo,
      path: packageFileName
    })

    const updateFileResponse = await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path: packageFileName,
      message: `Update package version to ${process.env.tag}`,
      content: Buffer.from(jsonPackage).toString('base64'),
      sha,
      branch: core.getInput('ref'),
      committer: {
        name: owner,
        email
      },
      author: {
        name: owner,
        email
      }
    })
    console.log(updateFileResponse)
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
