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
            // dont mutate state. see updateCategories for proper implementation
            state.notes.unshift(action.payload);
        },
        addCategory(state, action: PayloadAction<Category>) {
            // todo - ADD DATE STAMPS
            // dont mutate state. see updateCategories for proper implementation
            state.categories.push(action.payload);
        },
        updateNote(state, action: PayloadAction<Note>) {
            // todo - ADD DATE STAMPS
            // dont mutate state. see updateCategories for proper implementation
            const updatedNote = action.payload;
            updatedNote.dateUpdated = new Date().toISOString();
            const existingNoteIndex = state.notes.findIndex((note) => note.id === updatedNote.id);

            if (existingNoteIndex !== -1) {
                const updatedNotes = [...state.notes];
                updatedNotes[existingNoteIndex] = updatedNote;

                state.notes = updatedNotes;
            }
        },
        deleteNote(state, action: PayloadAction<string>) {
            // dont mutate state. see updateCategories for proper implementation
            const noteIdToDelete = action.payload;
            const noteIndex = state.notes.findIndex((note) => note.id === noteIdToDelete);
            if (noteIndex !== -1) {
                state.notes.splice(noteIndex, 1);
            }
        },
        updateSubCategories(state, action: PayloadAction<SubCategory[]>) {
            const newSubCategories = action.payload;
            return { ...state, subCategories: newSubCategories };
        },
        updateNotes(state, action: PayloadAction<Note[]>) {
            const newNotes = action.payload;
            return { ...state, notes: newNotes };
        },
        // Define other reducers here if needed
    },
});

export const { addNote, addCategory, updateNote, deleteNote } = notesSlice.actions;

export default notesSlice.reducer;
