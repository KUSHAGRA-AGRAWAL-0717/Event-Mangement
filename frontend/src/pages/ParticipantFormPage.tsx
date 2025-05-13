
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  fetchEvents,
  fetchParticipantById,
  createParticipant,
  updateParticipant,
} from "@/lib/api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  event_id: z.coerce.number({
    required_error: "Please select an event.",
    invalid_type_error: "Please select an event."
  })
});

type FormData = z.infer<typeof formSchema>;

const ParticipantFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const { data: participant, isLoading: isParticipantLoading } = useQuery({
    queryKey: ["participant", id],
    queryFn: () => fetchParticipantById(Number(id)),
    enabled: isEditing,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      event_id: 0,
    },
  });

  useEffect(() => {
    if (isEditing && participant) {
      form.reset({
        name: participant.name,
        email: participant.email,
        phone: participant.phone || "",
        event_id: participant.event_id,
      });
    }
  }, [isEditing, participant, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateParticipant(Number(id), data);
        toast.success("Participant updated successfully");
      } else {
        await createParticipant(data);
        toast.success("Participant created successfully");
      }
      navigate("/participants");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} participant`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((isEditing && isParticipantLoading) || isEventsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/participants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Participants
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? "Edit Participant" : "Add Participant"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="event_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  defaultValue={field.value.toString()}
                  value={field.value.toString() === "0" ? undefined : field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="pointer-events-auto">
                    {events?.map((event: any) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the event this participant will attend
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/participants")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Participant"
                : "Add Participant"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ParticipantFormPage;
