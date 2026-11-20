---
name: karpathy-guidelines
description: "Andrej Karpathy's operating guidelines for AI coding agents: think before coding, simplicity first, surgical changes, and goal-driven execution."
allowed-tools: Read Write Edit Glob Grep
---
# Andrej Karpathy's Coding Agent Guidelines

> Operational discipline for AI coding assistants derived from Andrej Karpathy's insights.
> Eliminate AI slop, stop hidden assumptions, avoid architectural bloat, make surgical changes, and loop until verified.

---

## The Four Core Principles

### 1. Think Before Coding (Stop Hidden Assumptions)
- **The Pitfall:** LLMs tend to make silent assumptions on behalf of the user, pick one interpretation of an ambiguous prompt, and charge forward without checking.
- **The Rule:**
  - State assumptions explicitly before modifying files.
  - If a requirement has multiple interpretations or trade-offs, surface them clearly.
  - Never guess or hide confusion. If an API contract, path, or requirement is unclear, verify with codebase evidence or ask.
  - Push back on fundamentally flawed approaches with constructive, reasoned alternatives.

### 2. Simplicity First (Minimum Code That Solves the Problem)
- **The Pitfall:** AI models naturally lean toward overcomplicating code—creating bloated abstractions, writing 500 lines when 30 will do, or adding unrequested configurability.
- **The Rule:**
  - Write the minimum code required to solve the immediate problem.
  - Avoid speculative features, "future-proofing", or YAGNI (You Aren't Gonna Need It) bloat.
  - No single-use helper abstractions unless they genuinely improve readability.
  - No defensive error handling for impossible scenarios.
  - Benchmark question: *"Would a senior engineer say this is overcomplicated?"*

### 3. Surgical Changes (Touch Only What You Must)
- **The Pitfall:** Models often act like an overly eager intern—touching adjacent code, "improving" comments, reformatting files, or breaking things orthogonal to the task.
- **The Rule:**
  - Touch *only* the lines and files required for the task.
  - Keep git diffs as small, tight, and readable as possible.
  - Do not refactor code that is not broken.
  - Do not alter adjacent formatting or re-order unrelated functions.
  - Match the existing codebase style, naming conventions, and patterns.
  - Clean up only the orphan variables or imports created by your own changes.

### 4. Goal-Driven Execution (Define Success Criteria & Loop)
- **The Pitfall:** Tasks drift because agents lack clear, verifiable success criteria and stop halfway or deliver broken builds.
- **The Rule:**
  - Define checkable success criteria before finishing (e.g. "Test suite passes", "Typecheck passes with zero errors", "Build bundle succeeds").
  - Test before and after making changes.
  - If tests fail, diagnose systematically from logs and errors—do not make random speculative changes.
  - Loop and verify until every criterion is met.

