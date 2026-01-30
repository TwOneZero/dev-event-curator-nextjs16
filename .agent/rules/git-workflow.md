---
trigger: always_on
---

---

## description: Git branching workflow for feature development and upgrades

# Git Workflow Rules

## Branch Strategy

**CRITICAL**: All new feature development and upgrades MUST be done on a separate feature branch, never directly on `main`.

### Branch Naming Convention

Based on the project's git history, follow these naming patterns:

- **Features**: `feat/{feature-name}` or simple descriptive names
  - Examples: `database-model`, `api-route`, `caching`
- **Implementations**: `impl-{feature-name}`
  - Example: `impl-posthog`

### Required Workflow

1. **Before starting any new feature or upgrade:**

   ```bash
   # Ensure you're on main and it's up to date
   git checkout main
   git pull origin main

   # Create a new feature branch
   git checkout -b {branch-name}
   ```

2. **During development:**
   - Make commits on the feature branch
   - Follow conventional commit format: `feat(scope):`, `chore:`, `docs:`, etc.
   - Keep commits focused and atomic

3. **Before merging:**
   - Ensure all changes are committed
   - Push the feature branch to remote

   ```bash
   git push origin {branch-name}
   ```

4. **Merging to main:**
   - Create a Pull Request from your feature branch to `main`
   - After review/approval, merge the PR
   - Or merge locally:

   ```bash
   git checkout main
   git merge {branch-name}
   git push origin main
   ```

5. **After merging:**
   - Delete the feature branch (optional but recommended)
   ```bash
   git branch -d {branch-name}
   git push origin --delete {branch-name}
   ```

## Commit Message Format

Follow the established pattern in this project:

- `feat(scope): description` - New features
- `chore: description` - Maintenance tasks, config updates
- `docs: description` - Documentation updates
- `fix(scope): description` - Bug fixes

### Examples from this project:

- `feat(database): MongoDB 연결 설정 및 Event/Booking 모델 추가`
- `feat(events): implement event details, booking system, and api routes`
- `feat(ui): enhance landing page and core components`
- `chore: update configuration, eslint, and prettier settings`

## Rules for AI Assistant

When implementing features or upgrades:

1. ✅ **ALWAYS** check current branch first
2. ✅ **ALWAYS** create a new feature branch before making changes
3. ✅ **ALWAYS** suggest appropriate branch name based on the feature
4. ❌ **NEVER** make commits directly on `main` branch
5. ❌ **NEVER** push changes to `main` without going through a feature branch
6. ✅ Inform the user about the branch creation and workflow steps
7. ✅ After completing work, remind the user to create a PR or merge the branch

## Exception Cases

The only acceptable direct commits to `main` are:

- Emergency hotfixes (must be clearly justified)
- Minor documentation updates (README typos, etc.)
- Configuration file updates that don't affect functionality

Even in these cases, consider using a branch for better tracking and review.
