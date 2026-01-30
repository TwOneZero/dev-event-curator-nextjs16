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
    'use cache';

    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 }).lean();

        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.error("Error fetching all events:", error);
        throw error;
    }
};