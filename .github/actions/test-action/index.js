const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')

async function createReleaseBranch() {
  const octokit = new GitHub(process.env.GITHUB_TOKEN)
  const { owner, repo } = context.repo
  const tag = core.getInput('tag')
  const releaseBranch = `release-${tag}`
  core.setOutput('branch-name', releaseBranch)

  return await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${releaseBranch}`,
    sha: context.payload.head_commit.id
  })
}

async function run() {
  try {
    const createRefResponse = await createReleaseBranch()

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
