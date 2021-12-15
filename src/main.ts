import * as core from "@actions/core"
import * as github from "@actions/github"

async function run (): Promise<void> {
    try {
        const token = core.getInput("GITHUB_TOKEN")
        const octokit = github.getOctokit(token)
        console.log(octokit)
        const data = await octokit.rest.repos.listReleases()
        console.log(data)
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()
