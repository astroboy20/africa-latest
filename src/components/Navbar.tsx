import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTriviaProgress } from "@/hooks/use-trivia-progress";
import logoImg from "@/assets/logo.jpg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Our Approach", path: "/approach" },
  { label: "Programs", path: "/programs" },
  { label: "Learn", path: "/learn" },
  { label: "Media", path: "/media" },
  { label: "Get Involved", path: "/get-involved" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, resetProgress } = useTriviaProgress();

  const isOnLearnPage = location.pathname.startsWith("/learn");

  const handleSignOut = () => {
    resetProgress();
    navigate("/learn");
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="Africa Retold" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.path
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Show user info + sign out when logged in on learn pages */}
          {progress.username ? (
            <div className="flex items-center gap-2 ml-3">
              <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-sm text-foreground">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium max-w-[120px] truncate">{progress.username}</span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-destructive">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will end <strong>{progress.username}</strong>'s session and clear local progress. Your scores are saved in the cloud.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSignOut}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Link to="/get-involved">
              <Button variant="gold" size="sm" className="ml-3">
                Enroll Now
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {progress.username ? (
              <div className="mt-2 space-y-2">
                {/* User badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-md">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">{progress.username}</span>
                  {progress.email && (
                    <span className="text-xs text-muted-foreground truncate">{progress.email}</span>
                  )}
                </div>
                {/* Sign out */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sign out?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will end <strong>{progress.username}</strong>'s session and clear local progress. Your scores are saved in the cloud.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleSignOut}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <Link to="/get-involved" onClick={() => setMobileOpen(false)}>
                <Button variant="gold" className="w-full mt-2">
                  Enroll Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
