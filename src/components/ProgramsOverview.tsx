import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Swords, Landmark } from "lucide-react";

const tracks = [
  {
    icon: BookOpen,
    title: "Identity & Origins",
    audience: "For younger learners & diaspora",
    desc: "Discover the roots of African civilization—from the great kingdoms of Kush and Aksum to the philosophies that shaped a continent. Perfect for families reconnecting with heritage.",
    color: "primary",
  },
  {
    icon: Swords,
    title: "Colonialism & Resistance",
    audience: "For secondary students",
    desc: "Understand the Scramble for Africa, the brutal realities of colonialism, and the extraordinary resistance movements that fought back. History with the truth restored.",
    color: "secondary",
  },
  {
    icon: Landmark,
    title: "Nigerian Nationhood",
    audience: "For advanced / tertiary learners",
    desc: "A deep dive into Nigeria's journey—from pre-colonial societies through independence and beyond. Rigorous, debate-driven learning for the intellectually ambitious.",
    color: "accent",
  },
];

const ProgramsOverview = () => {
  return (
    <section className="py-24 bg-gradient-section">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Learning Tracks for <span className="text-gradient-gold">Every Stage</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Three structured pathways designed for different levels and contexts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tracks.map(({ icon: Icon, title, audience, desc }) => (
            <div
              key={title}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="text-primary" size={28} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">{audience}</span>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">{desc}</p>
              <Link to="/programs">
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsOverview;
