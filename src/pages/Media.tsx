import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Video, Award, Users, BookOpen, Lock } from "lucide-react";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mediaItems = {
  podcast: [
    { title: "Episode 12: The Untold Story of Queen Amina", duration: "45 min", date: "Feb 2026" },
    { title: "Episode 11: Pan-Africanism in the 21st Century", duration: "52 min", date: "Jan 2026" },
    { title: "Episode 10: Language as Liberation", duration: "38 min", date: "Dec 2025" },
  ],
  webinars: [
    { title: "Webinar: Decolonizing the Classroom", duration: "90 min", date: "Feb 2026" },
    { title: "Webinar: Teaching Resistance History", duration: "75 min", date: "Jan 2026" },
  ],
  debates: [
    { title: "Debate: Was Colonialism Inevitable?", duration: "60 min", date: "Feb 2026" },
    { title: "Debate: Pan-Africanism vs. Nationalism", duration: "55 min", date: "Jan 2026" },
  ],
  clips: [
    { title: "Why Timbuktu Matters | 3-min explainer", duration: "3 min", date: "Feb 2026" },
    { title: "The Mansa Musa Effect | Short", duration: "5 min", date: "Jan 2026" },
    { title: "African Kingdoms You Never Learned About", duration: "4 min", date: "Dec 2025" },
  ],
};

const curriculumItems = [
  { title: "Module 1: Yoruba Foundations — Pre-Colonial Southwest Nigeria", type: "Course Guide", date: "2026" },
  { title: "Module 2: The Benin Kingdom & Its Legacy", type: "Course Guide", date: "2026" },
  { title: "Module 3: The Hausa-Fulani Emirates", type: "Course Guide", date: "2026" },
  { title: "Module 4: The Scramble for Africa & Nigerian Resistance", type: "Course Guide", date: "2026" },
  { title: "Module 5: Independence & Nation-Building", type: "Course Guide", date: "2026" },
];

const icons = { podcast: Mic, webinars: Video, debates: Award, clips: Users };

const Media = () => {
  const { progress } = useTriviaProgress();
  const isLoggedIn = Boolean(progress.username);

  return (
    <Layout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Media <span className="text-primary">Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our growing library of podcasts, webinars, debates, and clips.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="podcast">
              <TabsList className={`grid mb-8 ${isLoggedIn ? "grid-cols-5" : "grid-cols-4"}`}>
                <TabsTrigger value="podcast">Podcast</TabsTrigger>
                <TabsTrigger value="webinars">Webinars</TabsTrigger>
                <TabsTrigger value="debates">Debates</TabsTrigger>
                <TabsTrigger value="clips">Clips</TabsTrigger>
                {isLoggedIn && (
                  <TabsTrigger value="curriculum" className="flex items-center gap-1.5">
                    <BookOpen size={14} />
                    Curriculum
                  </TabsTrigger>
                )}
              </TabsList>

              {(Object.entries(mediaItems) as [keyof typeof mediaItems, typeof mediaItems["podcast"]][]).map(
                ([key, items]) => {
                  const Icon = icons[key];
                  return (
                    <TabsContent key={key} value={key} className="flex flex-col gap-4">
                      {items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-5 bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="text-primary" size={22} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.duration} · {item.date}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  );
                }
              )}

              {/* Curriculum — only visible when logged in */}
              {isLoggedIn && (
                <TabsContent value="curriculum" className="flex flex-col gap-4">
                  {curriculumItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-5 bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="text-primary" size={22} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.type} · {item.date}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              )}
            </Tabs>

            {/* Prompt non-logged-in users about curriculum */}
            {!isLoggedIn && (
              <div className="mt-8 bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Lock className="text-muted-foreground" size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-1">Curriculum Resources Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Log in to the Learning Hub to access our full curriculum guides and course materials.
                  </p>
                </div>
                <Link to="/learn">
                  <Button variant="default" size="sm" className="shrink-0">
                    Go to Learn
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Media;
