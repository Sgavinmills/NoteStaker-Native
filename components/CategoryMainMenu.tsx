import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { AppDispatch } from "../redux/store/store";
import CategoryModal from "./CategoryModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import {
    updateCategories,
    updateCategory,
    updateCategoryList,
    updateMenuOverlay,
    updateNotes,
    updateSubCategories,
    updateSubCategory,
} from "../redux/slice";
import { getEmptyOverlay, noteExistsInOtherCategories } from "../utilFuncs/utilFuncs";

interface TileProps {
    setIsMoveArrows: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCategoryMainMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

// CategoryMainMenu provides main menu for parent categories and sub categories
const CategoryMainMenu: React.FC<TileProps> = ({ setIsMoveArrows, setIsCategoryMainMenu }) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const memory = useSelector((state: RootState) => state.memory);
    const [catModalInfo, setCatModalInfo] = useState({ currentName: "", parentCat: "" });
    const catName = overlay.menuType === "category" ? "category" : "sub-category";
    const dispatch = useDispatch<AppDispatch>();

    const handleEditName = () => {
        setCatModalInfo({
            currentName: getNameOfMenu(),
            parentCat: overlay.menuType === "subCategory" ? overlay.menuData.categoryID : "",
        });
        setIsCategoryModal(true);
    };

    const getNameOfMenu = () => {
        if (overlay.menuType === "category") {
            return memory.categories[overlay.menuData.categoryID].name;
        }

        if (overlay.menuType === "subCategory") {
            return memory.subCategories[overlay.menuData.subCategoryID].name;
        }

        return "";
    };

    const handleMoveCategory = () => {
        setIsMoveArrows(true);
        setIsCategoryMainMenu(false);
    };

    const handleAddSubCat = () => {
        setCatModalInfo({ currentName: "", parentCat: overlay.menuData.categoryID });
        setIsCategoryModal(true);
    };

    const handleRemoveAllNotes = () => {
        if (overlay.menuType === "category") {
            const categoryCopy = { ...memory.categories[overlay.menuData.categoryID] };
            const notesToDel = categoryCopy.notes;

            const memoryNotesCopy = { ...memory.notes };
            notesToDel.forEach((noteID) => {
                if (
                    !noteExistsInOtherCategories(
                        memory.categories,
                        memory.subCategories,
                        noteID,
                        overlay.menuData.categoryID,
                        []
                    )
                ) {
                    delete memoryNotesCopy[noteID];
                }
            });

            categoryCopy.notes = [];
            dispatch(updateCategory(categoryCopy));
            dispatch(updateNotes(memoryNotesCopy));
        }

        if (overlay.menuType === "subCategory") {
            const subCategoryCopy = { ...memory.subCategories[overlay.menuData.subCategoryID] };
            const notesToDel = subCategoryCopy.notes;

            const memoryNotesCopy = { ...memory.notes };
            notesToDel.forEach((noteID) => {
                if (
                    !noteExistsInOtherCategories(memory.categories, memory.subCategories, noteID, null, [
                        overlay.menuData.subCategoryID,
                    ])
                ) {
                    delete memoryNotesCopy[noteID];
                }
            });

            subCategoryCopy.notes = [];
            dispatch(updateSubCategory(subCategoryCopy));
            dispatch(updateNotes(memoryNotesCopy));
        }
        dispatch(updateMenuOverlay(getEmptyOverlay()));
    };

