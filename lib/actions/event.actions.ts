'use server';

import { Event } from "@/database";
import connectDB from "@/lib/mongodb";

export async function getEventBySlug(slug: string) {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean();

        if (!event) {
            throw new Error("Event not found");
        }

        // Convert MongoDB ObjectId and Dates to strings for serialization if needed,
        // though .lean() returns POJOs, Date objects might still need serialization for client components
        // but this is a Server Action returning to Server Component mostly, so it should be fine.
        // However, specifically for `_id` and dates, it's safer to serialize if passing to client.
        // For now, returning as is since we are consuming in SC or Route Handler.

        // We want to return a JSON-serializable object just in case we pass it to a client component later.
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
