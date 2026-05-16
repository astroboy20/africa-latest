import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Handshake, Heart } from "lucide-react";
import { useState } from "react";

const GetInvolved = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

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
            {[
              { icon: GraduationCap, title: "Enroll", desc: "Register your family or students for our next cohort." },
              { icon: Handshake, title: "Partner", desc: "Partner with us as a school, church, or community organization." },
              { icon: Heart, title: "Support", desc: "Donate to help us reach more students across the diaspora." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Icon className="text-primary" size={30} />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-xl mx-auto">
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
