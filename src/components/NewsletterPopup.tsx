import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const STORAGE_KEY = "africaretold_newsletter_dismissed";

const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
    };

    // Desktop: exit-intent — cursor leaves through top of viewport
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };

    // Mobile/touch: quick upward scroll near top suggests leaving
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 80 && lastY - y > 30) trigger();
      lastY = y;
    };

    // Fallback so users who never trigger exit-intent still see it
    const fallback = setTimeout(trigger, 45000);

    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(fallback);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : dismiss())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-2">
            <Mail className="text-accent" />
          </div>
          <DialogTitle className="font-heading text-2xl">Join the Africa Retold Newsletter</DialogTitle>
          <DialogDescription className="text-base">
            Stories, history, and resources for the globally conscious — straight to your inbox.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a
            href="https://africaretold.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="flex-1"
          >
            <Button variant="gold" className="w-full">Subscribe on Substack</Button>
          </a>
          <Button variant="ghost" onClick={dismiss}>Maybe later</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterPopup;