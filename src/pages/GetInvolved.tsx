import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Handshake, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DONATE_URL = "https://www.zeffy.com/en-US/donation-form/support-africa-retold-usa";

const GetInvolved = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const cards = [
    {
      icon: GraduationCap,
      title: "Enroll",
      desc: "Register your family or students for our next cohort.",
      action: () => navigate("/programs"),
      label: "View Programs",
    },
    {
      icon: Handshake,
      title: "Partner",
      desc: "Partner with us as a school, church, or community organization.",
      action: scrollToForm,
      label: "Get in Touch",
    },
    {
      icon: Heart,
      title: "Support",
      desc: "Donate to help us reach more students across the diaspora.",
      action: () => window.open(DONATE_URL, "_blank", "noopener,noreferrer"),
      label: "Donate Now",
    },
  ];

  return (
    <Layout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Get <span className="text-gradient-gold">Involved</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              There are many ways to be part of the Africa Retold movement.
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {cards.map(({ icon: Icon, title, desc, action, label }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Icon className="text-primary" size={30} />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">{desc}</p>
                <Button
                  variant="default"
                  onClick={action}
                  className="w-full"
                >
                  {label}
                </Button>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="max-w-xl mx-auto">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
              Reach Out to Us
            </h2>
            {formSubmitted ? (
              <div className="text-center py-12 bg-card border border-border rounded-2xl">
                <h3 className="font-heading text-xl font-bold text-primary mb-2">Thank you!</h3>
                <p className="text-muted-foreground">We'll be in touch shortly.</p>
              </div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
              >
                <Input placeholder="Your name" required maxLength={100} />
                <Input type="email" placeholder="Your email" required maxLength={255} />
                <Textarea placeholder="How would you like to get involved?" required maxLength={1000} rows={5} />
                <Button variant="default" size="lg" type="submit">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolved;
