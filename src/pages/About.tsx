import Layout from "@/components/Layout";
import { Target, Eye } from "lucide-react";
import drFemi from "@/assets/dr-femi.png";
import drMichael from "@/assets/dr-micheal.png";
import clinton from "@/assets/clinton.png";
import simi from "@/assets/simi.png";
import fade from "@/assets/fade.png";

const team = [
  {
    name: "Dr. Oluwafemi Daniel Adebisi",
    title: "Chief Executive Officer",
    image: drFemi,
  },
  {
    name: "Michael Ogundele, Ph.D.",
    title: "Chief Operating Officer",
    image: drMichael,
  },
  {
    name: "Clinton Joseph",
    title: "Chief Financial Officer",
    image: clinton,
  },
  {
    name: "Similoluwa Peters",
    title: "Vice President, Technology",
    image: simi,
  },
  {
    name: "Oluwateniola Faderera Adeniyi",
    title: "Enterprise Project Manager",
    image: fade,
  },
];

const About = () => {
  return (
    <Layout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              About <span className="text-primary">Africa Retold</span>
            </h1>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="text-primary" size={28} />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide a rigorous, truth-first African history education that empowers students in Nigeria and the diaspora to understand their heritage, think critically, and lead with confidence.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="text-primary" size={28} />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A world where every African child—on the continent and in the diaspora—has access to an education that centers their history, celebrates their identity, and prepares them to shape the future.
              </p>
            </div>
          </div>

          {/* Team */}
          <div id="team" className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-10 text-center">
              Meet the Team
            </h2>

            {/* Top row — 3 members */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {team.slice(0, 3).map((member) => (
                <div key={member.name} className="bg-card border border-border rounded-2xl p-6 text-center flex flex-col items-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover object-top mb-4 border-2 border-primary/20"
                  />
                  <h3 className="font-heading font-bold text-foreground text-base leading-snug mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {member.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom row — 2 members centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {team.slice(3).map((member) => (
                <div key={member.name} className="bg-card border border-border rounded-2xl p-6 text-center flex flex-col items-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover object-top mb-4 border-2 border-primary/20"
                  />
                  <h3 className="font-heading font-bold text-foreground text-base leading-snug mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {member.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
