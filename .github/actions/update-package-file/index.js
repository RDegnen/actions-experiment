const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')
const fs = require('fs')
const path = require('path')

async function run() {
  try {
    const packageFilePath = path.join(
      process.env.GITHUB_WORKSPACE,
      'package.json'
    )
    fs.readFile(packageFilePath, (err, data) => {
      if (err) core.setFailed(err)
      console.log(JSON.parse(data))
    })
    // console.log(process.env.tag)
    // const payload = JSON.stringify(context.payload, undefined, 2)
    // console.log('Event payload', payload)
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
