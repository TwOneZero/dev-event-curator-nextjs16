import { getEventBySlug } from "@/lib/actions/event.actions";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
    params: Promise<{
        slug: string;
    }>
}

export async function GET(
    req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse> {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { message: "Slug is required" },
                { status: 400 }
            );
        }

        const event = await getEventBySlug(slug);

        return NextResponse.json(
            { message: "Event fetched successfully!", event },
            { status: 200 }
        );
    } catch (e: any) {
        console.error(e);
        if (e.message === "Event not found") {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                message: "Event Fetch Failed",
                error: e,
            },
            { status: 500 }
        );
    }
}
