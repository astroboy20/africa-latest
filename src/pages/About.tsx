import Layout from "@/components/Layout";
import { Target, Eye, Users } from "lucide-react";

const team = [
  { name: "Founder & Lead Educator", desc: "A passionate historian and educator committed to transforming how African history is taught worldwide." },
  { name: "Curriculum Director", desc: "An academic with decades of experience in Pan-African studies and decolonized pedagogy." },
  { name: "Community Lead", desc: "Connecting families across the diaspora with the resources and support they need." },
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
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-8 text-center">
              The Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="text-primary" size={32} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.desc}</p>
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
