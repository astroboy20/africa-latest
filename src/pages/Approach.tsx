import Layout from "@/components/Layout";
import { BookOpen, MessageSquare, PenLine, Users, Clock, CheckCircle } from "lucide-react";

const themes = [
  "Pre-Colonial Kingdoms",
  "Trans-Saharan Trade & Scholarship",
  "The Scramble for Africa",
  "Resistance & Liberation Movements",
  "Pan-Africanism & Négritude",
  "Independence & Nation-Building",
  "The Cold War & Africa",
  "Cultural Renaissance",
  "The Diaspora Experience",
  "Contemporary Africa",
  "African Futurism & Innovation",
  "The Road Ahead",
];

const methods = [
  { icon: Clock, title: "60-Min Live Zoom Seminars", desc: "Interactive, scholar-led sessions every week." },
  { icon: CheckCircle, title: "Weekly Quizzes & Homework", desc: "Reinforce learning with structured assessments." },
  { icon: PenLine, title: "Monthly Identity Reflection", desc: "Personal writing exercises connecting history to self." },
  { icon: Users, title: "Structured Debate Program", desc: "Build critical thinking through formal debate with rubrics." },
];

const Approach = () => {
  return (
    <Layout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              The Africa Retold Difference:{" "}
              <span className="text-primary">Reverse-Engineering Education.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We start with truth, not tradition. Our curriculum is built from the ground up with a Pan-African worldview, rigorous scholarship, and a commitment to cultural repositioning. No more learning African history as a footnote.
            </p>
          </div>

          {/* Curriculum Timeline */}
          <div className="max-w-4xl mx-auto mb-24">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-8 text-center">
              12-Month Curriculum Map
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {themes.map((theme, i) => (
                <div
                  key={theme}
                  className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">Month {i + 1}</span>
                  <p className="font-heading font-semibold text-foreground mt-2 text-sm">{theme}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Methodology */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-8 text-center">
              Our Teaching Methodology
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {methods.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 bg-card border border-border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Approach;
