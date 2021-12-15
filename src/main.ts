import * as core from "@actions/core"
import * as github from "@actions/github"

async function run (): Promise<void> {
    try {
        const { owner: currentOwner, repo: currentRepo } = github.context.repo

        const token = core.getInput("GITHUB_TOKEN")
        const octokit = github.getOctokit(token)
        core.info("Fetching latest release")
        const data = await octokit.rest.repos.getLatestRelease({
            owner: currentOwner,
            repo: currentRepo
        })
        core.info(JSON.stringify(data, null, 2))
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()
