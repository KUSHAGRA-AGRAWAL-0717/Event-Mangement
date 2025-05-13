
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchEventById,
  fetchParticipantsByEventId,
  deleteParticipant,
  createParticipant,
  updateParticipant,
} from "@/lib/api";
import { Event, Participant } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, User, ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import ParticipantFormModal from "@/components/ParticipantFormModal";
import { toast } from "sonner";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | undefined>(undefined);

  const {
    data: event,
    isLoading: isEventLoading,
    isError: isEventError,
    refetch: refetchEvent,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(Number(id)),
  });

  const {
    data: participants,
    isLoading: isParticipantsLoading,
    isError: isParticipantsError,
    refetch: refetchParticipants,
  } = useQuery({
    queryKey: ["eventParticipants", id],
    queryFn: () => fetchParticipantsByEventId(Number(id)),
  });

  const handleDeleteEvent = async () => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        await fetch(`http://127.0.0.1:5000/api/events/${id}`, {
          method: "DELETE",
        });
        toast.success("Event deleted successfully");
        navigate("/events");
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  const handleDeleteParticipant = async (participantId: number) => {
    try {
      await deleteParticipant(participantId);
      toast.success("Participant removed successfully");
      refetchParticipants();
    } catch (error) {
      console.error("Error deleting participant:", error);
      toast.error("Failed to remove participant");
    }
  };

  const handleAddParticipant = () => {
    setCurrentParticipant(undefined);
    setIsParticipantModalOpen(true);
  };

  const handleEditParticipant = (participant: Participant) => {
    setCurrentParticipant(participant);
    setIsParticipantModalOpen(true);
  };

  const handleParticipantSubmit = async (formData: any) => {
    try {
      if (currentParticipant) {
        await updateParticipant(currentParticipant.id, formData);
      } else {
        await createParticipant(formData);
      }
      refetchParticipants();
    } catch (error) {
      console.error("Error saving participant:", error);
      throw error;
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

  if (isEventError || isParticipantsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h3 className="font-semibold">Error loading data</h3>
          <p>There was a problem fetching the event details. Please try again later.</p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate("/events")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isEventLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  const eventData = event as Event;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/events")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl">{eventData.title}</CardTitle>
                  {eventData.organizer && (
                    <CardDescription>
                      Organized by: {eventData.organizer}
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link to={`/events/edit/${id}`} className="flex items-center">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteEvent}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="bg-secondary rounded-md px-4 py-2 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p>{formatDate(eventData.date)}</p>
                  </div>
                </div>
                {eventData.time && (
                  <div className="bg-secondary rounded-md px-4 py-2 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p>{eventData.time}</p>
                    </div>
                  </div>
                )}
                <div className="bg-secondary rounded-md px-4 py-2 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p>{eventData.location}</p>
                  </div>
                </div>
                {eventData.max_participants && (
                  <div className="bg-secondary rounded-md px-4 py-2 flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Capacity</p>
                      <p>
                        {isParticipantsLoading
                          ? "Loading..."
                          : `${participants?.length || 0}/${eventData.max_participants}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">About this event</h3>
                <p className="whitespace-pre-line">{eventData.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Participants</CardTitle>
                <Button size="sm" onClick={handleAddParticipant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              <CardDescription>
                {isParticipantsLoading
                  ? "Loading participants..."
                  : participants?.length
                  ? `${participants.length} ${
                      participants.length === 1 ? "person" : "people"
                    } attending`
                  : "No participants yet"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isParticipantsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              ) : participants?.length ? (
                <div className="space-y-3">
                  {participants.map((participant: Participant) => (
                    <div
                      key={participant.id}
                      className="flex justify-between items-center p-3 bg-secondary/50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {participant.email}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditParticipant(participant)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDeleteParticipant(participant.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No participants have joined yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddParticipant}
                  >
                    Add the first participant
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ParticipantFormModal
        open={isParticipantModalOpen}
        onOpenChange={setIsParticipantModalOpen}
        eventId={Number(id)}
        participant={currentParticipant}
        onSubmit={handleParticipantSubmit}
      />
    </div>
  );
};

export default EventDetailPage;
