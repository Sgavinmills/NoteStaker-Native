// slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    Category,
    Note,
    SubCategory,
    MenuOverlay,
    CatHeight,
    HeightUpdateInfo,
    NewNoteData,
    IDs,
    Memory,
    Ref,
    DontForgetMeConfig,
    SubtleMessage,
    dontForgetMeRef,
    reminderID,
} from "../types";
import { memory } from "../mockMemory";
import { produce } from "immer";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

interface AppState {
    notes: { [id: string]: Note };
    categories: { [id: string]: Category };
    subCategories: { [id: string]: SubCategory };
    categoryList: Ref[];

    menuOverlay: MenuOverlay;
    heightData: CatHeight[];
    scrollToOffset: number;
    canShowSecure: {
        homeScreen: boolean;
        categories: string[];
    };
    dontForgetMe: {
        [id: string]: dontForgetMeRef;
    };

    subtleMessage: SubtleMessage;
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
            isSearchTile: false,
            subMenu: "",
        },
    },
    heightData: [],
    scrollToOffset: -1,
    canShowSecure: {
        homeScreen: false,
        categories: [],
    },

    subtleMessage: {
        message: "",
        timeOut: -1,
    },

    dontForgetMe: {},
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        // rename this more generic since applies to cats now too (or subcats rather)
        addToShowSecureNote(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const id = action.payload; // shouldwe use maps instead?! quicker..
                if (!draft.canShowSecure.categories.includes(id)) {
                    draft.canShowSecure.categories.push(id);
                }
            });
        },
        removeFromShowSecureNote(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const id = action.payload; // shouldwe use maps instead?! quicker..
                const index = draft.canShowSecure.categories.indexOf(id);
                if (index > -1) {
                    draft.canShowSecure.categories.splice(index, 1);
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
        // it also adds or removes the isSelected bool to the note/cat attached to the config
        updateMenuOverlay(state, action: PayloadAction<MenuOverlay>) {
            return produce(state, (draft) => {
                const newOverlay = action.payload;

                if (newOverlay.isShowing) {
                    switch (newOverlay.menuType) {
                        case "note":
                            const noteToSelect = draft.notes[newOverlay.menuData.noteID];
                            if (noteToSelect) {
                                noteToSelect.isSelected = true;
                            }
                            break;

                        case "subCategory":
                            const subCategoryToSelect = draft.subCategories[newOverlay.menuData.subCategoryID];
                            if (subCategoryToSelect) {
                                subCategoryToSelect.isSelected = true;
                            }
                            break;

                        case "category":
                            const categoryToSelect = draft.categories[newOverlay.menuData.categoryID];
                            if (categoryToSelect) {
                                categoryToSelect.isSelected = true;
                            }
                            break;
                    }
                } else {
                    switch (draft.menuOverlay.menuType) {
                        case "note":
                            const noteToDeSelect = draft.notes[draft.menuOverlay.menuData.noteID];
                            if (noteToDeSelect) {
                                noteToDeSelect.isSelected = false;
                            }
                            break;

                        case "subCategory":
                            const subCategoryToSelect = draft.subCategories[draft.menuOverlay.menuData.subCategoryID];
                            if (subCategoryToSelect) {
                                subCategoryToSelect.isSelected = false;
                            }
                            break;

                        case "category":
                            const categoryToSelect = draft.categories[draft.menuOverlay.menuData.categoryID];
                            if (categoryToSelect) {
                                categoryToSelect.isSelected = false;
                            }
                            break;
                    }
                }

                draft.menuOverlay = newOverlay;
            });
        },

        // updateCategoryList updates the categoryList
        updateCategoryList(state, action: PayloadAction<Ref[]>) {
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
                    isSelected: false,
                    locations: [[categoryID, subCategoryID]],
                    notificationID: "",
                    notificationTime: "",
                };

                draft.notes[noteToAdd.id] = noteToAdd;

                if (!subCategoryID) {
                    draft.categories[categoryID].notes.splice(noteInsertIndex, 0, {
                        id: noteToAdd.id,
                        isSecure: false,
                    });
                } else {
                    draft.subCategories[subCategoryID].notes.splice(noteInsertIndex, 0, {
                        id: noteToAdd.id,
                        isSecure: false,
                    });
                }
            });
        },

        // removeAllNotesFromCategory deletes all the notes from a category
        // If a note exists elsewhere it will have its location updated
        // If it does not exist elsewhere it will be deleted
        // All note refs are removed from category notes list
        removeAllNotesFromCategory(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const categoryID = action.payload;

                const notesInCategory = draft.categories[categoryID].notes;
                notesInCategory.forEach((noteRef) => {
                    const note = draft.notes[noteRef.id];
                    if (note.locations.length > 1) {
                        const locationIndex = note.locations.findIndex((loc) => loc[0] === categoryID);
                        if (locationIndex > -1) {
                            note.locations.splice(locationIndex, 1);
                        }
                    } else {
                        delete draft.notes[noteRef.id];
                    }
                });

                draft.categories[categoryID].notes = [];
            });
        },

        // removeAllNotesFromSubCategory deletes all the notes from a subCtegory
        // If a note exists elsewhere it will have its location updated
        // If it does not exist elsewhere it will be deleted
        // All note refs are removed from subCategory notes list
        removeAllNotesFromSubCategory(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const subCategoryID = action.payload;

                const notesInSubCategory = draft.subCategories[subCategoryID].notes;
                notesInSubCategory.forEach((noteRef) => {
                    const note = draft.notes[noteRef.id];
                    if (note.locations.length > 1) {
                        const locationIndex = note.locations.findIndex((loc) => loc[1] === subCategoryID);
                        if (locationIndex > -1) {
                            note.locations.splice(locationIndex, 1);
                        }
                    } else {
                        delete draft.notes[noteRef.id];
                    }
                });

                draft.subCategories[subCategoryID].notes = [];
            });
        },

        // removeMultiNotesFromCategory deletes all selected notes from a category
        // If a note exists elsewhere it will have its location updated
        // If it does not exist elsewhere it will be deleted
        // The note refs are also removed from the category notes list
        removeMultiNotesFromCategory(state, action: PayloadAction<{ categoryID: string; noteIDs: string[] }>) {
            return produce(state, (draft) => {
                const categoryID = action.payload.categoryID;

                const notesToDelete = action.payload.noteIDs;
                notesToDelete.forEach((noteID) => {
                    const note = draft.notes[noteID];
                    if (note.locations.length > 1) {
                        const locationIndex = note.locations.findIndex((loc) => loc[0] === categoryID);
                        if (locationIndex > -1) {
                            note.locations.splice(locationIndex, 1);
                        }
                    } else {
                        delete draft.notes[noteID];
                    }

                    // remove noteRef from category
                    const category = draft.categories[categoryID];
                    const refIndex = category.notes.findIndex((ref) => ref.id === noteID);
                    if (refIndex > -1) {
                        category.notes.splice(refIndex, 1);
                    }
                });
            });
        },

        // removeMultiNotesFromSubCategory deletes all the notes from a subCategory
        // If a note exists elsewhere it will have its location updated
        // If it does not exist elsewhere it will be deleted
        // The note refs are also removed from the subcategory notes list
        removeMultiNotesFromSubCategory(state, action: PayloadAction<{ subCategoryID: string; noteIDs: string[] }>) {
            return produce(state, (draft) => {
                const subCategoryID = action.payload.subCategoryID;

                const notesToDelete = action.payload.noteIDs;
                notesToDelete.forEach((noteID) => {
                    const note = draft.notes[noteID];
                    if (note.locations.length > 1) {
                        const locationIndex = note.locations.findIndex((loc) => loc[1] === subCategoryID);
                        if (locationIndex > -1) {
                            note.locations.splice(locationIndex, 1);
                        }
                    } else {
                        delete draft.notes[noteID];
                    }

                    // remove noteRef from subcategory
                    const subCategory = draft.subCategories[subCategoryID];
                    const refIndex = subCategory.notes.findIndex((ref) => ref.id === noteID);
                    if (refIndex > -1) {
                        subCategory.notes.splice(refIndex, 1);
                    }
                });
            });
        },

        // deleteCategory completely removes a category.
        // Any notes in the category or its sub categories will be deleted unless they exist in other categories
        // If the notes do exist then their location is updated accordingly
        // Any subcategories inside will be removed from subCategories map
        // The category is deleted and its ID removed from categoryList
        deleteCategory(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const categoryID = action.payload;
                const category = draft.categories[categoryID];

                // delete/update notes if they exist in main category
                const notesInCategory = category.notes;
                notesInCategory.forEach((noteRef) => {
                    const note = draft.notes[noteRef.id];
                    if (note.locations.length > 1) {
                        // exists elsewhere - update locs
                        const locationIndex = note.locations.findIndex((loc) => loc[0] === categoryID);
                        if (locationIndex > -1) {
                            note.locations.splice(locationIndex, 1);
                        }
                    } else {
                        delete draft.notes[noteRef.id];
                    }
                });

                // delete/update notes if they exist in a subcategory
                const subCatsInCategory = category.subCategories;
                subCatsInCategory.forEach((subCatRef) => {
                    const subCategory = draft.subCategories[subCatRef.id];
                    const notesInSubCategory = subCategory.notes;
                    notesInSubCategory.forEach((noteRef) => {
                        const note = draft.notes[noteRef.id];
                        if (note) {
                            // may have been deleted on prev loop
                            if (note.locations.some((loc) => loc[0] !== categoryID)) {
                                // exists elsewhere - update locs
                                const locationIndex = note.locations.findIndex((loc) => loc[1] === subCatRef.id);
                                if (locationIndex > -1) {
                                    note.locations.splice(locationIndex, 1);
                                }
                            } else {
                                delete draft.notes[noteRef.id];
                            }
                        }
                    });
                });

                // delete subCategorys
                subCatsInCategory.forEach((subCatRef) => {
                    delete draft.subCategories[subCatRef.id];
                });

                // delete category
                delete draft.categories[categoryID];

                // remove category from list
                const categoryIndex = draft.categoryList.findIndex((catRef) => catRef.id === categoryID);
                draft.categoryList.splice(categoryIndex, 1);
            });
        },

        // deleteSubCategory completely removes a subCategory.
        // Any notes in the subCategory will be deleted unless they exist in other categories
        // If the notes do exist then their location is updated accordingly
        // The subcategory is deleted and its ID removed from the category subcategories list
        deleteSubCategory(state, action: PayloadAction<{ subCategoryID: string; parentCategoryID: string }>) {
            return produce(state, (draft) => {
                const { parentCategoryID, subCategoryID } = action.payload;

                // delete notes
                const subCategory = draft.subCategories[subCategoryID];
                const notesInSubCategory = subCategory.notes;
                notesInSubCategory.forEach((noteRef) => {
                    const note = draft.notes[noteRef.id];
                    if (note.locations.length > 1) {
                        // exists elsewhere - update locs
                        const locationIndex = note.locations.findIndex((loc) => loc[1] === subCategoryID);
                        if (locationIndex > -1) {
                            note.locations.splice(locationIndex, 1);
                        }
                    } else {
                        delete draft.notes[noteRef.id];
                    }
                });

                // delete subCategory
                delete draft.subCategories[subCategoryID];

                // remove subCategory from parent category list
                const parentCategory = draft.categories[parentCategoryID];
                const index = parentCategory.subCategories.findIndex((subCatRef) => subCatRef.id === subCategoryID);
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

        // updateCategory updates a single category
        // same as updateCategory but does not update the metadata
        updateCategorySilently(state, action: PayloadAction<Category>) {
            const categoryCopy = action.payload;
            const categoriesCopy = { ...state.categories };
            if (categoriesCopy[categoryCopy.id]) {
                categoriesCopy[categoryCopy.id] = { ...categoryCopy };
            }

            return { ...state, categories: categoriesCopy };
        },

        // removeNoteFromSubCategory removes a note from a subcategory
        // it removes the noteRef from the subCategory notes
        // and updates the notes locations to remove the subCategory
        // if the note exists in the dontforgetmestate and the subcategory matches this id then it updates the location
        // to one of the other categories instead (first one it finds)
        removeNoteFromSubCategory(state, action: PayloadAction<IDs>) {
            return produce(state, (draft) => {
                const { subCategoryID, noteID } = action.payload;
                const note = draft.notes[noteID];

                const subCategory = draft.subCategories[subCategoryID];
                const noteIndex = subCategory.notes.findIndex((noteRef) => noteRef.id === noteID);
                if (noteIndex > -1) {
                    // will always but still got error protection
                    subCategory.notes.splice(noteIndex, 1);
                    // now update locations
                    const note = draft.notes[noteID];
                    const locationIndex = note.locations.findIndex((loc) => loc[1] === subCategoryID);
                    if (locationIndex > -1) {
                        note.locations.splice(locationIndex, 1);
                    }
                }

                const dontForgetMeRef = draft.dontForgetMe[noteID];
                if (dontForgetMeRef) {
                    if (dontForgetMeRef.location[1] === subCategoryID) {
                        // need to find a new home
                        dontForgetMeRef.location = note.locations[0];
                    }
                }
            });
        },

        // removeNoteFromCategory removes a note from a main Category
        // it removes the noteRef from the Category notes
        // and updates the notes locations to remove the Category
        // if the note exists in the dontforgetmestate and the subcategory matches this id then it updates the location
        // to one of the other categories instead (first one it finds)
        // if the note is being removed from the remindersCategory
        // then it also cancels the notification and removes the reminder time from the note
        removeNoteFromCategory(state, action: PayloadAction<IDs>) {
            return produce(state, (draft) => {
                const { categoryID, noteID } = action.payload;
                const category = draft.categories[categoryID];
                const note = draft.notes[noteID];
                const noteIndex = category.notes.findIndex((noteRef) => noteRef.id === noteID);
                if (noteIndex > -1) {
                    // will always but still got error protection
                    category.notes.splice(noteIndex, 1);
                    // now update locations
                    const locationIndex = note.locations.findIndex((loc) => loc[0] === categoryID);
                    if (locationIndex > -1) {
                        note.locations.splice(locationIndex, 1);
                    }
                }

                const dontForgetMeRef = draft.dontForgetMe[noteID];
                if (dontForgetMeRef) {
                    if (dontForgetMeRef.location[0] === categoryID) {
                        // need to find a new home
                        dontForgetMeRef.location = note.locations[0];
                    }
                }

                if (categoryID === reminderID) {
                    cancelNotification(note.notificationID);
                    note.notificationID = "";
                    note.notificationTime = "";
                }
            });
        },

        // addNoteToSUbCategory adds a single note to a subCategory
        // it adds the note ref into the subCategory notes
        // and adds the subCategory location to the note
        addNoteToSubCategory(state, action: PayloadAction<IDs>) {
            return produce(state, (draft) => {
                const { subCategoryID, categoryID, noteID } = action.payload;
                const subCategory = draft.subCategories[subCategoryID];
                const note = draft.notes[noteID];
                subCategory.notes.push({ id: noteID, isSecure: note.isSecureNote });
                note.locations.push([categoryID, subCategoryID]);
            });
        },

        // addNoteToCategory adds a single note to a Category
        // it adds the note ref into the Category notes
        // and adds the Category location to the note
        addNoteToCategory(state, action: PayloadAction<IDs>) {
            return produce(state, (draft) => {
                const { categoryID, noteID } = action.payload;
                const category = draft.categories[categoryID];
                const note = draft.notes[noteID];
                category.notes.push({ id: noteID, isSecure: note.isSecureNote });
                note.locations.push([categoryID, ""]);
            });
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

        // updateSubCategorySilently updates a single subCategory
        // same as updateSUbCategory but does not update the metadata
        updateSubCategorySilently(state, action: PayloadAction<SubCategory>) {
            const subCategoryCopy = action.payload;
            const subCategoryId = subCategoryCopy.id;

            const subCategoriesCopy = { ...state.subCategories };

            if (subCategoriesCopy[subCategoryId]) {
                subCategoriesCopy[subCategoryId] = { ...subCategoryCopy };
            }

            return { ...state, subCategories: subCategoriesCopy };
        },

        // TODO - SHOULD DELETENOTE CHECK SECURENOTE STATE?!?!

        // deleteNote deletes a note from all categories.
        // It removes the note from notes and removes it's noteRef from any category/subcategory note lists
        // Also removes its dontforgetme ref from state if it has one
        // also removes push notification if it has one
        deleteNote(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const noteID = action.payload;
                const note = draft.notes[noteID];
                note.locations.forEach((location) => {
                    if (location[1]) {
                        const subCategory = draft.subCategories[location[1]];
                        const noteIndex = subCategory.notes.findIndex((noteRef) => {
                            return noteRef.id === noteID;
                        });
                        subCategory.notes.splice(noteIndex, 1);

                        return;
                    }

                    const category = draft.categories[location[0]];
                    const noteIndex = category.notes.findIndex((noteRef) => {
                        return noteRef.id === noteID;
                    });
                    category.notes.splice(noteIndex, 1);
                });
                if (draft.dontForgetMe[noteID]) {
                    delete draft.dontForgetMe[noteID];
                }

                if (note.notificationID) {
                    cancelNotification(note.notificationID);
                }
                delete draft.notes[noteID]; // TODO - SHouldnt this delete happen outside the loop?
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
                    location: [parentCategoryID, ""],
                    isSecure: false,
                    isSelected: false,
                };

                const parentCategory = draft.categories[parentCategoryID];
                parentCategory.dateUpdated = new Date().toISOString();
                parentCategory.lastUpdatedBy = Device.deviceName ? Device.deviceName : "Annoymous";

                parentCategory.subCategories.push({ id: newSubCategory.id, isSecure: false });

                // moves any existing notes from parentCat to new subCat
                // ensures all locations are updated too
                if (parentCategory.notes.length > 0) {
                    newSubCategory.notes = parentCategory.notes;
                    parentCategory.notes = [];

                    newSubCategory.notes.forEach((noteRef) => {
                        // go to the note in notes.
                        // if just one location its simple: add the subcat id
                        // if more than one lcation ten find the index where
                        // parent cat matches [0] and add the subcat id
                        const note = draft.notes[noteRef.id];
                        const locationIndex = note.locations.findIndex((loc) => loc[0] === parentCategoryID);
                        if (locationIndex > -1) {
                            // should always be, but shuld handle properly if not
                            note.locations[locationIndex][1] = newSubCategory.id;
                        }
                    });
                }

                draft.subCategories[newSubCategory.id] = newSubCategory;
            });
        },

        // addCategory creates a new category and adds its ID to the categoryList
        addCategory(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const categoryName = action.payload;
                const newCategory: Category = {
                    id: categoryName !== "Reminders" ? getRandomID() : reminderID,
                    name: action.payload,
                    notes: [],
                    subCategories: [],
                    dateAdded: new Date().toISOString(),
                    dateUpdated: "",
                    createdBy: Device.deviceName ? Device.deviceName : "Annoynmous",
                    lastUpdatedBy: "",
                    isSecure: false,
                    isSelected: false,
                };

                draft.categories[newCategory.id] = newCategory;
                draft.categoryList.push({ id: newCategory.id, isSecure: false });
            });
        },

        // updateNote updates a single note
        // it takes a Note in it updated form and replaces in memory
        // also updated lastUpdate metadata
        updateNote(state, action: PayloadAction<Note>) {
            const newNote = action.payload;

            newNote.dateUpdated = new Date().toISOString();
            newNote.lastUpdatedBy = Device.deviceName ? Device.deviceName : "Annoymous";

            const newNotes = { ...state.notes };
            newNotes[newNote.id] = newNote;
            return { ...state, notes: newNotes };
        },

        // updateNoteSilently updates a single note
        // exactly the same as updateDate except it doesnt amend the lastUpdatedBy metadata
        updateNoteSilently(state, action: PayloadAction<Note>) {
            const newNote = action.payload;

            const newNotes = { ...state.notes };
            newNotes[newNote.id] = newNote;
            return { ...state, notes: newNotes };
        },

        // updateNote secure status toggles whether a note is secure or not.
        // it will update the noteRef in all its locations
        updateNoteSecureStatus(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const noteID = action.payload;
                const note = draft.notes[noteID];
                note.dateUpdated = new Date().toISOString();
                note.lastUpdatedBy = Device.deviceName ? Device.deviceName : "Annoymous";
                note.isSecureNote = !note.isSecureNote;
                note.locations.forEach((location) => {
                    if (location[1]) {
                        const subCategory = draft.subCategories[location[1]];
                        const noteRefIndex = subCategory.notes.findIndex((noteRef) => noteRef.id === noteID);
                        subCategory.notes[noteRefIndex].isSecure = note.isSecureNote;
                    } else {
                        const category = draft.categories[location[0]];
                        const noteRefIndex = category.notes.findIndex((noteRef) => noteRef.id === noteID);
                        category.notes[noteRefIndex].isSecure = note.isSecureNote;
                    }
                });
            });
        },

        // updateCategorySecureStatus toggles wherer a category is secure or not
        // it will update the catRef in the categoryList
        updateCategorySecureStatus(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const categoryID = action.payload;
                const category = draft.categories[categoryID];
                category.isSecure = !category.isSecure;
                category.dateUpdated = new Date().toISOString();
                category.lastUpdatedBy = Device.deviceName ? Device.deviceName : "Annoymous";
                const categoryIndex = draft.categoryList.findIndex((catRef) => catRef.id === categoryID);
                draft.categoryList[categoryIndex].isSecure = category.isSecure;
            });
        },

        // updateSubCategorySecureStatus toggles wherer a category is secure or not
        // it will update the catRef in the parent category subCategoryList
        updateSubCategorySecureStatus(state, action: PayloadAction<string>) {
            return produce(state, (draft) => {
                const subCategoryID = action.payload;
                const subCategory = draft.subCategories[subCategoryID];
                subCategory.isSecure = !subCategory.isSecure;
                subCategory.dateUpdated = new Date().toISOString();
                subCategory.lastUpdatedBy = Device.deviceName ? Device.deviceName : "Annoymous";
                const parentCategory = draft.categories[subCategory.location[0]];
                const subCategoryIndex = parentCategory.subCategories.findIndex(
                    (catRef) => catRef.id === subCategoryID
                );
                parentCategory.subCategories[subCategoryIndex].isSecure = subCategory.isSecure;
            });
        },

        toggleHomeScreenShowingSecureCategories(state, action: PayloadAction) {
            return produce(state, (draft) => {
                draft.canShowSecure.homeScreen = !draft.canShowSecure.homeScreen;
            });
        },

        setSubtleMessage(state, action: PayloadAction<SubtleMessage>) {
            return produce(state, (draft) => {
                const { message, timeOut } = action.payload;
                draft.subtleMessage = {
                    message: message,
                    timeOut: timeOut,
                };
            });
        },

        // updateMemoryFromBackup replaces categories, subcategories, notes and categoryList
        // with data received from an imported json file
        updateMemoryFromBackup(state, action: PayloadAction<Memory>) {
            return produce(state, (draft) => {
                if (action.payload) {
                    draft.categoryList = action.payload.categoryList;
                    draft.categories = action.payload.categories;
                    draft.subCategories = action.payload.subCategories;
                    draft.notes = action.payload.notes;
                } else {
                    console.error("memory not defined in updateMemoryFromBackup");
                }
            });
        },

        // addDontForgetMe adds a new ref into thge dontForgetMe state
        // if passed a config with empty date then it removes it from dontForgetMeState
        // if the note already exists in the state then it will be updated with the new date / config
        // the location in the config is the location of the note that set the reminder
        // this is unused for now to avoid complications when moving notes between categories
        // for now all copies of the note will show the reminder if one is set
        addDontForgetMe(state, action: PayloadAction<DontForgetMeConfig>) {
            return produce(state, (draft) => {
                const { noteID, categoryID, subCategoryID, date } = action.payload;

                if (date) {
                    draft.dontForgetMe[noteID] = {
                        location: [categoryID, subCategoryID],
                        date: date,
                    };
                } else {
                    if (draft.dontForgetMe[noteID]) {
                        delete draft.dontForgetMe[noteID];
                    }
                }
            });
        },

        migrateData(state, action: PayloadAction) {
            // return produce(state, (draft) => {
            //     // add dontForgetMeArray to each category
            //     Object.keys(draft.categories).forEach((key) => {
            //         const category = draft.categories[key];
            //         category.dontForgetMe = [];
            //     });
            //     // add dontForgetMeArray to each subCategory
            //     Object.keys(draft.subCategories).forEach((key) => {
            //         const subCategory = draft.subCategories[key];
            //         subCategory.dontForgetMe = [];
            //     });
            // });
        },

        // TODO - DO WE NEED BOTH SUBLTE MSG DISPATCH METHODS?

        // closeOverlayAndSetSublteMessage sets a new subtle message and checks if the overlay is open
        // if the overlay is open it removes the selected item property from the relevant item
        // and sets a new empty overlay to close it
        closeOverlayAndSetSubtleMessage(state, action: PayloadAction<SubtleMessage>) {
            return produce(state, (draft) => {
                if (draft.menuOverlay.isShowing) {
                    switch (draft.menuOverlay.menuType) {
                        case "note":
                            const noteToDeSelect = draft.notes[draft.menuOverlay.menuData.noteID];
                            if (noteToDeSelect) {
                                noteToDeSelect.isSelected = false;
                            }
                            break;

                        case "subCategory":
                            const subCategoryToSelect = draft.subCategories[draft.menuOverlay.menuData.subCategoryID];
                            if (subCategoryToSelect) {
                                subCategoryToSelect.isSelected = false;
                            }
                            break;

                        case "category":
                            const categoryToSelect = draft.categories[draft.menuOverlay.menuData.categoryID];
                            if (categoryToSelect) {
                                categoryToSelect.isSelected = false;
                            }
                            break;
                    }

                    draft.menuOverlay = getEmptyOverlay();
                }

                const { message, timeOut } = action.payload;
                draft.subtleMessage = {
                    message: message,
                    timeOut: timeOut,
                };
            });
        },

        // scrollToCategory calculates and sets the offset value
        // if the index passed is -1 then set the offset to -1
        scrollToCategory(state, action: PayloadAction<number>) {
            return produce(state, (draft) => {
                const categoryIndex = action.payload;
                if (categoryIndex === -1) {
                    draft.scrollToOffset = -1;
                    return;
                }
                let offset = 0;
                if (categoryIndex != null && categoryIndex >= 0) {
                    for (let i = 0; i < categoryIndex; i++) {
                        if (draft.heightData[i]) {
                            offset += draft.heightData[i].catHeight;
                        }
                    }
                }
                draft.scrollToOffset = offset;
            });
        },

        // NOT TESTED OR USED YET
        // - tbf pretty sure works as a scroll. Issue was that
        // opening a category to then scroll to it didnt work as the
        // heightdata hadnt been populated yet. Leaving in ehre anyway.
        scrollToSubCategory(
            state,
            action: PayloadAction<{
                subCategoryIndex: number;
                parentCategoryIndex: number;
                parentCategoryId: string;
            }>
        ) {
            return produce(state, (draft) => {
                let offset = 0;
                const { parentCategoryIndex, subCategoryIndex, parentCategoryId } = action.payload;
                const category = draft.categories[parentCategoryId];

                if (subCategoryIndex === -1) {
                    draft.scrollToOffset = -1;
                    return;
                }
                const categoryIndex = parentCategoryIndex;
                if (categoryIndex != undefined && categoryIndex >= 0) {
                    for (let i = 0; i <= categoryIndex; i++) {
                        if (draft.heightData[i]) {
                            offset += draft.heightData[i].catHeight;
                        }
                    }
                    if (subCategoryIndex != undefined && subCategoryIndex >= 0) {
                        const numOfSubs = category.subCategories.length;
                        for (let j = subCategoryIndex; j < numOfSubs; j++) {
                            if (draft.heightData[categoryIndex]) {
                                if (draft.heightData[categoryIndex].subHeights[j]) {
                                    offset -= draft.heightData[categoryIndex].subHeights[j].subHeight;
                                }
                            }
                        }
                    }
                }
                draft.scrollToOffset = offset;
            });
        },

        // NOT TESTED OR USED YET, PUTTING HERE FOR POSTERITY
        scrollToNote(
            state,
            action: PayloadAction<{
                noteIndex: number;
                subCategoryIndex: number;
                categoryIndex: number;
                parentCategoryId: string;
                subCategoryId: string;
            }>
        ) {
            return produce(state, (draft) => {
                const { noteIndex, categoryIndex, subCategoryIndex, parentCategoryId, subCategoryId } = action.payload;
                if (noteIndex === -1) {
                    draft.scrollToOffset = -1;
                    return;
                }
                let offset = 0;
                const category = draft.categories[parentCategoryId];
                const subCategory = draft.subCategories[subCategoryId];
                // to scroll to offset for all cats up to and inc this one
                // if there are subcats
                // then subtract the subcts below and any notes in the sub cat we're in below... (done)

                // if there are not subcats then just subtract the notes below...
                if (categoryIndex != null && categoryIndex >= 0) {
                    for (let i = 0; i <= categoryIndex; i++) {
                        if (draft.heightData[i]) {
                            offset += draft.heightData[i].catHeight;
                        }
                    }
                    if (subCategoryIndex != null && subCategoryIndex >= 0) {
                        const numOfSubs = category.subCategories.length;
                        for (let j = subCategoryIndex + 1; j < numOfSubs; j++) {
                            if (draft.heightData[categoryIndex]) {
                                if (draft.heightData[categoryIndex].subHeights[j]) {
                                    offset -= draft.heightData[categoryIndex].subHeights[j].subHeight;
                                }
                            }
                        }

                        if (noteIndex != null && noteIndex >= 0) {
                            const numOfNotes = subCategory.notes.length;
                            for (let k = noteIndex; k < numOfNotes; k++) {
                                if (draft.heightData[categoryIndex]) {
                                    if (draft.heightData[categoryIndex].subHeights[subCategoryIndex]) {
                                        if (
                                            draft.heightData[categoryIndex].subHeights[subCategoryIndex].noteHeights[k]
                                        ) {
                                            offset -=
                                                draft.heightData[categoryIndex].subHeights[subCategoryIndex]
                                                    .noteHeights[k];
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (noteIndex != null && noteIndex >= 0) {
                            const numOfNotes = category.notes.length;
                            for (let k = noteIndex; k < numOfNotes; k++) {
                                if (draft.heightData[categoryIndex]) {
                                    offset -= draft.heightData[categoryIndex].noteHeights[k];
                                }
                            }
                        }
                    }
                }
                draft.scrollToOffset = offset;
            });
        },
    },
});

const cancelNotification = async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
};

export const {
    scrollToSubCategory,
    scrollToCategory,
    addDontForgetMe,
    migrateData,
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
    removeNoteFromSubCategory,
    addNoteToSubCategory,
    addNoteToCategory,
    removeNoteFromCategory,
    updateNoteSecureStatus,
    updateMemoryFromBackup,
    updateCategorySecureStatus,
    updateSubCategorySecureStatus,
    toggleHomeScreenShowingSecureCategories,
    updateCategorySilently,
    updateNoteSilently,
    updateSubCategorySilently,
    setSubtleMessage,
    closeOverlayAndSetSubtleMessage,
    removeMultiNotesFromCategory,
    removeMultiNotesFromSubCategory,
} = notesSlice.actions;

export default notesSlice.reducer;

import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { getRandomID } from "../memoryfunctions/memoryfunctions";
import { SubHeight } from "../types";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
export const useAppDispatch = () => useDispatch<AppDispatch>();
