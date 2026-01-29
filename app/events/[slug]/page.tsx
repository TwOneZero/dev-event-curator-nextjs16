
import { getEventBySlug, getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";

// Define Page Props type
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Event metadata type for icon-based display
type EventMetadata = {
  icon: string;
  alt: string;
  label: string;
  value: string;
};

/**
 * Get event metadata with corresponding icons
 * Maps event properties to icon, alt text, and label for consistent display
 */
const getEventMetadata = (event: any): EventMetadata[] => {
  return [
    {
      icon: "/icons/calendar.svg",
      alt: "Date",
      label: "Date",
      value: event.date,
    },
    {
      icon: "/icons/clock.svg",
      alt: "Time",
      label: "Time",
      value: event.time,
    },
    {
      icon: "/icons/pin.svg",
      alt: "Location",
      label: "Location",
      value: event.location,
    },
    {
      icon: "/icons/mode.svg",
      alt: "Mode",
      label: "Mode",
      value: event.mode,
    },
    {
      icon: "/icons/audience.svg",
      alt: "Audience",
      label: "Audience",
      value: event.audience,
    },
  ];
};


const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag, index) => (
      <div className="pill" key={tag}>{tag}</div>
    ))}
  </div>
)


const EventDetailsPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  let event;
  try {
    event = await getEventBySlug(slug);
  } catch (error) {
    console.error("Error fetching event:", error);
    notFound();
  }

  if (!event) return notFound();

  const similarEvents = await getSimilarEventsBySlug(slug);

  const metadata = getEventMetadata(event);
  return (
    <section id="event">
      <div className="header">
        <h1>{event.title}</h1>

        {/* Event Metadata Cards with Icons */}
        <div className="flex flex-wrap gap-4 mt-6">
          {metadata.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-dark-200/50 px-4 py-3 rounded-xl border border-dark-200 hover:border-primary/50 transition-all"
            >
              <div className="bg-primary/20 p-2 rounded-lg flex-center">
                <Image
                  src={item.icon}
                  alt={item.alt}
                  width={20}
                  height={20}
                  className="w-5 h-5 brightness-0 invert opacity-80"
                />
              </div>
              <div>
                <p className="text-xs text-light-200 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-semibold mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="details">
        {/* Main Content */}
        <div className="content">
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border border-dark-200">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Overview</h3>
              <p className="leading-relaxed text-light-200">{event.overview}</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Description</h3>
              <p className="leading-relaxed text-light-200">{event.description}</p>

              {/* Organized By Section */}
              <div className="flex items-center gap-4 mt-6 p-5 bg-dark-200/30 rounded-xl border border-dark-200">
                <div className="w-14 h-14 bg-linear-to-br from-primary/30 to-primary/10 rounded-full flex-center overflow-hidden border-2 border-primary/20">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${event.organizer}&background=random`}
                    width={56}
                    height={56}
                    alt="organizer"
                  />
                </div>
                <div>
                  <p className="text-xs text-light-200 uppercase tracking-wider">Organized by</p>
                  <p className="font-bold text-lg mt-1">{event.organizer}</p>
                </div>
              </div>
            </div>

            <EventAgenda agendaItems={event.agenda} />
            <EventTags tags={event.tags} />
          </div>
        </div>

        {/* Sidebar - Booking Form */}
        <div className="booking lg:w-[400px]">
          <BookEvent eventTitle={event.title} />
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20 pb-20">
        <h2>Similar Events</h2>
        <div className="flex flex-wrap gap-4">
          {similarEvents && similarEvents.length > 0 ? similarEvents.map((similarEvent: IEvent) => (
            <div key={similarEvent.slug} className="flex-1">
              <EventCard key={similarEvent.slug} {...similarEvent} />
            </div>
          )) : <p className="text-light-200">No similar events found</p>}
        </div>
      </div>
    </section>
  );
}

export default EventDetailsPage;
