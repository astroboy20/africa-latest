import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Link2, Check } from "lucide-react";
import africanPattern from "@/assets/african-pattern.jpg";
import { toast } from "@/hooks/use-toast";

const questions = [
  {
    question: "When you think of 'modern history,' which timeframe first comes to mind?",
    options: [
      { label: "A", text: "The Industrial Revolution in Europe (18th-19th Century)" },
      { label: "B", text: "The rise and fall of ancient empires (Rome, Greece, etc.)" },
      { label: "C", text: "The era of the great West African kingdoms (Ghana, Mali, Songhai) and the Sahelian civilizations." },
      { label: "D", text: "The post-World War II era and the dawn of globalization." },
    ],
  },
  {
    question: "A child asks you, \"What was Africa like before the Europeans came?\" Your immediate thought is:",
    options: [
      { label: "A", text: "A vast, mysterious continent with tribes living in huts." },
      { label: "B", text: "A place with some pyramids in Egypt, but not much else." },
      { label: "C", text: "A continent of powerful empires, advanced universities (like Timbuktu), complex systems of governance, and rich artistic traditions." },
      { label: "D", text: "It was probably similar to how it is now, just with less technology." },
    ],
  },
  {
    question: "How important is it to learn a language from the African continent?",
    options: [
      { label: "A", text: "Not very important; English/French/Spanish are the global languages of power." },
      { label: "B", text: "It would be a nice hobby, like learning Italian or Japanese." },
      { label: "C", text: "It is a crucial act of reconnection and a tool for decolonizing the mind." },
      { label: "D", text: "I never really thought about it." },
    ],
  },
  {
    question: "When discussing the 'transatlantic slave trade,' what is the primary lens you use?",
    options: [
      { label: "A", text: "It was a tragic but closed chapter in history." },
      { label: "B", text: "It was a period where Africans were victims of European greed." },
      { label: "C", text: "It was a global economic system built on terror, from which we must understand the full scope of African resistance and the resulting diaspora." },
      { label: "D", text: "A sad event, but we need to focus on the present and future." },
    ],
  },
  {
    question: "The concept of 'Pan-Africanism' makes you feel:",
    options: [
      { label: "A", text: "Confused or unfamiliar with the term." },
      { label: "B", text: "Intrigued, but unsure of its relevance in today's world." },
      { label: "C", text: "Inspired; it is the vital philosophy of unity and liberation for all African people, on the continent and in the diaspora." },
      { label: "D", text: "Like a political movement from the past." },
    ],
  },
];

type Category = "A" | "B" | "C" | "D";

const results: Record<Category, { headline: string; text: string; cta: string; ctaLink: string }> = {
  A: {
    headline: "You're an Explorer. Your journey is just beginning.",
    text: "Your foundation is in traditional narratives, but your curiosity is the first step. You have a deep hunger to understand the world beyond the standard story. You need Africa Retold to provide the context and truth that was missing from your education.",
    cta: "Start Your Journey. Enroll Now.",
    ctaLink: "/get-involved",
  },
  B: {
    headline: "You're a Bridge-Builder. You know there's more to the story.",
    text: "You have a sense that the full picture hasn't been painted. You stand between the old and the new, ready to cross into a more complete understanding. Africa Retold will give you the tools to build a solid bridge to your heritage for yourself and your family.",
    cta: "Build Your Bridge. Join a Webinar.",
    ctaLink: "/media",
  },
  C: {
    headline: "You're a True Son or Daughter. Your ancestors are proud.",
    text: "You have a strong, conscious grasp of African history and its global impact. Your mission now is to deepen that knowledge, refine your arguments, and pass it on. Africa Retold is your intellectual home—a place to sharpen your critical thinking and connect with a community of like-minded peers.",
    cta: "Sharpen Your Mind. See Our Debate Club.",
    ctaLink: "/programs",
  },
  D: {
    headline: "You're a Diasporan Dreamer. It's time to turn sentiment into knowledge.",
    text: "Your heart is in the right place, but good intentions need a strong foundation in facts. Move from feeling to knowing. Africa Retold offers the structured, rigorous curriculum you need to transform your passion into a powerful tool for educating the next generation.",
    cta: "Ground Your Dreams. Explore Programs for Parents.",
    ctaLink: "/programs",
  },
};

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<Category | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("r");
    if (r && ["A", "B", "C", "D"].includes(r)) {
      setResult(r as Category);
    }
  }, []);

  const shareUrl = result
    ? `${window.location.origin}/quiz?r=${result}`
    : "";

  const copyShareLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share your result with friends." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Couldn't copy", description: shareUrl });
    }
  };

  const handleSelect = (label: string) => {
    setSelected(label);
  };

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
      newAnswers.forEach((a) => {
        counts[a] = (counts[a] || 0) + 1;
      });
      const max = Object.entries(counts).reduce((a, b) => (b[1] > a[1] ? b : a));
      setResult(max[0] as Category);
    }
  };

  const shareText = result
    ? `I am "${results[result].headline.split(".")[0]}" on @AfricaRetold. How African are you? Take the quiz: ${shareUrl}`
    : "";

  const progress = result ? 100 : (current / questions.length) * 100;

  return (
    <Layout>
      <section className="min-h-[80vh] py-24 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${africanPattern})`, backgroundSize: "150px", backgroundRepeat: "repeat" }} />

        <div className="relative container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How African Are You?
            </h1>
            <p className="text-lg text-muted-foreground">A 5-Question Reality Check.</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full mb-10 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Quiz Questions */}
          {!result && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-4">
                Question {current + 1} of {questions.length}
              </p>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-8 leading-snug">
                {questions[current].question}
              </h2>
              <div className="flex flex-col gap-3 mb-8">
                {questions[current].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(opt.label)}
                    className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                      selected === opt.label
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                    }`}
                  >
                    <span className="font-semibold text-primary mr-3">{opt.label}.</span>
                    <span className="text-foreground">{opt.text}</span>
                  </button>
                ))}
              </div>
              <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={handleNext}
                disabled={!selected}
              >
                {current < questions.length - 1 ? "Next Question" : "See My Results"}
              </Button>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="animate-scale-in text-center">
              <div className="bg-card border border-border rounded-2xl p-10 mb-8">
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-6">
                  {results[result].headline}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {results[result].text}
                </p>
                <a href={results[result].ctaLink}>
                  <Button variant="hero" size="lg" className="bg-primary text-primary-foreground">
                    {results[result].cta}
                  </Button>
                </a>
              </div>

              {/* Share buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Share2 size={16} /> Share your result:
                </span>
                <button
                  onClick={copyShareLink}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-muted hover:bg-primary/10 transition-colors text-sm font-medium text-foreground"
                  aria-label="Copy share link"
                >
                  {copied ? <Check size={16} className="text-accent" /> : <Link2 size={16} />}
                  {copied ? "Copied!" : "Copy link"}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <Twitter size={18} className="text-foreground" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <Facebook size={18} className="text-foreground" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Quiz;
