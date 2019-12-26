const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')

async function run() {
  try {
    console.log(process.env.tag)
    const payload = JSON.stringify(context.payload, undefined, 2)
    console.log('Event payload', payload)
  } catch (err) {
    core.setFailed(err.message)
  }
}