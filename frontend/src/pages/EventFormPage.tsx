import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "@/lib/api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.date({
    required_error: "Event date is required.",
  }),
  time: z.string().optional(),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  organizer: z.string().optional(),
  max_participants: z.coerce.number().int().positive().optional(),
});

type FormData = z.infer<typeof formSchema>;

const EventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(Number(id)),
    enabled: isEditing,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "",
      location: "",
      organizer: "",
      max_participants: undefined,
    },
  });

  useEffect(() => {
    if (isEditing && event) {
      console.log("Event data from API:", event);
      // Safely parse the date with error handling
      let eventDate: Date;
      let eventTime: string = "";

      try {
        // Check if we have start_date from the backend
        if (event.start_date) {
          // Parse the ISO datetime string
          const dateTimeObj = new Date(event.start_date);

          // Check if the date is valid
          if (!isNaN(dateTimeObj.getTime())) {
            eventDate = dateTimeObj;

            // Extract time portion (HH:MM) from the datetime
            const hours = dateTimeObj.getHours().toString().padStart(2, "0");
            const minutes = dateTimeObj
              .getMinutes()
              .toString()
              .padStart(2, "0");
            eventTime = `${hours}:${minutes}`;
          } else {
            console.warn(
              "Invalid start_date from API, using current date instead"
            );
            eventDate = new Date();
          }
        }
        // Fallback to date field if start_date is not available
        else if (event.date) {
          eventDate = new Date(event.date);
          eventTime = event.time || "";

          if (isNaN(eventDate.getTime())) {
            console.warn("Invalid date from API, using current date instead");
            eventDate = new Date();
          }
        } else {
          console.warn("No date field found in event data, using current date");
          eventDate = new Date();
        }
      } catch (error) {
        console.error("Error parsing date:", error);
        eventDate = new Date();
      }

      form.reset({
        title: event.title,
        description: event.description,
        date: eventDate,
        time: eventTime,
        location: event.location,
        organizer: event.organizer || "",
        max_participants: event.max_participants,
      });
    }
  }, [isEditing, event, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Format the date as yyyy-MM-dd
      const formattedDate = format(data.date, "yyyy-MM-dd");

      // Create a time string or use default time if not provided
      const timeString = data.time || "09:00";

      // Combine date and time for start_date
      const startDateTime = `${formattedDate}T${timeString}:00`;

      // For end_date, use the same date but set it to end of day if no specific time
      // If time is provided, add 8 hours for a typical event duration
      let endTime: string;
      if (data.time) {
        // Parse the time and add 8 hours
        const [hours, minutes] = data.time.split(":").map(Number);
        const endHours = (hours + 8) % 24;
        endTime = `${endHours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      } else {
        endTime = "17:00"; // Default end time if no start time provided
      }
      const endDateTime = `${formattedDate}T${endTime}:00`;

      // Format data according to backend schema
      const formattedData = {
        title: data.title,
        description: data.description,
        start_date: startDateTime,
        end_date: endDateTime,
        location: data.location,
        max_participants: data.max_participants,
      };

      // Remove organizer field as it's not in the expected format
      // Only include fields that are in the example format

      console.log("Submitting data:", formattedData);

      // Direct API call to ensure we're using the correct endpoint
      const url = isEditing
        ? `http://127.0.0.1:5000/api/events/${id}`
        : "http://127.0.0.1:5000/api/events";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "API request failed");
      }

      toast.success(`Event ${isEditing ? "updated" : "created"} successfully`);
      navigate("/events");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        `Failed to ${isEditing ? "update" : "create"} event: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? "Edit Event" : "Create Event"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Tech Conference 2023" {...field} />
                </FormControl>
                <FormDescription>
                  Give your event a clear and descriptive title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your event, include important details..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && !isNaN(field.value.getTime()) ? (
                            format(field.value, "MMMM d, yyyy")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time (optional)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Conference St, Tech City"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="organizer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe or Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Participants (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="100"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : parseInt(value, 10)
                        );
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/events")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Event"
                : "Create Event"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventFormPage;
