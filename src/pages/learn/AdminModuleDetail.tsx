import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { generateAndSaveQuestions } from "@/lib/generate-questions";
import { ArrowLeft, Play, CheckCircle2, BookOpen, RefreshCw, Sparkles } from "lucide-react";

interface AdminModuleFull {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  content: string;
  image_url: string | null;
  module_number: number | null;
  era: string;
  questions: any[] | null;
}

const AdminModuleDetail = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { progress, isSetCompleted } = useTriviaProgress();

  const [mod, setMod] = useState<AdminModuleFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizError, setQuizError] = useState("");

  const fetchModule = useCallback(async () => {
    if (!moduleId) return;
    const { data } = await supabase
      .from("admin_modules")
      .select("*")
      .eq("id", moduleId)
      .maybeSingle();
    setMod(data as AdminModuleFull | null);
    setLoading(false);
  }, [moduleId]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  // Poll every 8s if questions are still null (background generation in progress)
  useEffect(() => {
    if (!mod || (mod.questions && mod.questions.length > 0)) return;
    const interval = setInterval(fetchModule, 8000);
    return () => clearInterval(interval);
  }, [mod, fetchModule]);

  const handleGenerateQuiz = async () => {
    if (!mod) return;
    setGeneratingQuiz(true);
    setQuizError("");

    try {
      // Call edge function directly to surface the real error
      const res = await supabase.functions.invoke("generate-questions", {
        body: { title: mod.title, content: mod.content },
      });

      console.log("[quiz] full response:", res);

      if (res.error) {
        const context = (res.error as any)?.context;
        let detail = res.error.message;
        if (context) {
          try {
            const body = await context.json();
            detail = body?.error || JSON.stringify(body);
          } catch {
            try { detail = await context.text(); } catch {}
          }
        }
        setQuizError(`Function error: ${detail}`);
        setGeneratingQuiz(false);
        return;
      }

      const questions = res.data?.questions;
      if (!Array.isArray(questions) || questions.length === 0) {
        setQuizError(`No questions returned. Response: ${JSON.stringify(res.data)}`);
        setGeneratingQuiz(false);
        return;
      }

      const { error: saveError } = await supabase
        .from("admin_modules")
        .update({ questions })
        .eq("id", mod.id);

      if (saveError) {
        setQuizError(`Save error: ${saveError.message}`);
      } else {
        await fetchModule();
      }
    } catch (e: any) {
      setQuizError(`Exception: ${e?.message || String(e)}`);
    }

    setGeneratingQuiz(false);
  };

  if (loading) {
    return (
      <Layout>
        <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
          <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-28 bg-muted rounded" />
              <div className="h-10 w-2/3 bg-muted rounded" />
              <div className="h-48 bg-muted rounded-xl" />
              {[0, 1].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!mod) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Module not found.</p>
          <Button onClick={() => navigate("/learn/nigeria")} className="mt-4">
            Back to Modules
          </Button>
        </div>
      </Layout>
    );
  }

  const allQuestions: any[] = mod.questions || [];
  const setAQuestions = allQuestions.slice(0, 10);
  const setBQuestions = allQuestions.slice(10, 20);
  const setCQuestions = allQuestions.slice(20, 30);
  const setAId = `ADMIN-${mod.id}-A`;
  const setBId = `ADMIN-${mod.id}-B`;
  const setCId = `ADMIN-${mod.id}-C`;

  const sets = [
    { id: setAId, label: "Set A", questions: setAQuestions },
    ...(setBQuestions.length > 0 ? [{ id: setBId, label: "Set B", questions: setBQuestions }] : []),
    ...(setCQuestions.length > 0 ? [{ id: setCId, label: "Set C", questions: setCQuestions }] : []),
  ];

  const hasQuestions = allQuestions.length > 0;

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate("/learn/nigeria")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Modules
          </Button>

          {/* Header image */}
          {mod.image_url && (
            <div className="rounded-xl overflow-hidden mb-6 h-52 md:h-64 w-full">
              <img src={mod.image_url} alt={mod.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Module header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-2">
              {mod.module_number && (
                <Badge variant="secondary">Module {mod.module_number}</Badge>
              )}
              <Badge variant="outline" className="capitalize">
                {mod.era.replace("-", " ")}
              </Badge>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              {mod.title}
            </h1>
            {mod.subtitle && (
              <p className="text-lg text-muted-foreground mb-2">{mod.subtitle}</p>
            )}
            {mod.description && (
              <p className="text-muted-foreground">{mod.description}</p>
            )}
          </div>

          {/* Read Source Material */}
          <Button
            variant="outline"
            onClick={() => navigate(`/learn/nigeria/admin-module/${mod.id}/content`)}
            className="mb-8 gap-2"
          >
            <BookOpen className="w-4 h-4" /> Read Source Material (+5 pts)
          </Button>

          {/* Trivia Sets */}
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">Trivia Sets</h2>

          {!hasQuestions ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <RefreshCw className="w-5 h-5 animate-spin shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Quiz questions not ready yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Questions are generated automatically after upload. This page polls every 8 seconds.
                      If it's been a while, click the button below to generate now.
                    </p>
                  </div>
                </div>

                {quizError && (
                  <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                    {quizError}
                  </p>
                )}

                <Button
                  onClick={handleGenerateQuiz}
                  disabled={generatingQuiz}
                  variant="outline"
                  className="gap-2 w-full sm:w-auto"
                >
                  {generatingQuiz ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Generating quiz...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate Quiz Now</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sets.map((set) => {
                const completed = isSetCompleted(set.id);
                const result = progress.completedSets[set.id];
                return (
                  <Card
                    key={set.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      completed ? "border-accent/50" : ""
                    }`}
                    onClick={() =>
                      navigate(`/learn/nigeria/admin-module/${mod.id}/set/${set.id}`, {
                        state: {
                          questions: set.questions,
                          moduleTitle: mod.title,
                          setLabel: set.label,
                          moduleId: mod.id,
                        },
                      })
                    }
                  >
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {completed ? (
                          <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                        ) : (
                          <Play className="w-6 h-6 text-primary shrink-0" />
                        )}
                        <div>
                          <h3 className="font-heading font-bold text-foreground">{set.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {set.questions.length} questions • Multiple choice
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {result ? (
                          <div>
                            <span className="text-lg font-bold text-foreground">
                              {result.score}/{result.total}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {result.points} pts earned
                            </p>
                            {result.perfect && (
                              <Badge className="mt-1 text-xs bg-accent text-accent-foreground">
                                Perfect! ⭐
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline">Not started</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminModuleDetail;
