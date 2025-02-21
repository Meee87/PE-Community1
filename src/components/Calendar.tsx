import React, { useEffect } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
    <Card className={`w-full max-w-[350px] mx-auto bg-white ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            التقويم الرياضي
          </CardTitle>
          {isAdmin && (
            <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#F8FAF5]">
                <DialogHeader>
                  <DialogTitle>إضافة حدث جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="عنوان الحدث"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Select
                      value={newEvent.type}
                      onValueChange={(
                        value: "training" | "competition" | "meeting",
                      ) => setNewEvent({ ...newEvent, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="نوع الحدث" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="training">تدريب</SelectItem>
                        <SelectItem value="competition">منافسة</SelectItem>
                        <SelectItem value="meeting">اجتماع</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full bg-[#7C9D32] hover:bg-[#7C9D32]/90"
                    onClick={handleAddEvent}
                  >
                    إضافة
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full max-w-[300px] mx-auto"
          />

          {selectedDateEvents.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">أحداث اليوم:</h3>
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-2 bg-gray-50 rounded-md flex items-center justify-between"
                >
                  <span>{event.title}</span>
                  <span className="text-sm text-gray-500">
                    {event.type === "training" && "تدريب"}
                    {event.type === "competition" && "منافسة"}
                    {event.type === "meeting" && "اجتماع"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
