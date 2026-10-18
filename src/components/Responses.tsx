"use client";

import { useAppSelector } from "@/store/hooks";
import { selectResponse } from "@/store/responses";
import MarkdownPreview from "@uiw/react-markdown-preview";

type ResponsesType = {};

export default function Responses({}: ResponsesType) {
    const response = useAppSelector(selectResponse);
    return (
        <div className="border grow rounded-xl h-70 p-2 w-full overflow-auto">
            <MarkdownPreview
                source={response}
                style={{
                    backgroundColor: "inherit",
                    color: "inherit",
                }}
            />
        </div>
    );
}
