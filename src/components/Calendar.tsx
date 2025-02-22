import React, { useEffect } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

interface Event {
  id: string;
  date: Date;
  title: string;
  type: "training" | "competition" | "meeting";
}

const Calendar = ({ className }: { className?: string }) => {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [showAddEvent, setShowAddEvent] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState({
    title: "",
    type: "training" as "training" | "competition" | "meeting",
  });

  useEffect(() => {
    checkAdmin();
    fetchEvents();
    setupRealtimeSubscription();
  }, []);

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setIsAdmin(profile?.role === "admin");
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }

    setEvents(
      data.map((event) => ({
        ...event,
        date: new Date(event.date),
      })),
    );
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel("events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          const newEvent = {
            ...payload.new,
            date: new Date(payload.new.date),
          };
          setEvents((current) => [...current, newEvent]);
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleAddEvent = async () => {
    if (!date || !newEvent.title || !newEvent.type) return;

    try {
      const { error } = await supabase.from("events").insert([
        {
          title: newEvent.title,
          type: newEvent.type,
          date: date.toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        description: "تم إضافة الحدث بنجاح",
      });

      setNewEvent({ title: "", type: "training" });
      setShowAddEvent(false);
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء إضافة الحدث",
      });
    }
  };

  const selectedDateEvents = events.filter(
    (event) => date && event.date.toDateString() === date.toDateString(),
  );

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`w-full max-w-md ${className}`}>
        <div className="grid gap-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="mx-auto"
            classNames={{
              day_selected:
                "bg-[#7C9D32] text-white hover:bg-[#7C9D32] focus:bg-[#7C9D32]",
              day_today: "bg-transparent text-black",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent",
              day: "h-9 w-9 p-0 font-normal hover:bg-gray-100",
              nav_button: "hover:bg-gray-100 text-black",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              caption: "relative py-4 px-8 text-center text-lg font-normal",
              table: "w-full border-collapse",
              head_cell: "text-black font-normal",
              root: "bg-white p-0",
            }}
          />

          {selectedDateEvents.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">أحداث اليوم:</h3>
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-gray-50 rounded-md flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">{event.title}</span>
                  <span className="text-sm px-2 py-1 rounded bg-[#748d19]/10 text-[#748d19]">
                    {event.type === "training" && "تدريب"}
                    {event.type === "competition" && "منافسة"}
                    {event.type === "meeting" && "اجتماع"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
