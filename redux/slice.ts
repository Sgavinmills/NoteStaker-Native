// slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Note, SubCategory } from "../types";
import { memory } from "../mockMemory";
interface AppState {
    notes: Note[];
    categories: Category[];
    subCategories: SubCategory[];
}

const initialState: AppState = {
    notes: memory.notes,
    categories: memory.categories,
    subCategories: memory.subCategories,
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        addNote(state, action: PayloadAction<Note>) {
            // dont forget to gve an id etc... obvs.
            state.notes.push(action.payload);
        },
        addCategory(state, action: PayloadAction<Category>) {
            // todo - ADD DATE STAMPS
            state.categories.push(action.payload);
        },
        updateNote(state, action: PayloadAction<Note>) {
            // todo - ADD DATE STAMPS
            const updatedNote = action.payload;
            const existingNoteIndex = state.notes.findIndex((note) => note.id === updatedNote.id);
            if (existingNoteIndex !== -1) {
                state.notes[existingNoteIndex].note = updatedNote.note;
                state.notes[existingNoteIndex].dateUpdated = new Date().toISOString();
            }
        },
        deleteNote(state, action: PayloadAction<string>) {
            const noteIdToDelete = action.payload;
            const noteIndex = state.notes.findIndex((note) => note.id === noteIdToDelete);
            if (noteIndex !== -1) {
                state.notes.splice(noteIndex, 1);
            }
        },
        // Define other reducers here if needed
    },
});

export const { addNote, addCategory, updateNote, deleteNote } = notesSlice.actions;

export default notesSlice.reducer;
