import { getEventBySlug, deleteEventBySlug } from "@/lib/actions/event.actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { IEvent } from "@/database";

// Define Page Props type
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const DeleteEventPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  let event: IEvent;
  try {
    event = await getEventBySlug(slug);
  } catch (error) {
    console.error("Error fetching event:", error);
    notFound();
  }

  if (!event) {
    return notFound();
  }

  async function handleDelete() {
    "use server";

    try {
      await deleteEventBySlug(slug);
      redirect("/");
    } catch (error) {
      // Check if this is a Next.js redirect error (expected behavior)
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        (error as { digest: string }).digest?.includes("NEXT_REDIRECT")
      ) {
        // Don't log - this is expected redirect behavior after successful deletion
        throw error;
      }

      // Log actual errors (database failures, etc.)
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-dark-100 rounded-2xl border border-dark-200 p-8 md:p-12 shadow-xl">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-4">Delete Event</h1>

          {/* Warning Message */}
          <p className="text-light-200 text-center mb-8">
            Are you sure you want to delete this event? This action cannot be
            undone. All associated bookings will also be permanently removed.
          </p>

          {/* Event Details Card */}
          <div className="bg-dark-200/50 rounded-xl p-6 mb-8 border border-dark-200">
            <h2 className="text-xl font-semibold mb-2 text-white">
              {event.title}
            </h2>
            <p className="text-light-200 text-sm mb-4">
              {event.date} at {event.time}
            </p>
            <p className="text-light-200 line-clamp-3">{event.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form action={handleDelete} className="flex-1">
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Confirm Delete
              </button>
            </form>

            <Link
              href={`/events/${slug}`}
              className="flex-1 bg-dark-200 hover:bg-dark-200/80 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center flex items-center justify-center gap-2 border border-dark-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeleteEventPage;
