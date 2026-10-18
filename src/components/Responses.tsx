"use client";

import { useAppSelector } from "@/store/hooks";
import { selectResponse } from "@/store/responses";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
type ResponsesType = {};

export default function Responses({}: ResponsesType) {
    const response = useAppSelector(selectResponse);
    return (
        <div className="border grow rounded-xl h-70 p-2 w-full overflow-auto">
            <article className="prose max-w-full">
                <Markdown remarkPlugins={[remarkGfm]}>{response}</Markdown>
            </article>
        </div>
    );
}
