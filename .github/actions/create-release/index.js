const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')

function run() {
  try {
    console.log(JSON.stringify(context.payload, undefined, 2))
  } catch (err) {
    core.setFailed(err)
  }
}

run()