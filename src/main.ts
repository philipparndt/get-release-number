import * as core from "@actions/core"
import * as github from "@actions/github"

const getCurrentRelease = async () => {
    const { owner: currentOwner, repo: currentRepo } = github.context.repo

    const token = core.getInput("GITHUB_TOKEN")
    const octokit = github.getOctokit(token)
    core.info("Fetching latest release")

    try {
        const data = await octokit.rest.repos.getLatestRelease({
            owner: currentOwner,
            repo: currentRepo
        })
        core.info(JSON.stringify(data, null, 2))
        return data.data.tag_name
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "Not Found") {
                return core.getInput("firstRelease")
            }
        }
        core.setFailed(`Failed to fetch releases ${error}`)
        throw error
    }
}

async function run (): Promise<void> {
    try {
        const release = await getCurrentRelease()
        core.info(release)
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()
