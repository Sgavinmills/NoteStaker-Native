// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "@reduxjs/toolkit";
import notesReducer from "../slice";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    blacklist: ["memory"],
};

const memoryPersistConfig = {
    key: "memory",
    storage: AsyncStorage,
    blacklist: ["heightData", "menuOverlay"],
    // blacklist: ["heightData", "menuOverlay", "categories", "subCategories", "notes", "categoryList"],
};

const rootReducer = combineReducers({
    memory: persistReducer(memoryPersistConfig, notesReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            getDefaultMiddleware,
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export type RootState = ReturnType<typeof rootReducer>;
export const persistor = persistStore(store);

export default store;
export type AppDispatch = typeof store.dispatch;
