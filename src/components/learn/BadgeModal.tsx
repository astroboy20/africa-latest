import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { badges as allBadges } from "@/data/badge-data";
import confetti from "canvas-confetti";

interface BadgeModalProps {
  badgeId: string;
  score?: number;
  maxScore?: number;
  open: boolean;
  onClose: () => void;
}

const BadgeModal = ({ badgeId, score, maxScore, open, onClose }: BadgeModalProps) => {
  const badge = allBadges.find((b) => b.id === badgeId);

  useEffect(() => {
    if (open && badge) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C84B31", "#F4A261", "#2A9D8F", "#4A4E69"],
      });
    }
  }, [open, badge]);

  if (!badge) return null;

  const shareText = `🏆 I just earned the ${badge.name} badge on Africa Retold! ${
    score && maxScore ? `${score}/${maxScore} points.` : ""
  } Think you know African history? Prove it! #AfricaRetold #Trivia`;

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-center font-heading text-2xl">
            🎉 Congratulations! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="text-7xl mb-4 animate-scale-in">{badge.icon}</div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2 font-medium">
            You earned
          </p>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{badge.name}</h3>
          <p className="text-sm text-muted-foreground">{badge.description}</p>

          {score !== undefined && maxScore !== undefined && (
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div>
                <span className="font-bold text-foreground">{score}/{maxScore}</span>
                <span className="text-muted-foreground ml-1">Score</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={shareOnTwitter} variant="default" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" /> Share on X
          </Button>
          <Button onClick={shareOnWhatsApp} variant="secondary" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" /> WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeModal;
