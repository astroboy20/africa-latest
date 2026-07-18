import { supabase } from "@/integrations/supabase/client";

export interface GeneratedQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export async function generateQuestionsForModule(
  title: string,
  content: string
): Promise<GeneratedQuestion[] | null> {
  try {
    console.log("[generate-questions] Invoking edge function...");

    const res = await supabase.functions.invoke("generate-questions", {
      body: { title, content },
    });

    console.log("[generate-questions] Response:", JSON.stringify(res));

    if (res.error) {
      console.error("[generate-questions] Invocation error:", res.error);
      return null;
    }

    if (res.data?.error) {
      console.error("[generate-questions] Function returned error:", res.data.error);
      return null;
    }

    const questions = res.data?.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      console.error("[generate-questions] No questions in response:", res.data);
      return null;
    }

    return questions
      .filter(
        (q: any) =>
          q.text &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correctIndex === "number"
      )
      .map((q: any, i: number) => ({
        id: `gen-${Date.now()}-${i}`,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
      }));
  } catch (err) {
    console.error("[generate-questions] Exception:", err);
    return null;
  }
}

export async function generateAndSaveQuestions(
  moduleId: string,
  title: string,
  content: string
): Promise<boolean> {
  const questions = await generateQuestionsForModule(title, content);
  if (!questions || questions.length === 0) return false;

  const { error } = await supabase
    .from("admin_modules")
    .update({ questions })
    .eq("id", moduleId);

  if (error) {
    console.error("[generate-questions] Save error:", error);
    return false;
  }

  return true;
}
