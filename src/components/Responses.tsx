"use client";

import { useAppSelector } from "@/store/hooks";
import {
    type ChatLine as ChatLineType,
    selectChatLines,
} from "@/store/responses";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bubble, BubbleContent } from "./ui/bubble";
type ResponsesType = {};

export default function Responses({}: ResponsesType) {
    const chatLines = useAppSelector(selectChatLines);
    return (
        <div className="border grow rounded-xl h-70 p-2 w-full max-w-300 mx-auto flex flex-col gap-2 overflow-auto">
            {chatLines.map((item) => (
                <ChatLine key={item.content} line={item} />
            ))}
        </div>
    );
}

function ChatLine({ line }: { line: ChatLineType }) {
    if (line.type === "question") {
        return (
            <Bubble align="end">
                <BubbleContent>{line.content}</BubbleContent>
            </Bubble>
        );
    }
    return (
        <article className="prose max-w-full">
            <Markdown remarkPlugins={[remarkGfm]}>{line.content}</Markdown>
        </article>
    );
}
