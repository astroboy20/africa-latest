import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Module } from "@/data/trivia-data";

interface ModuleCardProps {
  module: Module;
  completedSets: number;
  totalSets: number;
  onClick: () => void;
  locked?: boolean;
  imageUrl?: string;
}

const ModuleCard = ({ module, completedSets, totalSets, onClick, locked, imageUrl }: ModuleCardProps) => {
  const progressPercent = (completedSets / totalSets) * 100;
  const isComplete = completedSets === totalSets;

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        locked
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:shadow-lg hover:-translate-y-1"
      } ${isComplete ? "ring-2 ring-accent" : ""}`}
      onClick={() => !locked && onClick()}
    >
      <div className="relative h-40 bg-secondary overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={module.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-primary/30 flex items-center justify-center">
            <span className="text-4xl font-heading text-primary-foreground/50">
              {module.number}
            </span>
          </div>
        )}
        {locked && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
        )}
        {isComplete && (
          <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
            ✓ Complete
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
          Module {module.number}
        </p>
        <h3 className="font-heading text-lg font-bold text-foreground mb-1">{module.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{module.description}</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedSets}/{totalSets} sets completed</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
