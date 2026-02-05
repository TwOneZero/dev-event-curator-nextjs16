"use server";

import { Event, Booking } from "@/database";
import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { revalidateTag, cacheTag } from "next/cache";

// Cache tag constant for events list
const CACHE_TAG_EVENTS = "events";

export async function getEventBySlug(slug: string) {
  try {
    await connectDB();

    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      throw new Error("Event not found");
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSimilarEventsBySlug(slug: string) {
  try {
    await connectDB();

    // First, get the current event to access its tags
    const currentEvent = await Event.findOne({ slug }).lean();

    if (!currentEvent) {
      throw new Error("Event not found");
    }

    // Find similar events based on matching tags
    // Prioritize events with more matching tags
    const similarEvents = await Event.find({
      _id: { $ne: currentEvent._id }, // Exclude the current event
      tags: { $in: currentEvent.tags }, // Match at least one tag
    })
      .limit(4)
      .sort({ createdAt: 1 }) // Sort by least recent
      .lean();

    // Return JSON-serializable object
    return JSON.parse(JSON.stringify(similarEvents));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getAllEventsCached = async () => {
  "use cache";

  // Tag this cache for targeted invalidation
  cacheTag(CACHE_TAG_EVENTS);

  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 }).lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw error;
  }
};

export async function deleteEventBySlug(slug: string) {
  try {
    await connectDB();

    // Find the event first to verify it exists and get the ID
    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      throw new Error("Event not found");
    }

    // Cascade delete: Remove all bookings associated with this event
    await Booking.deleteMany({ eventId: event._id });

    // Delete image from Cloudinary if it exists
    if (event.image && event.image.includes("cloudinary")) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = event.image.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split(".")[0]; // Remove file extension
        const folder = urlParts[urlParts.length - 2]; // Get folder name
        const fullPublicId = `${folder}/${publicId}`;

        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        // Log error but don't block event deletion
        console.error(
          "Failed to delete image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    // Delete the event
    const deletedEvent = await Event.findOneAndDelete({ slug });

    if (!deletedEvent) {
      throw new Error("Event not found");
    }

    // Invalidate the events cache so the landing page shows updated data
    try {
      revalidateTag(CACHE_TAG_EVENTS, { expire: 0 });
    } catch (cacheError) {
      // Log error but don't block the deletion if cache invalidation fails
      console.error("Failed to invalidate events cache:", cacheError);
    }

    return JSON.parse(JSON.stringify(deletedEvent));
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

export async function createEvent(formData: FormData) {
  try {
    await connectDB();

    // Extract data from FormData
    const event: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      if (key !== "image") {
        event[key] = value;
      }
    });

    // Parse JSON fields
    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

    // Handle image upload
    const file = formData.get("image") as File;

    if (!file) {
      throw new Error("Image file is required");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "dev-curator" },
            (error, results) => {
              if (error) return reject(error);
              resolve(results as { secure_url: string });
            }
          )
          .end(buffer);
      }
    );

    event.image = uploadResult.secure_url;

    // Create event in database
    const createdEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });

    // Invalidate the events cache so the landing page shows updated data
    try {
      revalidateTag(CACHE_TAG_EVENTS, { expire: 0 });
    } catch (cacheError) {
      // Log error but don't block the creation if cache invalidation fails
      console.error("Failed to invalidate events cache:", cacheError);
    }

    return JSON.parse(JSON.stringify(createdEvent));
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create event"
    );
  }
}
