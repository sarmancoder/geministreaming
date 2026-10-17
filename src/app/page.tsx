import Responses from "@/components/Responses";
import { PromptForm } from "@/components/PromptForm";

export default function Home() {
    return (
        <div className="p-2 h-screen w-screen box-border flex flex-col gap-5">
            <Responses />
            <PromptForm />
        </div>
    );
}
