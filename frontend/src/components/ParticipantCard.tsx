
import { Participant, Event } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Edit, Trash } from "lucide-react";

interface ParticipantCardProps {
  participant: Participant;
  event?: Event;
  onEdit: (participant: Participant) => void;
  onDelete: (id: number) => void;
}

const ParticipantCard = ({ participant, event, onEdit, onDelete }: ParticipantCardProps) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      onDelete(participant.id);
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{participant.name}</CardTitle>
        {event && (
          <p className="text-sm text-muted-foreground">
            Event: {event.title}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm">
          <Mail className="mr-2 h-4 w-4" />
          <a href={`mailto:${participant.email}`} className="hover:underline">
            {participant.email}
          </a>
        </div>
        {participant.phone && (
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4" />
            <a href={`tel:${participant.phone}`} className="hover:underline">
              {participant.phone}
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(participant)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ParticipantCard;
