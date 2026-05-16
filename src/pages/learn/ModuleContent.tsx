import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { moduleContents } from "@/data/module-content";
import { modules } from "@/data/trivia-data";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { ArrowLeft, Play, BookOpen, CheckCircle2 } from "lucide-react";
import SocialShare from "@/components/learn/SocialShare";

const ModuleContent = () => {
  const { moduleNumber } = useParams();
  const navigate = useNavigate();
  const { progress, markModuleRead, isSetCompleted } = useTriviaProgress();

  const modNum = parseInt(moduleNumber || "1");
  const content = moduleContents.find((m) => m.moduleNumber === modNum);
  const mod = modules.find((m) => m.number === modNum);

  if (!content || !mod) {
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

  // Mark as read when viewing
  if (!progress.modulesRead.includes(mod.id)) {
    markModuleRead(mod.id);
  }

  // Calculate module completion for share
  const completedSets = mod.sets.filter((s) => isSetCompleted(s.id));
  const totalPoints = completedSets.reduce(
    (sum, s) => sum + (progress.completedSets[s.id]?.points || 0),
    0
  );
  const totalCorrect = completedSets.reduce(
    (sum, s) => sum + (progress.completedSets[s.id]?.score || 0),
    0
  );
  const totalQuestions = completedSets.reduce(
    (sum, s) => sum + (progress.completedSets[s.id]?.total || 0),
    0
  );

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/learn/nigeria/module/${modNum}`)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Module
          </Button>

          {/* Header */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-2">
              Module {modNum} — Reading Material
            </Badge>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              {content.title}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {content.sections.length} sections • ~{content.sections.length * 3} min read
            </p>
          </div>

          {/* Content sections */}
          <div className="space-y-8">
            {content.sections.map((section, i) => (
              <article
                key={i}
                className="bg-card border border-border rounded-xl p-6 md:p-8 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-4">
                  {section.heading}
                </h2>
                <div className="prose prose-sm md:prose-base max-w-none text-foreground/85 leading-relaxed">
                  {section.content.split("\n\n").map((para, j) => (
                    <p
                      key={j}
                      className="mb-4 last:mb-0"
                      dangerouslySetInnerHTML={{
                        __html: para
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n- /g, "<br/>• ")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* CTA to play trivia */}
          <div className="mt-10 bg-card border border-border rounded-xl p-6 text-center">
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              Ready to test your knowledge?
            </h3>
            <p className="text-muted-foreground mb-4">
              Play the trivia sets for this module and earn points!
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {mod.sets.map((set) => {
                const completed = isSetCompleted(set.id);
                return (
                  <Button
                    key={set.id}
                    variant={completed ? "outline" : "default"}
                    onClick={() =>
                      navigate(
                        `/learn/nigeria/module/${modNum}/set/${set.id}`
                      )
                    }
                    className="gap-2"
                  >
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {set.label}
                  </Button>
                );
              })}
            </div>

            {/* Share section if any sets completed */}
            {completedSets.length > 0 && totalQuestions > 0 && (
              <SocialShare
                score={totalCorrect}
                total={totalQuestions}
                moduleName={mod.title}
                points={totalPoints}
              />
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ModuleContent;
