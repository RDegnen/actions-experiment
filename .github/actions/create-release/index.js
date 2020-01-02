const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')

function run() {
  try {
    // console.log(JSON.stringify(context.payload, undefined, 2))
    // payload has a merged flag that can be used to determine if the closed request was actually merged
    // can also get merged branch from payload to get the tag
    const octokit = new GitHub(process.env.GITHUB_TOKEN)
    const { merged, head } = context.payload
    console.log(context.payload.pull_request)

    // use https://octokit.github.io/rest.js/#octokit-routes-repos-create-release to create a tag
  } catch (err) {
    core.setFailed(err)
  }
}

run()