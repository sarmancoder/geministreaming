"use client";

import { useAppSelector } from "@/store/hooks";
import { selectResponse } from "@/store/responses";

type ResponsesType = {};

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export default function Responses({}: ResponsesType) {
    const response = useAppSelector(selectResponse);
    return (
        <div className="border grow rounded-xl h-70 p-2 w-full">{response}</div>
    );
}
