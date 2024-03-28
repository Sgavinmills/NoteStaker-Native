// reducers.ts
import { combineReducers } from "@reduxjs/toolkit";
import notesReducer from "../slice";

const rootReducer = combineReducers({
    memory: notesReducer,
    // Add other reducers here if needed

    // TODO - Currently having all state inside memory, can we separate the menuOverlay states?
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
