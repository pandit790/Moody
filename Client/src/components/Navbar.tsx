import { Music } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-primary to-accent p-2">
              <Music className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Moody 🎧
            </h1>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            AI-Powered Mood Music Recommender
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
