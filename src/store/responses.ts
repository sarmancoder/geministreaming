import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from ".";
import type { ChatLine } from "@/types";

// Define a type for the slice state
export interface ResponsesState {
    chatLines: ChatLine[];
    response: string;
}

// Define the initial state using that type
const initialState: ResponsesState = {
    chatLines: [],
    response: "Hazle una pregunta a la IA",
};

export const responseSlice = createSlice({
    name: "responses",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setResponse(state, action: PayloadAction<string>) {
            state.response = action.payload;
        },
        addToResponse(state, action: PayloadAction<string>) {
            state.response += action.payload;
        },

        addQuestion(state, action: PayloadAction<string>) {
            state.chatLines.push({ type: "question", content: action.payload });
        },
        addResponse(state, action: PayloadAction<string>) {
            state.chatLines.push({ type: "response", content: action.payload });
        },
        addToLastResponse(state, action: PayloadAction<string>) {
            const last = state.chatLines.findLast((a) => a.type === "response");
            if (!last) return;
            last.content += action.payload;
            const lastIndex = state.chatLines.findLastIndex(
                (a) => a.type === "response",
            );
            state.chatLines[lastIndex] = last;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setResponse,
    addToResponse,
    addQuestion,
    addResponse,
    addToLastResponse,
} = responseSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectResponse = (state: RootState) => state.responses.response;
export const selectChatLines = (state: RootState) => state.responses.chatLines;

export default responseSlice.reducer;
