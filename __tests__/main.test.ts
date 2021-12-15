import { describe, expect, test } from "@jest/globals"
import { formatRelease, nextMajor, nextMinor, nextPatch } from "../src/main"

describe("Version handling", () => {
    test("format release", async () => {
        expect(formatRelease("0.0.0")).toBe("0.0.0")
        expect(formatRelease("1.0.0-b42")).toBe("1.0.0")
        expect(formatRelease("1.0.0-b42-other")).toBe("1.0.0")
    })

    test("patch release", async () => {
        expect(nextPatch("0.0.0")).toBe("0.0.1")
        expect(nextPatch("9.0.42")).toBe("9.0.43")
    })

    test("minor release", async () => {
        expect(nextMinor("0.0.0")).toBe("0.1.0")
        expect(nextMinor("9.43.42")).toBe("9.44.0")
    })

    test("major release", async () => {
        expect(nextMajor("0.0.0")).toBe("1.0.0")
        expect(nextMajor("9.0.0")).toBe("10.0.0")
    })
})
