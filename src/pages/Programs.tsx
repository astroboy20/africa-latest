import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Swords, Landmark, CheckCircle } from "lucide-react";

const programs = [
  {
    icon: BookOpen,
    title: "Track 1: Identity & Origins",
    audience: "For younger learners & diaspora families",
    description: "A foundational journey through pre-colonial African civilizations, languages, and traditions. Designed for families in the diaspora seeking to reconnect their children with heritage.",
    features: ["Age-appropriate content (8-14 years)", "Family discussion guides", "Cultural immersion projects", "Monthly heritage challenges"],
  },
  {
    icon: Swords,
    title: "Track 2: Colonialism & Resistance",
    audience: "For secondary school students (14-18)",
    description: "An unflinching look at the Scramble for Africa, colonial rule, and the extraordinary resistance movements that fought back. History with the truth restored—no euphemisms, no sanitization.",
    features: ["Weekly live seminars", "Primary source analysis", "Structured debate program", "Research project portfolio"],
  },
  {
    icon: Landmark,
    title: "Track 3: Nigerian Nationhood",
    audience: "For advanced / tertiary learners (18+)",
    description: "A rigorous deep-dive into Nigeria's complex journey from pre-colonial societies through independence, civil war, and the ongoing project of nation-building.",
    features: ["University-level rigor", "Original research requirements", "Guest lectures from scholars", "Publication opportunities"],
  },
];

const Programs = () => {
  return (
    <Layout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-gradient-gold">Programs</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Three structured cohorts designed for different stages of learning and life.
            </p>
          </div>

          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            {programs.map(({ icon: Icon, title, audience, description, features }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-2xl p-8 md:p-10 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="text-primary" size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-accent">{audience}</span>
                    <h2 className="font-heading text-2xl font-bold text-foreground mt-1">{title}</h2>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="text-primary shrink-0" size={16} />
                      {f}
                    </div>
                  ))}
                </div>
                <Link to="/get-involved">
                  <Button variant="default">Enroll in This Track</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
