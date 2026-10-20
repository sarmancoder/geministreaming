"use client";

import { useAppSelector } from "@/store/hooks";
import { selectChatLines } from "@/store/responses";
import type { ChatLine as ChatLineType } from "@/types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bubble, BubbleContent } from "./ui/bubble";
type ResponsesType = {};

export default function Responses({}: ResponsesType) {
    const chatLines = useAppSelector(selectChatLines);
    return (
        <div className="border grow rounded-xl h-70 p-2 w-full max-w-300 mx-auto flex flex-col gap-5 overflow-auto">
            {chatLines.map((item) => (
                <ChatLine key={item.content} line={item} />
            ))}
        </div>
    );
}

function ChatLine({ line }: { line: ChatLineType }) {
    if (line.type === "question") {
        return (
            <Bubble align="end" className="max-w-xl">
                <BubbleContent>{line.content}</BubbleContent>
            </Bubble>
        );
    }
    return (
        <div className="bg-white rounded-2xl p-5 border border-black/35 max-w-3xl">
            <article className="prose w-full max-w-none">
                <Markdown remarkPlugins={[remarkGfm]}>{line.content}</Markdown>
            </article>
        </div>
    );
}
