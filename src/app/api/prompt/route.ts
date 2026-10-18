import getAnalyticsFor from "@/ai/google";
import { GenerateContentResponse } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await getAnalyticsFor(body.prompt, true);

        if (!response) {
            return NextResponse.json({ data: "No response" });
        }

        const stream = new ReadableStream({
            async start(c) {
                for await (const chunk of response) {
                    if (chunk instanceof GenerateContentResponse) {
                        c.enqueue(chunk.text);
                    } else {
                        c.enqueue(chunk);
                    }
                }
                c.close();
            },
        });

        return new NextResponse(stream, {
            status: 200,
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
