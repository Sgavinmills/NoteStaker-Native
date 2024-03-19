// reducers.ts
import { combineReducers } from '@reduxjs/toolkit';
import notesReducer from '../slice';

const rootReducer = combineReducers({
  memory: notesReducer,
  // Add other reducers here if needed
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
