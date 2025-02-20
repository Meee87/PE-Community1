import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Event {
  date: Date;
  title: string;
  type: "training" | "competition" | "meeting";
}

const Calendar = ({ className }: { className?: string }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events] = React.useState<Event[]>([
    {
      date: new Date(2024, 3, 15),
      title: "تدريب كرة القدم",
      type: "training",
    },
    {
      date: new Date(2024, 3, 20),
      title: "بطولة السباحة",
      type: "competition",
    },
    {
      date: new Date(2024, 3, 25),
      title: "اجتماع المدربين",
      type: "meeting",
    },
  ]);

  const selectedDateEvents = events.filter(
    (event) => date && event.date.toDateString() === date.toDateString(),
  );

  return (
    <Card className={`w-full max-w-md mx-auto bg-white ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          التقويم الرياضي
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />

          {selectedDateEvents.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">أحداث اليوم:</h3>
              {selectedDateEvents.map((event, index) => (
                <div
                  key={index}
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
