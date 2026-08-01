export const posts = [
  {
    id: "getting-started-with-git",
    title: "Getting Started with Git: A Beginner's Guide",
    author: "[MEMBER_NAME]",
    date: "2026-08-20",
    status: "published",
    excerpt:
      "The five Git commands you'll actually use in your first month — and the mental model that makes them click.",
    content: `## Why Git

Most of what trips people up with Git isn't the tool itself — it's the mental model. Git doesn't save files, it saves *snapshots of your project at a point in time*. Once that clicks, everything else follows.

## The five commands you'll use every day

### 1. \`git status\`
Always run this first. It tells you what's changed, what's staged, and what branch you're on. Think of it as looking at your desk before you start working.

### 2. \`git add\`
Stages changes for your next commit. Use \`git add .\` to stage everything, or name specific files. This is your "I want to save this" signal.

### 3. \`git commit\`
Takes a snapshot. Write a commit message that explains *why*, not what — the diff already shows what changed.

\`\`\`bash
git commit -m "fix: prevent crash when user list is empty"
\`\`\`

### 4. \`git push\`
Sends your local commits to GitHub. The first time on a new branch: \`git push -u origin branch-name\`.

### 5. \`git pull\`
Fetches and merges changes from the remote. Run this before you start a new session to avoid diverging from your teammates.

## The workflow in practice

\`\`\`bash
git pull
# make your changes
git status
git add .
git commit -m "feat: add event filter by tag"
git push
\`\`\`

That's 90% of your day-to-day Git. The other 10% (rebasing, cherry-picking, reflog) you'll learn when you need it.
`,
    tags: ["Git", "Beginner"],
    coverImage: null,
  },
  {
    id: "hackathon-recap-spring-2026",
    title: "Spring Hackathon 2026 Recap: 12 Teams, 24 Hours, 1 Winner",
    author: "[MEMBER_NAME]",
    date: "2026-03-16",
    status: "published",
    excerpt:
      "What twelve teams built in twenty-four hours, what worked, and what we'd change next time.",
    content: `## The turnout

Twelve teams registered — up from eight last semester. We had participants from five different departments, which made the judging panel's job genuinely hard in the best way.

## What the teams built

The range was impressive. Projects included:

- An AI-powered study scheduler that pulled from your calendar and exam timetable
- A real-time collaborative code editor with syntax highlighting (using WebSockets)
- A campus event aggregator that scraped department bulletin boards
- A sign-language-to-text interpreter using the device camera and a fine-tuned model

## What won

First place: **StudySync** — the AI study scheduler. The judges cited clean UI, a working demo, and a clear explanation of the problem they were solving. The team used Next.js + OpenAI API + a Postgres database on Railway.

Runner-up: the real-time code editor, which technically impressed the panel the most but had a rougher demo experience.

## What we'd change

- **More mentors early.** Most teams got stuck in the first three hours and only asked for help at hour six.
- **A mid-point check-in.** We're adding a mandatory 12-hour stand-up next time to help teams scope down if they've overreached.
- **Better food variety.** We heard you.

See you in October for Fall Hackathon 2026.
`,
    tags: ["Hackathon", "Recap"],
    coverImage: null,
  },
  {
    id: "building-your-first-react-app",
    title: "Building Your First React App: From Zero to Deployed",
    author: "[MEMBER_NAME]",
    date: "2026-07-10",
    status: "published",
    excerpt:
      "A practical walkthrough for students who know a bit of JavaScript and want to build something real.",
    content: `## Why React

React isn't magic — it's a way to break your UI into reusable pieces (components) and let JavaScript handle updating the page when data changes. Once you understand that, the rest is just syntax.

## What you'll build

A simple task tracker: add tasks, mark them done, filter by status. Small enough to finish in an afternoon, real enough to put on a portfolio.

## Setting up

\`\`\`bash
npm create vite@latest my-task-app -- --template react
cd my-task-app
npm install
npm run dev
\`\`\`

Visit \`http://localhost:5173\` — you have a working React app.

## Understanding components

Every file in \`src/\` that exports a function returning JSX is a component. Start with this pattern and don't overthink it:

\`\`\`jsx
function TaskItem({ task, onToggle }) {
  return (
    <li onClick={() => onToggle(task.id)}>
      {task.done ? "✓" : "○"} {task.title}
    </li>
  );
}
\`\`\`

## State: where your data lives

\`useState\` is how React tracks data that can change:

\`\`\`jsx
const [tasks, setTasks] = useState([]);
\`\`\`

When \`setTasks\` is called with new data, React re-renders anything that uses \`tasks\`. That's it.

## Deploying to Vercel

Push your project to GitHub, import the repo at vercel.com, click Deploy. Free tier, automatic HTTPS, custom domain support. Your app is live in under 60 seconds.
`,
    tags: ["React", "Web Dev", "Tutorial"],
    coverImage: null,
  },
  {
    id: "open-source-your-first-pr",
    title: "How to Land Your First Open-Source PR (Without Imposter Syndrome)",
    author: "[MEMBER_NAME]",
    date: "2026-06-01",
    status: "published",
    excerpt:
      "A step-by-step guide to finding the right repo, making a meaningful change, and getting your PR merged.",
    content: `## The biggest myth

You don't need to be an expert to contribute to open source. Most maintainers are looking for people who communicate clearly, follow the contribution guidelines, and actually read the issue before commenting.

## Finding the right repo

Start small. The GitHub label \`good first issue\` exists for exactly this purpose. Some places to look:

- \`github.com/explore\` → filter by language or topic
- \`goodfirstissue.dev\` — aggregates beginner issues across repos
- Libraries you already use — familiarity helps

## The contribution loop

\`\`\`bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/repo-name

# 2. Create a branch
git checkout -b fix/typo-in-readme

# 3. Make your change, commit it
git add .
git commit -m "docs: fix typo in contributing guide"

# 4. Push and open a PR
git push origin fix/typo-in-readme
\`\`\`

## Writing a good PR description

Three things: what the issue was, what you changed, and how to test it. Link the issue with \`Closes #123\`. That's it.

## After you open it

Be patient. Respond to review comments within 48 hours. If a maintainer asks for changes, make them without argument — you're contributing to their project, not yours.

Seven of our members had their first PR merged within a week of our Open Source 101 workshop. You can too.
`,
    tags: ["Open Source", "Git", "Career"],
    coverImage: null,
  },
];
