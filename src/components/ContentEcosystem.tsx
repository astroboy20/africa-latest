import { Mic, Video, MonitorPlay, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

const channels = [
  { icon: Mic, title: "Podcast", desc: "Deep-dive conversations on African history and identity." },
  { icon: Video, title: "Monthly Webinar", desc: "Live sessions with scholars, activists, and educators." },
  { icon: MonitorPlay, title: "YouTube Clips", desc: "Short-form content to spark curiosity and debate." },
  { icon: Radio, title: "Instagram Live", desc: "Weekly live sessions and community Q&A." },
];

const ContentEcosystem = () => {
  return (
    <section className="py-24 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            More Than a Classroom.{" "}
            <span className="text-gold">A Movement.</span>
          </h2>
          <p className="text-lg text-secondary-foreground/70">
            Our content ecosystem extends learning beyond the classroom, fostering a vibrant community of conscious thinkers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          {channels.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="text-center p-6 rounded-xl bg-secondary-foreground/5 hover:bg-secondary-foreground/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <Icon className="text-gold" size={26} />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-secondary-foreground/60">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="gold" size="lg">
            Follow & Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentEcosystem;
