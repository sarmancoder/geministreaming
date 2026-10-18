import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from ".";

// Define a type for the slice state
export interface ResponsesState {
    response: string;
}

// Define the initial state using that type
const initialState: ResponsesState = {
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
    },
});

// Action creators are generated for each case reducer function
export const { setResponse } = responseSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectResponse = (state: RootState) => state.responses.response;

export default responseSlice.reducer;
