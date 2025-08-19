# 2048 judge

[How to play](https://hackmd.io/YkCy78oCTLil9oKIdlef-Q)

Given an UI codebase to play 2048, where the UI does not contain any game logic and call the backend for handling merging cells, spawn new number, and detect win or lose. The participants are expected to code the server that handles the logic, they need to read the UI code to understand what contract the server expects and returns. Then they request for test using the contest coordinator, this judge will evaluate the correctness of the participant. After the server can handle all basic requirements properly, we reveal the advance requirements to the candidate, and the candidates should implement the advanced requirements without breaking basic requirements, on the same codebase.

This challenge is designed in this way to:

1. Add complexity to vibe coding. In general, it is challenging for AI agents to properly understand existing codebase, and mutate existing codebase to add new functionality.
1. Most coding contests examine only algo design skill. However, two of the most important skills in software engineering are code reading and modifying existing code without breaking existing functionality. We want to examine these skills, and they are not trivial to have.

## Scoring

We have a few different requirements, their weight are defined at https://github.com/dipsywong98/cis-2048-judge/blob/main/src/lib2048/requirementsConfig.ts

1. Basic (the normal valina 2048 game play)
1. Large grid (10x10)
1. Unmovable block '0'
1. Wildcard tile '*2'
1. Mixture of above and special number '1' that cant merge with itself, but mergeable with *2

For each requirements, 70% count to correct merge, 10% correct new tile, 20% correct endgame status.
https://github.com/dipsywong98/cis-2048-judge/blob/main/src/lib2048/evaluate.ts

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
