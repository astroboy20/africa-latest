import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Quote } from "lucide-react";

const testimonials = [
  {
    text: "Africa Retold gave my children the context they were missing. They now speak about their heritage with pride and depth.",
    author: "Amara N.",
    location: "Houston, TX",
  },
  {
    text: "The debate program is transformative. My students think more critically and engage with history on a deeper level.",
    author: "Dr. Olufemi A.",
    location: "Lagos, Nigeria",
  },
  {
    text: "As a parent in the diaspora, I finally found a structured program that teaches African history rigorously. This is what we needed.",
    author: "Nkechi O.",
    location: "London, UK",
  },
];

const regions = ["Nigeria", "United States", "United Kingdom", "Canada", "Ghana", "South Africa"];

const CommunitySection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Join the Fastest Growing Community of{" "}
            <span className="text-primary">Conscious Learners</span>
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-xl p-8 border border-border">
              <Quote className="text-gold mb-4" size={28} />
              <p className="text-foreground leading-relaxed mb-6 italic">{t.text}</p>
              <div className="flex items-center gap-2">
                <Users className="text-muted-foreground" size={16} />
                <span className="text-sm font-semibold text-foreground">{t.author}</span>
                <span className="text-sm text-muted-foreground">— {t.location}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Where our students are */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="text-primary" size={20} />
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Where Our Students Are
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto">
            {regions.map((r) => (
              <span key={r} className="px-4 py-2 bg-card border border-border rounded-full text-sm text-foreground">
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/get-involved">
            <Button variant="default" size="lg">Become a Partner</Button>
          </Link>
          <Link to="/get-involved">
            <Button variant="outline" size="lg">Refer a Family</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
