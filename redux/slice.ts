// slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Note, SubCategory, MenuOverlay, CatHeight, HeightUpdateInfo, NewNoteData } from "../types";
import { memory } from "../mockMemory";
import { produce } from "immer";
import * as Device from "expo-device";

interface AppState {
    notes: { [id: string]: Note };
    categories: { [id: string]: Category };
    subCategories: { [id: string]: SubCategory };
    categoryList: string[];

    menuOverlay: MenuOverlay;
    heightData: CatHeight[];
    showSecureNote: string[];
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
            categoryIndex: null,
            subCategoryIndex: null,
            noteIndex: null,
        },
    },
    heightData: [],
    showSecureNote: [],
};
const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        addToShowSecureNote(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const id = action.payload; // shouldwe use maps instead?! quicker..
                if (!draft.showSecureNote.includes(id)) {
                    draft.showSecureNote.push(id);
                }
            });
        },
        removeFromShowSecureNote(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const id = action.payload; // shouldwe use maps instead?! quicker..
                const index = draft.showSecureNote.indexOf(id);
                if (index > -1) {
                    draft.showSecureNote.splice(index, 1);
                }
            });
        },
        // updateCategoryHeight adds or updates a category height in the height data, for use with scrollTo
        updateCategoryHeight(state, action: PayloadAction<HeightUpdateInfo>) {
            return produce(state, (draft) => {
                const { newHeight, categoryIndex } = action.payload;

                if (draft.heightData[categoryIndex]) {
                    draft.heightData[categoryIndex].catHeight = newHeight;
                } else {
                    const newCatHeightItem: CatHeight = {
                        catHeight: newHeight,
                        subHeights: [],
                        noteHeights: [],
                    };
                    draft.heightData[categoryIndex] = newCatHeightItem;
                }
            });
        },

        // updateNoteHeight adds or updates a note height in the height data, for use with scrollTo
        updateNoteHeight: (state, action: PayloadAction<HeightUpdateInfo>) => {
            return produce(state, (draft) => {
                const { newHeight, categoryIndex, subCategoryIndex, noteIndex } = action.payload;

                if (subCategoryIndex >= 0) {
                    if (draft.heightData[categoryIndex]) {
                        // Ensure the subCategoryIndex is valid
                        if (draft.heightData[categoryIndex].subHeights[subCategoryIndex]) {
                            // Update the noteHeight at the specified indices
                            draft.heightData[categoryIndex].subHeights[subCategoryIndex].noteHeights[noteIndex] =
                                newHeight;
                        }
                    }
                } else {
                    if (draft.heightData[categoryIndex]) {
                        draft.heightData[categoryIndex].noteHeights[noteIndex] = newHeight;
                    }
                }
            });
        },

        // updateSubCategoryHeight adds or updates a subCategoryHeight in the height data, for use with scrollTo
        updateSubCategoryHeight: (state, action: PayloadAction<HeightUpdateInfo>) => {
            return produce(state, (draft) => {
                const { newHeight, categoryIndex, subCategoryIndex } = action.payload;

                if (draft.heightData[categoryIndex]) {
                    // Ensure the subCategoryIndex is valid
                    if (draft.heightData[categoryIndex].subHeights[subCategoryIndex]) {
                        // Update the noteHeight at the specified indices
                        draft.heightData[categoryIndex].subHeights[subCategoryIndex].subHeight = newHeight;
                    } else {
                        const newSubCatHeightItem: SubHeight = {
                            subHeight: newHeight,
                            noteHeights: [],
                        };
                        draft.heightData[categoryIndex].subHeights[subCategoryIndex] = newSubCatHeightItem;
                    }
                }
            });
        },

        // updateMenuOverlay sets a new config on the menu overlay
        updateMenuOverlay(state, action: PayloadAction<MenuOverlay>) {
            const newOverlay = { ...action.payload };
            return { ...state, menuOverlay: newOverlay };
        },

        // updateCategoryList updates the categoryList
        updateCategoryList(state, action: PayloadAction<string[]>) {
            return { ...state, categoryList: action.payload };
        },

        // createNewNote adds a blank note to the notes map and gives the ID to the correct category
        createNewNote(state, action: PayloadAction<NewNoteData>) {
            return produce(state, (draft) => {
                const { categoryID, subCategoryID, imageURI, noteInsertIndex } = action.payload;
                const noteToAdd: Note = {
                    id: getRandomID(),
                    note: "",
                    additionalInfo: "",
                    dateAdded: new Date().toISOString(),
                    dateUpdated: "",
                    priority: "normal",
                    completed: false,
                    imageURI: imageURI,
                    isNewNote: true,
                    createdBy: Device.deviceName ? Device.deviceName : "Annoymous",
                    lastUpdatedBy: "",
                    isSecureNote: false,
                };

                draft.notes[noteToAdd.id] = noteToAdd;

                if (!subCategoryID) {
                    draft.categories[categoryID].notes.splice(noteInsertIndex, 0, noteToAdd.id);
                } else {
                    draft.subCategories[subCategoryID].notes.splice(noteInsertIndex, 0, noteToAdd.id);
                }
            });
        },

        // removeAllNotesFromCategory deletes all the notes from a category
        // If the notes dont exist in another category they will be deleted entirely
        removeAllNotesFromCategory(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const categoryID = action.payload;

                const notesInCategory = draft.categories[categoryID].notes;
                notesInCategory.forEach((noteID) => {
                    if (!noteExistsInOtherCategories(draft.categories, draft.subCategories, noteID, categoryID, [])) {
                        delete draft.notes[noteID];
                    }
                });

                draft.categories[categoryID].notes = [];
            });
        },

        // removeAllNotesFromSubCategory deletes all the notes from a category
        // If the notes dont exist in another category they will be deleted entirely
        removeAllNotesFromSubCategory(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const subCategoryID = action.payload;

                const notesInSubCategory = draft.subCategories[subCategoryID].notes;
                notesInSubCategory.forEach((noteID) => {
                    if (
                        !noteExistsInOtherCategories(draft.categories, draft.subCategories, noteID, null, [
                            subCategoryID,
                        ])
                    ) {
                        delete draft.notes[noteID];
                    }
                });

                draft.subCategories[subCategoryID].notes = [];
            });
        },

        // deleteCategory completely removes a category. Any subcategories inside will be removed.
        // Any notes in the category or its sub categories will be deleted unless they exist in other categories
        deleteCategory(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const categoryID = action.payload;

                // delete notes
                const notesInCategory = draft.categories[categoryID].notes;
                if (notesInCategory.length > 0) {
                    notesInCategory.forEach((noteID) => {
                        if (
                            !noteExistsInOtherCategories(draft.categories, draft.subCategories, noteID, categoryID, [])
                        ) {
                            delete draft.notes[noteID];
                        }
                    });
                }
                const subCats = draft.categories[categoryID].subCategories;
                if (subCats.length > 0) {
                    subCats.forEach((subCatID) => {
                        const notesInSubCat = draft.subCategories[subCatID].notes;
                        notesInSubCat.forEach((noteID) => {
                            if (
                                !noteExistsInOtherCategories(
                                    draft.categories,
                                    draft.subCategories,
                                    noteID,
                                    categoryID,
                                    subCats
                                )
                            ) {
                                delete draft.notes[noteID];
                            }
                        });
                    });
                }

                // delete subCategorys
                subCats.forEach((subCatID) => {
                    delete draft.subCategories[subCatID];
                });

                // delete category
                delete draft.categories[categoryID];

                // remove category from list
                const categoryIndex = draft.categoryList.indexOf(categoryID);
                draft.categoryList.splice(categoryIndex, 1);
            });
        },

        // deleteSubCategory completely removes a subCategory.
        // Any notes in the subCategory will be deleted unless they exist in other categories
        deleteSubCategory(state, action: PayloadAction<{ subCategoryID: string; parentCategoryID: string }>) {
            return produce(state, (draft) => {
                const { parentCategoryID, subCategoryID } = action.payload;

                // delete notes
                const notesInSubCategory = draft.subCategories[subCategoryID].notes;
                if (notesInSubCategory.length > 0) {
                    notesInSubCategory.forEach((noteID) => {
                        if (
                            !noteExistsInOtherCategories(draft.categories, draft.subCategories, noteID, null, [
                                subCategoryID,
                            ])
                        ) {
                            delete draft.notes[noteID];
                        }
                    });
                }

                // delete subCategory
                delete draft.subCategories[subCategoryID];

                // remove subCategory from parent category list
                const parentCategory = draft.categories[parentCategoryID];
                const index = parentCategory.subCategories.indexOf(subCategoryID);
                parentCategory.subCategories.splice(index, 1);
            });
        },

        // updateCategory updates a single category
        updateCategory(state, action: PayloadAction<Category>) {
            const categoryCopy = action.payload;
            categoryCopy.dateUpdated = new Date().toISOString();
            categoryCopy.lastUpdatedBy = Device.deviceName ? Device.deviceName : "Annoymous";
            const categoriesCopy = { ...state.categories };
            if (categoriesCopy[categoryCopy.id]) {
                categoriesCopy[categoryCopy.id] = { ...categoryCopy };
            }

            return { ...state, categories: categoriesCopy };
        },

        // updateSubCategory updates a single subCategory
        updateSubCategory(state, action: PayloadAction<SubCategory>) {
            const subCategoryCopy = action.payload;
            subCategoryCopy.dateUpdated = new Date().toISOString();
            subCategoryCopy.lastUpdatedBy = Device.deviceName ? Device.deviceName : "Annoymous";
            const subCategoryId = subCategoryCopy.id;

            const subCategoriesCopy = { ...state.subCategories };

            if (subCategoriesCopy[subCategoryId]) {
                subCategoriesCopy[subCategoryId] = { ...subCategoryCopy };
            }

            return { ...state, subCategories: subCategoriesCopy };
        },

        // deleteNote deletes a note from all categories. It removes the note from notes and removes it's ID from any category notes
        deleteNote(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const noteID = action.payload;
                delete draft.notes[noteID];

                const categories = Object.values(draft.categories);
                categories.forEach((category) => {
                    const noteIndex = category.notes.indexOf(noteID);
                    if (noteIndex > -1) {
                        category.notes.splice(noteIndex, 1);
                    }
                });

                const subCategories = Object.values(draft.subCategories);
                subCategories.forEach((subCategory) => {
                    const noteIndex = subCategory.notes.indexOf(noteID);
                    if (noteIndex > -1) {
                        subCategory.notes.splice(noteIndex, 1);
                    }
                });
            });
        },

        // addSubCategory creates a new subCategory and adds its ID to the parentcategory list
        // if the parent category already has notes then these are moved to the new subCategory
        addSubCategory(state, action: PayloadAction<{ name: string; parentCategoryID: string }>) {
            return produce(state, (draft) => {
                const { name, parentCategoryID } = action.payload;

                const newSubCategory: SubCategory = {
                    id: getRandomID(),
                    name: name,
                    notes: [],
                    dateAdded: new Date().toISOString(),
                    dateUpdated: "",
                    parentCategory: parentCategoryID,
                    createdBy: Device.deviceName ? Device.deviceName : "Annoynmous",
                    lastUpdatedBy: "",
                };

                const parentCategory = draft.categories[parentCategoryID];
                draft.subCategories[newSubCategory.id] = newSubCategory;
                parentCategory.subCategories.push(newSubCategory.id);

                if (parentCategory.notes.length > 0) {
                    newSubCategory.notes = parentCategory.notes;
                    parentCategory.notes = [];
                }
            });
        },

        // addCategory creates a new category and adds its ID to the categoryList
        addCategory(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const newCategory: Category = {
                    id: getRandomID(),
                    name: action.payload,
                    notes: [],
                    subCategories: [],
                    dateAdded: new Date().toISOString(),
                    dateUpdated: "",
                    createdBy: Device.deviceName ? Device.deviceName : "Annoynmous",
                    lastUpdatedBy: "",
                };

                draft.categories[newCategory.id] = newCategory;
                draft.categoryList.push(newCategory.id);
            });
        },

        // updateNote updates a single note
        updateNote(state, action: PayloadAction<Note>) {
            const newNote = action.payload;

            newNote.dateUpdated = new Date().toISOString();
            newNote.lastUpdatedBy = Device.deviceName ? Device.deviceName : "Annoymous";

            const newNotes = { ...state.notes };
            newNotes[newNote.id] = newNote;
            return { ...state, notes: newNotes };
        },

        // Define other reducers here if needed
    },
});
export const {
    updateCategoryList,
    addCategory,
    updateNote,
    updateCategory,
    updateSubCategory,
    addSubCategory,
    updateMenuOverlay,
    updateCategoryHeight,
    updateSubCategoryHeight,
    updateNoteHeight,
    createNewNote,
    deleteNote,
    deleteCategory,
    deleteSubCategory,
    removeAllNotesFromCategory,
    removeAllNotesFromSubCategory,
    addToShowSecureNote,
    removeFromShowSecureNote,
} = notesSlice.actions;

export default notesSlice.reducer;

import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { getRandomID } from "../memoryfunctions/memoryfunctions";
import { SubHeight } from "../types";
import { noteExistsInOtherCategories } from "../utilFuncs/utilFuncs";
export const useAppDispatch = () => useDispatch<AppDispatch>();
