// slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getMockMemory } from '../memoryfunctions/memoryfunctions';
import { Category, Note } from '../types';

interface AppState {
  notes: Note[],
  categories: Category[]

}

const memory = getMockMemory();

const initialState: AppState = {
  notes: memory.notes,
  categories: memory.categories
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote(state, action: PayloadAction<Note>) {
      state.notes.push(action.payload);
    },
    // Define other reducers here if needed
  },
});

export const { addNote } = notesSlice.actions;

export default notesSlice.reducer;
