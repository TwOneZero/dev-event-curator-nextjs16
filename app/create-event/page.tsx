import CreateEventForm from "@/components/CreateEventForm";

export const metadata = {
  title: "Create Event - DevEvent",
  description: "Create a new developer event and share it with the community",
};

export default function CreateEventPage() {
  return (
    <main className="container mx-auto px-5 sm:px-10 py-10">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-gradient text-6xl font-semibold max-sm:text-4xl mb-4">
          Create New Event
        </h1>
        <p className="text-light-200 text-lg max-w-2xl mx-auto">
          Share your developer event with the community. Fill in the details
          below to create and publish your event.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <CreateEventForm />
      </div>
    </main>
  );
}
