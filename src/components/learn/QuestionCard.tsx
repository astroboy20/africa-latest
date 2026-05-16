import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";
import { playCorrectSound, playWrongSound, startTickSound, stopTickSound } from "@/lib/sound-effects";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  text: string;
  options: string[];
  correctIndex: number;
  timeLimit?: number;
  onAnswer: (isCorrect: boolean, timeRemaining: number) => void;
}

const QuestionCard = ({
  questionNumber,
  totalQuestions,
  text,
  options,
  correctIndex,
  timeLimit = 30,
  onAnswer,
}: QuestionCardProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Manage tick sound when timer drops below 10
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0 && !revealed) {
      startTickSound();
    } else {
      stopTickSound();
    }
    return () => stopTickSound();
  }, [timeLeft <= 10 && !revealed]);

  // Stop ticking when revealed
  useEffect(() => {
    if (revealed) stopTickSound();
  }, [revealed]);

  // Countdown timer
  useEffect(() => {
    if (revealed || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [revealed]);

  const handleTimeUp = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
    stopTickSound();
    playWrongSound();
    setTimeout(() => {
      onAnswer(false, 0);
    }, 1500);
  }, [revealed, onAnswer]);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
    stopTickSound();
    
    if (index === correctIndex) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
    
    setTimeout(() => {
      onAnswer(index === correctIndex, timeLeft);
    }, 1500);
  };

  const getOptionStyle = (index: number) => {
    if (!revealed) {
      return "border-border bg-card hover:border-primary hover:bg-primary/5 cursor-pointer";
    }
    if (index === correctIndex) {
      return "border-emerald-500 bg-emerald-500/10 text-emerald-800 ring-2 ring-emerald-500/30";
    }
    if (index === selected && index !== correctIndex) {
      return "border-destructive bg-destructive/10 text-destructive";
    }
    return "border-border bg-card opacity-50";
  };

  const timerColor =
    timeLeft > 20
      ? "text-emerald-600"
      : timeLeft > 10
      ? "text-yellow-600"
      : "text-destructive";

  const timerPercent = (timeLeft / timeLimit) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Timer bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={cn("flex items-center gap-1 text-sm font-bold", timerColor, timeLeft <= 10 && !revealed && "animate-pulse")}>
            <Timer className="w-4 h-4" />
            {timeLeft}s
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-linear",
              timeLeft > 20
                ? "bg-emerald-500"
                : timeLeft > 10
                ? "bg-yellow-500"
                : "bg-destructive"
            )}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-8 leading-relaxed">
        {text}
      </h2>

      <div className="grid gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={revealed}
            className={cn(
              "w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 font-medium text-sm md:text-base",
              getOptionStyle(index)
            )}
          >
            <span className="inline-flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-current/20 flex items-center justify-center text-xs font-bold shrink-0">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>

      {revealed && (
        <div
          className={cn(
            "mt-4 p-3 rounded-lg text-sm font-medium animate-fade-in",
            selected === correctIndex
              ? "bg-emerald-500/10 text-emerald-800"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {timeLeft === 0 && selected === null
            ? `⏰ Time's up! The correct answer was: ${options[correctIndex]}`
            : selected === correctIndex
            ? `✓ Correct! +${10 + Math.floor(timeLeft / 3)} pts (${timeLeft}s speed bonus)`
            : `✗ The correct answer was: ${options[correctIndex]}`}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
