import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen } from "lucide-react";

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
  created_at: string;
}

// Parse markdown-ish content into sections split by ## headings
function parseSections(raw: string): { heading: string; body: string }[] {
  const lines = raw.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string } | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { heading: line.replace(/^##\s+/, ""), body: "" };
    } else if (line.startsWith("# ")) {
      if (current) sections.push(current);
      current = { heading: line.replace(/^#\s+/, ""), body: "" };
    } else {
      if (current) {
        current.body += line + "\n";
      } else {
        // Content before first heading goes into an intro section
        if (line.trim()) {
          current = { heading: "Introduction", body: line + "\n" };
        }
      }
    }
  }
  if (current) sections.push(current);
  return sections.filter((s) => s.heading || s.body.trim());
}

// Render inline markdown: **bold**, bullet lists
function renderInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n- /g, "<br/>• ")
    .replace(/\n/g, "<br/>");
}

const AdminModuleView = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<AdminModuleFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!moduleId) return;
    supabase
      .from("admin_modules")
      .select("*")
      .eq("id", moduleId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setModule(data as AdminModuleFull);
        }
        setLoading(false);
      });
  }, [moduleId]);

  if (loading) {
    return (
      <Layout>
        <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
          <div className="container max-w-3xl mx-auto px-4 py-8">
            <div className="space-y-4 animate-pulse">
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="h-10 w-2/3 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-3">
                  <div className="h-6 w-1/2 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                  <div className="h-4 w-4/6 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (notFound || !module) {
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

  const sections = parseSections(module.content);
  const eraLabel =
    module.era === "pre-colonial"
      ? "Pre-Colonial"
      : module.era === "colonial"
      ? "Colonial"
      : "Post-Colonial";

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-section">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/learn/nigeria")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Modules
          </Button>

          {/* Header image */}
          {module.image_url && (
            <div className="rounded-xl overflow-hidden mb-6 h-52 md:h-64">
              <img
                src={module.image_url}
                alt={module.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary">{eraLabel}</Badge>
              <Badge variant="outline" className="capitalize">
                {module.country}
              </Badge>
              {module.module_number && (
                <Badge variant="outline">Module {module.module_number}</Badge>
              )}
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              {module.title}
            </h1>
            {module.subtitle && (
              <p className="text-lg text-muted-foreground mb-1">{module.subtitle}</p>
            )}
            {module.description && (
              <p className="text-muted-foreground">{module.description}</p>
            )}
            <p className="text-muted-foreground flex items-center gap-2 mt-3 text-sm">
              <BookOpen className="w-4 h-4" />
              {sections.length} sections • ~{sections.length * 3} min read
            </p>
          </div>

          {/* Content sections */}
          <div className="space-y-6">
            {sections.map((section, i) => (
              <article
                key={i}
                className="bg-card border border-border rounded-xl p-6 md:p-8 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {section.heading && (
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-4">
                    {section.heading}
                  </h2>
                )}
                <div className="prose prose-sm md:prose-base max-w-none text-foreground/85 leading-relaxed">
                  {section.body
                    .trim()
                    .split("\n\n")
                    .filter(Boolean)
                    .map((para, j) => (
                      <p
                        key={j}
                        className="mb-4 last:mb-0"
                        dangerouslySetInnerHTML={{ __html: renderInline(para) }}
                      />
                    ))}
                </div>
              </article>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-10 bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground mb-4">Finished reading? Explore more modules.</p>
            <Button onClick={() => navigate("/learn/nigeria")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to All Modules
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminModuleView;
