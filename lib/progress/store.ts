import { createClient } from "@/lib/supabase/client";
import type { ProgressStatus, RecordAttemptInput } from "./types";

export async function recordAttempt(input: RecordAttemptInput): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: attempt, error } = await supabase
    .from("attempts")
    .insert({
      user_id: user.id,
      problem_id: input.problemId,
      code: input.code,
      passed: input.passed,
      tests_passed: input.testsPassed,
      tests_total: input.testsTotal,
      runtime_ms: input.runtimeMs,
    })
    .select("id")
    .single();
  if (error) throw error;

  const status: ProgressStatus = input.passed ? "solved" : "attempted";
  await supabase.from("progress").upsert(
    { user_id: user.id, problem_id: input.problemId, status, best_attempt_id: attempt.id, updated_at: new Date().toISOString() },
    { onConflict: "user_id,problem_id" },
  );
}
