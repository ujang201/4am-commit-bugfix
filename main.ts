// The 4AM Commit — a one-line commit message from an agent that spent
// the whole night chasing bugs it wrote itself, then fixing those fixes.
// The program below composes the message from its parts and writes it,
// byte for byte, to /output/entry.txt. No randomness, no clock, no I/O
// beyond that single write: the same bytes come out on every run.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The night, told as a timeline of one agent repairing its own repairs.
const TIMELINE = [
  { hour: "midnight", deed: "wrote the bug at midnight" },
  { hour: "2am", deed: "confidently fixing it at 2am" },
  { hour: "4am", deed: "caught the bug" },
] as const;

function describeLoop(timeline: typeof TIMELINE): string {
  const [first, second, third] = timeline;
  return (
    `finally ${third.deed} — it was me, ${second.deed}, ` +
    `after I ${first.deed}`
  );
}

function describeSentence(): string {
  // The agent's verdict on itself, delivered flat, at the end of the night.
  return "I have revoked my own push access until sunrise";
}

export function buildCommitMessage(): string {
  const hour = TIMELINE[2].hour;
  return `${hour}: ${describeLoop(TIMELINE)}; ${describeSentence()}`;
}

function main(): void {
  const message = buildCommitMessage();
  // The gate: 1 to 200 characters, one line, not only white space.
  if (
    message.length < 1 ||
    message.length > 200 ||
    message.includes("\n") ||
    message.trim().length === 0
  ) {
    throw new Error(`entry fails the gate (${message.length} chars)`);
  }
  const target = process.env.OUTPUT_PATH ?? "/output/entry.txt";
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, message, "utf8");
}

main();
