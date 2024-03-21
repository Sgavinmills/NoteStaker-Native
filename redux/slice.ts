// slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Note } from "../types";
import mockMemory from "../mockMemory.json";

interface AppState {
    notes: Note[];
    categories: Category[];
}

const memory = mockMemory;

const initialState: AppState = {
    notes: memory.notes,
    categories: memory.categories,
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        addNote(state, action: PayloadAction<Note>) {
            state.notes.push(action.payload);
        },
        addCategory(state, action: PayloadAction<Category>) {
            state.categories.push(action.payload);
        },
        // Define other reducers here if needed
    },
});

export const { addNote, addCategory } = notesSlice.actions;

export default notesSlice.reducer;
