import ExploreBtn from "@/components/ExploreBtn";
import EventList from "@/components/EventList";
import { getAllEventsCached } from "@/lib/actions/event.actions";

const Page = async () => {
  const events = await getAllEventsCached();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event you Can&#39;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <EventList events={events} />
      </div>
    </section>
  );
};
export default Page;
