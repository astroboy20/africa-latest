import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Approach from "./pages/Approach";
import Programs from "./pages/Programs";
import Quiz from "./pages/Quiz";
import Media from "./pages/Media";
import GetInvolved from "./pages/GetInvolved";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Learn from "./pages/Learn";
import CountryDashboard from "./pages/learn/CountryDashboard";
import ModuleDetail from "./pages/learn/ModuleDetail";
import TriviaGame from "./pages/learn/TriviaGame";
import BadgeGallery from "./pages/learn/BadgeGallery";
import LeaderboardPage from "./pages/learn/LeaderboardPage";
import ModuleContent from "./pages/learn/ModuleContent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/media" element={<Media />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/about" element={<About />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/nigeria" element={<CountryDashboard />} />
          <Route path="/learn/nigeria/module/:moduleNumber" element={<ModuleDetail />} />
          <Route path="/learn/nigeria/module/:moduleNumber/set/:setId" element={<TriviaGame />} />
          <Route path="/learn/nigeria/module/:moduleNumber/content" element={<ModuleContent />} />
          <Route path="/learn/badges" element={<BadgeGallery />} />
          <Route path="/learn/leaderboard" element={<LeaderboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
