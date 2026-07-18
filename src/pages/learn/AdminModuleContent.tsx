import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { ArrowLeft, BookOpen, Play, CheckCircle2 } from "lucide-react";

interface AdminModuleFull {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  content: string;
  image_url: string | null;
  era: string;
  country: string;
  module_number: number | null;
  questions: any[] | null;
}

/**
 * Parse stored content into sections.
 * Supports both:
 *  - HTML from the rich text editor (contains <h2> tags)
 *  - Legacy markdown (## headings)
 */
function parseSections(raw: string): { heading: string; html: string }[] {
  // Detect HTML content
  if (raw.trim().startsWith("<")) {
    // Split on <h2> tags — each becomes a section
    const parts = raw.split(/(?=<h2[^>]*>)/i).filter(Boolean);

    return parts.map((part) => {
      const headingMatch = part.match(/<h2[^>]*>(.*?)<\/h2>/i);
      const heading = headingMatch
        ? headingMatch[1].replace(/<[^>]+>/g, "") // strip inner tags
        : "";
      const body = part.replace(/<h2[^>]*>.*?<\/h2>/i, "").trim();
      return { heading, html: body };
    });
  }

  // Legacy: parse markdown
  const lines = raw.split("\n");
  const sections: { heading: string; html: string }[] = [];
  let current: { heading: string; body: string } | null = null;

  for (const line of lines) {
    if (line.startsWith("## ") || line.startsWith("# ")) {
      if (current) sections.push(markdownToSection(current));
      current = { heading: line.replace(/^#{1,2}\s+/, ""), body: "" };
    } else {
      if (current) current.body += line + "\n";
      else if (line.trim()) current = { heading: "Introduction", body: line + "\n" };
    }
  }
  if (current) sections.push(markdownToSection(current));
  return sections.filter((s) => s.heading || s.html.trim());
}

function markdownToSection(s: { heading: string; body: string }): { heading: string; html: string } {
  const html = s.body
    .trim()
    .split("\n\n")
    .filter(Boolean)
    .map((para) => {
      const rendered = para
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n- /g, "<br/>• ")
        .replace(/\n/g, "<br/>");
      return `<p>${rendered}</p>`;
    })
    .join("");
  return { heading: s.heading, html };
}

const AdminModuleContent = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { progress, markModuleRead, isSetCompleted } = useTriviaProgress();

  const [mod, setMod] = useState<AdminModuleFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleId) return;
    supabase
      .from("admin_modules")
      .select("*")
      .eq("id", moduleId)
      .maybeSingle()
      .then(({ data }) => {
        setMod(data as AdminModuleFull | null);
        setLoading(false);
      });
  }, [moduleId]);

  useEffect(() => {
    if (mod && !progress.modulesRead.includes(`admin-${mod.id}`)) {
      markModuleRead(`admin-${mod.id}`);
    }
  }, [mod]);

  if (loading) {
    return (
      <Layout>
        <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
          <div className="container max-w-3xl mx-auto px-4 py-8 space-y-4 animate-pulse">
            <div className="h-6 w-28 bg-muted rounded" />
            <div className="h-10 w-2/3 bg-muted rounded" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="h-6 w-1/2 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
              </div>
            ))}
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

  const sections = parseSections(mod.content);
  const allQuestions: any[] = mod.questions || [];
  const setAId = `ADMIN-${mod.id}-A`;
  const setBId = `ADMIN-${mod.id}-B`;
  const setCId = `ADMIN-${mod.id}-C`;

  const sets = [
    { id: setAId, label: "Set A", questions: allQuestions.slice(0, 10) },
    ...(allQuestions.slice(10, 20).length > 0
      ? [{ id: setBId, label: "Set B", questions: allQuestions.slice(10, 20) }]
      : []),
    ...(allQuestions.slice(20, 30).length > 0
      ? [{ id: setCId, label: "Set C", questions: allQuestions.slice(20, 30) }]
      : []),
  ];

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/learn/nigeria/admin-module/${mod.id}`)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Module
          </Button>

          {/* Header — identical to existing ModuleContent */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-2">
              Module {mod.module_number} — Reading Material
            </Badge>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              {mod.title}
            </h1>
            {mod.subtitle && (
              <p className="text-lg text-muted-foreground mb-2">{mod.subtitle}</p>
            )}
            <p className="text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {sections.length} sections • ~{sections.length * 3} min read
            </p>
          </div>

          {/* Content sections — same card layout as existing modules */}
          <div className="space-y-8">
            {sections.map((section, i) => (
              <article
                key={i}
                className="bg-card border border-border rounded-xl p-6 md:p-8 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {section.heading && (
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-4">
                    {section.heading}
                  </h2>
                )}
                {/* Render HTML from rich text editor or converted markdown */}
                <div
                  className="prose prose-sm md:prose-base max-w-none text-foreground/85 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-2 [&_hr]:border-border [&_hr]:my-4"
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              </article>
            ))}
          </div>

          {/* Quiz CTA — same as existing ModuleContent */}
          <div className="mt-10 bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🧠</div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              Test Your Knowledge
            </h3>
            <p className="text-muted-foreground mb-5">
              You've read the material — now prove it! Take the trivia sets and earn points.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {sets.map((set) => {
                const completed = isSetCompleted(set.id);
                const result = progress.completedSets[set.id];
                return (
                  <Button
                    key={set.id}
                    variant={completed ? "outline" : "default"}
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
                    className="gap-2"
                  >
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {set.label}
                    {completed && result && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({result.score}/{result.total})
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminModuleContent;
