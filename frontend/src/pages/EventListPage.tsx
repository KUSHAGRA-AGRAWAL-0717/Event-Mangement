
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { fetchEvents, deleteEvent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/EventCard";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const EventListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: events, isLoading, isError, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);
      toast.success("Event deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const filteredEvents = events?.filter((event: Event) => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <h3 className="font-semibold">Error loading events</h3>
          <p>There was a problem fetching the events. Please try again later.</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Browse and manage your events</p>
        </div>
        <Button asChild>
          <Link to="/events/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden border">
              <Skeleton className="h-[300px]" />
            </div>
          ))}
        </div>
      ) : filteredEvents?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: Event) => (
            <EventCard key={event.id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? "No events match your search criteria."
              : "Get started by creating your first event."}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          ) : (
            <Button asChild>
              <Link to="/events/create">Create Event</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventListPage;
