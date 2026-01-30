import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

export default async function EventList({ events }: { events: IEvent[] }) {
  return (
    <ul className="events">
      {events && events.length > 0 ? (
        events.map((event: IEvent) => (
          <li key={event.title} className="list-none">
            <EventCard {...event} />
          </li>
        ))
      ) : (
        <p className="text-center text-gray-500">
          No events found at the moment.
        </p>
      )}
    </ul>
  );
}
