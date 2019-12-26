const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')

async function run() {
  try {
    const octokit = new GitHub(process.env.GITHUB_TOKEN)
    const { owner, repo } = context.repo
    const tag = core.getInput('tag')

    const createRefResponse = await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/release-${tag}`,
      sha: context.payload.head_commit.id
    })
    console.log(context.payload.head_commit.id, repo, owner)
    console.log(JSON.stringify(createRefResponse, undefined, 2))
  } catch (err) {
    core.setFailed(err.message)
  }

}

run()
// try {
//   const nameToGreet = core.getInput('who-to-greet')
//   console.log(`Hello ${nameToGreet}`)
//   const time = (new Date()).toTimeString()
//   core.setOutput("time", time)

//   const payload = JSON.stringify(context.payload, undefined, 2)
//   console.log('Event payload', payload)
// } catch (err) {
//   core.setFailed(err.message)
// }