    // deleteCategory deletes the category. It also deletes the subcategories. Any notes in the category or subcategories
    // that dont exist elsewhere are also deleted.
    const deleteCategory = () => {
        // when refactor make one copy at start, THAT DOES NOT GET MUTATED and use that throughout rather than accesing
        // the memory state repeatedly. Presumavbly quicker.
        if (overlay.menuType === "category") {
            // delete notes if they dont exist elsewhere

            const notesInCatToDel = memory.categories[overlay.menuData.categoryID].notes;

            const memoryNotesCopy = { ...memory.notes };
            if (notesInCatToDel.length > 0) {
                notesInCatToDel.forEach((noteID) => {
                    if (
                        !noteExistsInOtherCategories(
                            memory.categories,
                            memory.subCategories,
                            noteID,
                            overlay.menuData.categoryID,
                            []
                        )
                    ) {
                        delete memoryNotesCopy[noteID];
                    }
                });
            }

            const subCatsInCatToDel = memory.categories[overlay.menuData.categoryID].subCategories;
            //check subcats for more notes to del if necc
            // fro each subcat it checks the notes array and checks each note to see if it exists
            // elsewheere (except in a sub cat in the same cat) and if it does not exist the note is deleted
            if (subCatsInCatToDel.length > 0) {
                subCatsInCatToDel.forEach((subCatID) => {
                    const notesInSubCatToDel = memory.subCategories[subCatID].notes;
                    notesInSubCatToDel.forEach((noteID) => {
                        if (
                            !noteExistsInOtherCategories(
                                memory.categories,
                                memory.subCategories,
                                noteID,
                                overlay.menuData.categoryID,
                                subCatsInCatToDel // need the sub cats in here
                            )
                        ) {
                            delete memoryNotesCopy[noteID]; // need check for existnce befoe del?
                        }
                    });
                });
            }

            // delete subcars
            const memorySubCatsCopy = { ...memory.subCategories };
            subCatsInCatToDel.forEach((subCatID) => {
                delete memorySubCatsCopy[subCatID];
            });

            const memoryCatsCopy = { ...memory.categories };
            delete memoryCatsCopy[overlay.menuData.categoryID];

            const categoryListCopy = [...memory.categoryList];
            const catIndex = categoryListCopy.indexOf(overlay.menuData.categoryID);
            categoryListCopy.splice(catIndex, 1);

            dispatch(updateCategoryList(categoryListCopy));
            dispatch(updateCategories(memoryCatsCopy));

            dispatch(updateNotes(memoryNotesCopy));

            if (subCatsInCatToDel.length > 0) {
                dispatch(updateSubCategories(memorySubCatsCopy));
            }
        }

        if (overlay.menuType === "subCategory") {
            const notesInCatToDel = memory.subCategories[overlay.menuData.subCategoryID].notes;

            const memoryNotesCopy = { ...memory.notes };
            notesInCatToDel.forEach((noteID) => {
                if (
                    !noteExistsInOtherCategories(memory.categories, memory.subCategories, noteID, null, [
                        overlay.menuData.subCategoryID,
                    ])
                ) {
                    delete memoryNotesCopy[noteID];
                }
            });

            const memorySubCatsCopy = { ...memory.subCategories };
            delete memorySubCatsCopy[overlay.menuData.subCategoryID];

            const parentCatCopy = { ...memory.categories[overlay.menuData.categoryID] };
            const parentCatSubCats = [...parentCatCopy.subCategories];

            const catIndex = parentCatSubCats.indexOf(overlay.menuData.subCategoryID);
            parentCatSubCats.splice(catIndex, 1);

            parentCatCopy.subCategories = parentCatSubCats;

            dispatch(updateCategory(parentCatCopy));
            dispatch(updateSubCategories(memorySubCatsCopy));
            dispatch(updateNotes(memoryNotesCopy));
        }
        dispatch(updateMenuOverlay(getEmptyOverlay()));
    };

    const [isCategoryModal, setIsCategoryModal] = useState(false);
    return (
        <>
            {overlay.menuType === "category" && (
                <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAddSubCat}>
                    <FontAwesome name="plus" style={menuOverlayStyles.icons} />
                    <Text style={menuOverlayStyles.text}>Add Sub-Category</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleEditName}>
                <FontAwesome name="edit" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Edit {catName} name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMoveCategory}>
                <Entypo name="select-arrows" style={[menuOverlayStyles.icons]} />
                <Text style={menuOverlayStyles.text}>Move {catName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleRemoveAllNotes}>
                <FontAwesome name="trash" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Remove all notes from {catName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={deleteCategory}>
                <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                <Text style={menuOverlayStyles.text}>Delete {catName}</Text>
            </TouchableOpacity>

            {isCategoryModal && (
                <CategoryModal
                    newCatModalVisible={isCategoryModal}
                    setNewCatModalVisible={setIsCategoryModal}
                    catInfo={catModalInfo}
                />
            )}
        </>
    );
};

export default CategoryMainMenu;
