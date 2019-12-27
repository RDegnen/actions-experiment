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
    const packageFiles = ['package.json', 'package-lock.json']

    packageFiles.forEach(async packageFileName => {
      const packageFilePath = path.join(
        process.env.GITHUB_WORKSPACE,
        packageFileName
      )
      const packageObj = JSON.parse(await promisifyCallback(fs.readFile, packageFilePath))
      packageObj.version = process.env.tag
      const jsonPackage = JSON.stringify(packageObj, undefined, 2)
  
      const { data: { sha } } = await octokit.repos.getContents({
        owner,
        repo,
        path: packageFileName
      })
  
      const userInfo = {
        name: owner,
        email
      }
  
      const updateFileResponse = await octokit.repos.createOrUpdateFile({
        owner,
        repo,
        path: packageFileName,
        message: `Update ${packageFileName} version to ${process.env.tag}`,
        content: Buffer.from(jsonPackage).toString('base64'),
        sha,
        branch: core.getInput('ref'),
        committer: userInfo,
        author: userInfo
      })
      console.log(updateFileResponse)
    })
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
