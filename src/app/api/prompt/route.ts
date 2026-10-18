import getAnalyticsFor from "@/ai/google";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await getAnalyticsFor(body.prompt);

        return NextResponse.json(
            { success: true, data: response },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
