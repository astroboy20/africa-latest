import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/data/trivia-data";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { ArrowLeft, Play, CheckCircle2, BookOpen } from "lucide-react";

const ModuleDetail = () => {
  const { moduleNumber } = useParams();
  const navigate = useNavigate();
  const { progress, isSetCompleted, markModuleRead } = useTriviaProgress();

  const modNum = parseInt(moduleNumber || "1");
  const mod = modules.find((m) => m.number === modNum);
  if (!mod) return null;

  const handleReadMore = () => {
    markModuleRead(mod.id);
    navigate(`/learn/nigeria/module/${modNum}/content`);
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate("/learn/nigeria")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Modules
          </Button>

          {/* Module Header */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-2">Module {mod.number}</Badge>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              {mod.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">{mod.subtitle}</p>
            <p className="text-muted-foreground">{mod.description}</p>
          </div>

          {/* Read More */}
          <Button variant="outline" onClick={handleReadMore} className="mb-8 gap-2">
            <BookOpen className="w-4 h-4" /> Read Source Material (+5 pts)
          </Button>

          {/* Trivia Sets */}
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">Trivia Sets</h2>
          <div className="grid gap-4">
            {mod.sets.map((set) => {
              const completed = isSetCompleted(set.id);
              const result = progress.completedSets[set.id];
              
              return (
                <Card
                  key={set.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    completed ? "border-accent/50" : ""
                  }`}
                  onClick={() => navigate(`/learn/nigeria/module/${modNum}/set/${set.id}`)}
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {completed ? (
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      ) : (
                        <Play className="w-6 h-6 text-primary" />
                      )}
                      <div>
                        <h3 className="font-heading font-bold text-foreground">{set.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          10 questions • Multiple choice
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {result ? (
                        <div>
                          <span className="text-lg font-bold text-foreground">
                            {result.score}/{result.total}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {result.points} pts earned
                          </p>
                          {result.perfect && (
                            <Badge variant="default" className="mt-1 text-xs bg-accent text-accent-foreground">
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
        </div>
      </section>
    </Layout>
  );
};

export default ModuleDetail;
