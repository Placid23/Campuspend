# CampusSpend 🚀

The future of campus finance management. Built with Next.js, Firebase, and AI-powered insights.

## Getting Started

To get started with the project, take a look at `src/app/page.tsx`.

## Git & GitHub Setup

If you encounter a `fatal: Authentication failed` error when pushing to GitHub, it is because GitHub requires a **Personal Access Token (PAT)** instead of your account password.

### How to resolve:
1. **Generate a Token**:
   - Log into GitHub and go to **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
   - Click **Generate new token (classic)**.
   - Select the `repo` scope and click **Generate**.
   - **Copy the token.**

2. **Authenticate**:
   - Run `git push` in your terminal.
   - For the username, use your GitHub username.
   - For the password, **paste your token**.

3. **Save Credentials**:
   - Run `git config --global credential.helper store` to prevent having to enter the token every time.

## Project Structure
- `/src/app`: Next.js App Router pages.
- `/src/firebase`: Firebase configuration and hooks.
- `/src/ai`: Genkit AI flows for financial insights.
- `/src/components`: Reusable UI components powered by ShadCN.
