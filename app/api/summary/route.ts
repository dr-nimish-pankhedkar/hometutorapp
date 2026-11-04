import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { templateSummary, type SummaryInput } from "@/lib/summary";

export const runtime = "nodejs";

const MODEL = "claude-opus-5-5";

const SYSTEM = `You write the parent summary on a Chemistry progress report for TutorIQ, an Indian AI-enabled home-tuition platform for JEE/NEET students.
Write ONE paragraph of 80–120 words addressed to the parent, in warm, plain English (no jargon a parent would not know, no markdown, no bullet points, no headings).

Tone: positive and growth-oriented throughout. Describe where the student is now and what comes next, never what they lack. Never use the words "weak", "weakness", "poor", "diagnose", "diagnosis", "diagnostic", "deficient", "deficiency", "fail", "failure", "struggle" or "bad", or any medical or clinical language. Say "focus area", "concept to revisit", "build confidence" or "next step" instead.

Structure: start with the score and the student's strengths (the "strengths" field). Then describe the next 2-week plan (the "nextTwoWeekPlan" field) as an opportunity to build on those strengths. If "revisitConcepts" is not empty, say gently that these ideas will be revisited early so they become secure. End with one encouraging, concrete note.

Use only the data you are given and do not invent numbers. Refer to the student by first name.`;

function isValid(body: unknown): body is SummaryInput {
  const b = body as SummaryInput;
  return (
    !!b &&
    typeof b.score === "number" &&
    typeof b.total === "number" &&
    Array.isArray(b.topics) &&
    Array.isArray(b.nextTwoWeekPlan) &&
    !!b.strengths &&
    Array.isArray(b.strengths.topics) &&
    JSON.stringify(b).length < 8000
  );
}

export async function POST(req: Request) {
  let input: unknown;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!isValid(input)) return NextResponse.json({ error: "Invalid report payload" }, { status: 400 });

  const fallback = { source: "template" as const, summary: templateSummary(input) };
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json(fallback);

  try {
    const client = new Anthropic({ timeout: 45_000, maxRetries: 1 });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      output_config: { effort: "low" },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Progress check results (JSON):\n${JSON.stringify({ ...input, studentName: input.studentName || "your child" })}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") return NextResponse.json(fallback);

    const text = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    if (!text) return NextResponse.json(fallback);

    return NextResponse.json({ source: "claude" as const, summary: text });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`Claude API error ${err.status}: ${err.message}`);
    } else {
      console.error("Summary generation failed:", err);
    }
    return NextResponse.json(fallback);
  }
}
