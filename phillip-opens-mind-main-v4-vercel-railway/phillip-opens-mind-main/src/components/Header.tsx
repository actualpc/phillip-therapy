import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight text-lg">
          Phillip
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Home</NavLink>
          <NavLink to="/chat?mode=evaluation" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Evaluation</NavLink>
          <NavLink to="/chat" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Chat</NavLink>
          <NavLink to="/pricing" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Pricing</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/pricing"><Button variant="soft" size="sm">Buy tokens</Button></Link>
          <Link to="/auth"><Button variant="outline" size="sm">Sign in</Button></Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
