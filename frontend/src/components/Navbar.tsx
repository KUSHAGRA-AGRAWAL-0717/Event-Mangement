
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          EventManager
        </Link>
        <div className="flex gap-4">
          <Button asChild variant="ghost" className="text-primary-foreground">
            <Link to="/events" className="flex items-center gap-2">
              <CalendarDays size={18} />
              Events
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-primary-foreground">
            <Link to="/participants" className="flex items-center gap-2">
              <Users size={18} />
              Participants
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
