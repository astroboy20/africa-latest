import { Shield, Globe, Compass, Target, TrendingUp } from "lucide-react";

const nonNegotiables = [
  { icon: Shield, title: "Truth-First History", desc: "We teach history as it happened, not as it was curated by colonial powers." },
  { icon: Globe, title: "Pan-African Worldview", desc: "Connecting the continent and its diaspora through shared identity and purpose." },
  { icon: Compass, title: "Cultural Repositioning", desc: "Restoring pride in African intellectual traditions, art, and governance." },
  { icon: Target, title: "Measurable Outcomes", desc: "Structured assessments, debates, and reflections that produce real growth." },
  { icon: TrendingUp, title: "Pathway to Sustainability", desc: "Building a self-sustaining model that empowers educators and communities." },
];

const MissionSection = () => {
  return (
    <section className="py-24 bg-background bg-pattern-overlay">
      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Education is <span className="text-primary">Never Neutral.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Africa Retold exists to reverse-engineer a colonial education system. We are building a new standard, centered on African truth and identity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {nonNegotiables.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="group bg-card rounded-xl p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Icon className="text-primary" size={24} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
