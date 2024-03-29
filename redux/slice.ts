// slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Note, SubCategory, MenuOverlay } from "../types";
import { memory } from "../mockMemory";
interface AppState {
    notes: { [id: string]: Note };
    categories: { [id: string]: Category };
    subCategories: { [id: string]: SubCategory };
    categoryList: string[];

    menuOverlay: MenuOverlay;
}

const initialState: AppState = {
    notes: memory.notes,
    categories: memory.categories,
    subCategories: memory.subCategories,
    categoryList: memory.categoryList,
    menuOverlay: {
        isShowing: false,
        menuType: "",
        menuData: {
            noteID: "",
            categoryID: "",
            subCategoryID: "",
        },
    },
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        updateMenuOverlay(state, action: PayloadAction<MenuOverlay>) {
            const newOverlay = { ...action.payload };

            // check if we need to copy state here, might be unnecessary processing. - can we separate and have two states? one for memory/data one for menu?
            return { ...state, menuOverlay: newOverlay };
        },
        updateCategoryList(state, action: PayloadAction<string[]>) {
            return { ...state, categoryList: action.payload };
        },

        // new notes all need to be added to a category. This is handled separately for now.
        // maybe should handle together, similar to how doing addsubcategory
        addNewNoteToNotes(state, action: PayloadAction<Note>) {
            const newNote = action.payload;
            const newState: AppState = {
                ...state,
                notes: {
                    ...state.notes,
                    [newNote.id]: newNote,
                },
            };

            return newState;
        },

        updateCategory(state, action: PayloadAction<Category>) {
            const categoryCopy = action.payload;

            const categoriesCopy = { ...state.categories };
            if (categoriesCopy[categoryCopy.id]) {
                categoriesCopy[categoryCopy.id] = { ...categoryCopy };
            }

            return { ...state, categories: categoriesCopy };
        },

        updateSubCategory(state, action: PayloadAction<SubCategory>) {
            const subCategoryCopy = action.payload;
            const subCategoryId = subCategoryCopy.id;

            const subCategoriesCopy = { ...state.subCategories };

            if (subCategoriesCopy[subCategoryId]) {
                subCategoriesCopy[subCategoryId] = { ...subCategoryCopy };
            }

            return { ...state, subCategories: subCategoriesCopy };
        },

        deleteNoteFromAllCategories(state: AppState, action: PayloadAction<string>) {
            const noteIdToDelete = action.payload;

            const updatedNotes = { ...state.notes };
            delete updatedNotes[noteIdToDelete];

            const categoriesCopy = { ...state.categories };
            const cats = Object.values(categoriesCopy);

            const newCats: { [id: string]: Category } = {};
            cats.forEach((cat) => {
                const index = cat.notes.indexOf(noteIdToDelete);
                const newNotes = [...cat.notes];
                if (index > -1) {
                    newNotes.splice(index, 1);
                }

                const newCategory = { ...cat, notes: newNotes };
                newCats[newCategory.id] = newCategory;
            });

            const subCategoriesCopy = { ...state.subCategories };
            const subCats = Object.values(subCategoriesCopy);

            const newSubCats: { [id: string]: SubCategory } = {};
            subCats.forEach((subCat) => {
                const index = subCat.notes.indexOf(noteIdToDelete);
                const newNotes = [...subCat.notes];
                if (index > -1) {
                    newNotes.splice(index, 1);
                }

                const newSubCategory = { ...subCat, notes: newNotes };
                newSubCats[newSubCategory.id] = newSubCategory;
            });

            return {
                ...state,
                categories: newCats,
                subCategories: newSubCats,
                notes: updatedNotes,
            };
        },

        addCategory(state, action: PayloadAction<Category>) {
            const newCategory = action.payload;
            const newCategories = { ...state.categories };
            newCategories[newCategory.id] = newCategory;

            const newCategoryList = [...state.categoryList];
            newCategoryList.push(newCategory.id);

            // add new categories to map.
            return { ...state, categories: newCategories, categoryList: newCategoryList };
        },

        addSubCategory(state, action: PayloadAction<{ subCatName: string; parentCatID: string }>) {
            const newSubCategory: SubCategory = {
                id: getRandomID(),
                name: action.payload.subCatName,
                notes: [],
                dateAdded: "",
                dateUpdated: "",
                parentCategory: action.payload.parentCatID,
            };

            // add to parent category
            const parentCategoryCopy = { ...state.categories[action.payload.parentCatID] };
            const parentCatSubCatsCopy = [...parentCategoryCopy.subCategories];
            parentCatSubCatsCopy.push(newSubCategory.id);
            parentCategoryCopy.subCategories = parentCatSubCatsCopy;

            if (parentCategoryCopy.notes.length > 0) {
                newSubCategory.notes = [...parentCategoryCopy.notes];
                parentCategoryCopy.notes = [];
            }

            const newSubCategories = { ...state.subCategories };
            newSubCategories[newSubCategory.id] = newSubCategory;

            const categoriesCopy = { ...state.categories };
            categoriesCopy[parentCategoryCopy.id] = parentCategoryCopy;

            return { ...state, categories: categoriesCopy, subCategories: newSubCategories };
        },

        updateNote(state, action: PayloadAction<Note>) {
            const newNote = action.payload;
            const newNotes = { ...state.notes };
            newNotes[newNote.id] = newNote;
            return { ...state, notes: newNotes };
        },

        // Define other reducers here if needed
    },
});
export const {
    updateCategoryList,
    deleteNoteFromAllCategories,
    addNewNoteToNotes,
    addCategory,
    updateNote,
    updateCategory,
    updateSubCategory,
    addSubCategory,
    updateMenuOverlay,
} = notesSlice.actions;

export default notesSlice.reducer;

import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { getRandomID } from "../memoryfunctions/memoryfunctions";
export const useAppDispatch = () => useDispatch<AppDispatch>();
