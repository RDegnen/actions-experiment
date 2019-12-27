const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')
const fs = require('fs')
const path = require('path')

function promisifyCallback(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if (err) throw reject(err)
      resolve(data)
    })
  })
}

async function run() {
  try {
    const packageFilePath = path.join(
      process.env.GITHUB_WORKSPACE,
      'package.json'
    )
    const packageObj = JSON.parse(await promisifyCallback(fs.readFile, packageFilePath))
    packageObj.version = process.env.tag
    console.log(JSON.stringify(packageObj, undefined, 2))
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
