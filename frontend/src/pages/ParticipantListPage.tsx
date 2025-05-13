
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchParticipants, fetchEvents, deleteParticipant } from "@/lib/api";
import { Participant, Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ParticipantCard from "@/components/ParticipantCard";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const ParticipantListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: participants,
    isLoading: isParticipantsLoading,
    isError: isParticipantsError,
    refetch: refetchParticipants,
  } = useQuery({
    queryKey: ["participants"],
    queryFn: fetchParticipants,
  });

  const {
    data: events,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteParticipant(id);
      toast.success("Participant deleted successfully");
      refetchParticipants();
    } catch (error) {
      console.error("Error deleting participant:", error);
      toast.error("Failed to delete participant");
    }
  };

  const getEventById = (eventId: number) => {
    return events?.find((event: Event) => event.id === eventId);
  };

  const handleEdit = (participant: Participant) => {
    window.location.href = `/participants/edit/${participant.id}`;
  };

  const filteredParticipants = participants?.filter((participant: Participant) =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isParticipantsError || isEventsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <h3 className="font-semibold">Error loading participants</h3>
          <p>There was a problem fetching the data. Please try again later.</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => refetchParticipants()}
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
          <h1 className="text-3xl font-bold">Participants</h1>
          <p className="text-muted-foreground">Manage all your event participants</p>
        </div>
        <Button asChild>
          <Link to="/participants/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Participant
          </Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isParticipantsLoading || isEventsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden border">
              <div className="animate-pulse p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredParticipants?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParticipants.map((participant: Participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              event={getEventById(participant.event_id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No participants found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? "No participants match your search criteria."
              : "Get started by adding your first participant."}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          ) : (
            <Button asChild>
              <Link to="/participants/create">Add Participant</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ParticipantListPage;
