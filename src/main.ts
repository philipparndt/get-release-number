import * as core from "@actions/core"
import * as github from "@actions/github"
import semver from "semver/preload"

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

export const formatRelease = (version: string) => {
    return version.split("-")[0]
}

export const nextPatch = (version: string) => {
    return semver.inc(version, "patch")
}

export const nextMinor = (version: string) => {
    return semver.inc(version, "minor")
}

export const nextMajor = (version: string) => {
    return semver.inc(version, "major")
}

export const getRelease = (version: string, type: string) => {
    switch (type) {
    case "patch":
        return nextPatch(version)
    case "minor":
        return nextMinor(version)
    case "major":
        return nextMajor(version)
    case "current":
        return version
    default:
        throw Error(`Unknown release type: ${type}`)
    }
}

async function run (): Promise<void> {
    try {
        const release = await getCurrentRelease()
        const clean = formatRelease(release)
        core.info(`Current release is '${release}`)
        const type = core.getInput("releaseType")
        const next = getRelease(clean, type) ?? "0.0.0"
        core.info(`Result version is '${next}`)
        core.setOutput("version", next)
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()
