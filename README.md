# CampusSpend 🚀

The future of campus finance management. Built with Next.js, Firebase, and AI-powered insights.

## Getting Started

To get started with the project, take a look at `src/app/page.tsx`.

## Git & GitHub Setup (Authentication Fix)

If you encounter the error `Password authentication is not supported`, follow these steps:

### The Standard Fix:
1. **Save Credentials**: Run `git config --global credential.helper store` so you only have to enter the token once.
2. **Push**: Run `git push -u origin main`.
3. **Username**: Use `Placid23`.
4. **Password**: **Paste your Personal Access Token (PAT)** instead of your GitHub password.

### The "Nuclear Option" (If prompts fail):
If the terminal keeps rejecting you, run this command to force the token into the remote URL (Replace `<YOUR_TOKEN>` with your actual token):
`git remote set-url origin https://Placid23:<YOUR_TOKEN>@github.com/Placid23/Campuspend.git`
Then run:
`git push -u origin main`

## Project Structure
- `/src/app`: Next.js App Router pages.
- `/src/firebase`: Firebase configuration and hooks.
- `/src/ai`: Genkit AI flows for financial insights.
- `/src/components`: Reusable UI components powered by ShadCN.
