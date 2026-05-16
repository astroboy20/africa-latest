import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import africaMap from "@/assets/african_map.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="relative container mx-auto px-4 py-20 text-primary-foreground">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              Reclaiming the Story.{" "}
              <span className="text-gradient-gold">Rewriting the Future.</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 max-w-2xl leading-relaxed">
              An academy for the globally conscious. We teach African history, identity, and critical thinking on our own terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quiz">
                <Button variant="hero" size="lg" className="text-base px-8 py-6">
                  Take A Quiz
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="heroOutline" size="lg" className="text-base px-8 py-6">
                  Start Learning
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Africa Map Image */}
          <div className="hidden lg:block animate-fade-in max-w-md mx-auto lg:max-w-none">
            <img
              src={africaMap}
              alt="Map of Africa with countries"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
