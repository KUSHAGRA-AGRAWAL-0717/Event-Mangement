
import { Event } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Eye, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onDelete: (id: number) => void;
}

const EventCard = ({ event, onDelete }: EventCardProps) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id);
    }
  };

  // Format date if it's a valid date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.time && (
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4" />
              <span>{event.time}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/events/${event.id}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/events/edit/${event.id}`} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
