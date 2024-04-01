import { Button, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import modalStyles from "../styles/modalStyles";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import {
    deleteNoteFromAllCategories,
    updateCategories,
    updateCategoryList,
    updateMenuOverlay,
    updateNote,
    updateNotes,
    updateSubCategories,
    updateSubCategory,
} from "../redux/slice";
import { DeleteInfo, Note } from "../types";
import { AppDispatch } from "../redux/store/store";
import { updateCategory } from "../redux/slice";
import { getEmptyOverlay, noteExistsInOtherCategories } from "../utilFuncs/utilFuncs";
interface TileProps {
    setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    deleteModalVisible: boolean;
    deleteInfo: DeleteInfo;
    note?: Note; // need this cos dleteing photos doesnt have menuOverlay
    setCallingComponentVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO  repurpose this as ConfirmModal ? See if can reuse for 'rmove all notes from categoris' first.

// TODO - reffactor reducers and util funcs so dont need to have full delete funcs etc. Should be able to just call
// relevasnt util func and then dispatch.

const DeleteModal: React.FC<TileProps> = ({
    setDeleteModalVisible,
    deleteModalVisible,
    deleteInfo,
    note,
    setCallingComponentVisible,
}) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const memory = useSelector((state: RootState) => state.memory);
    const dispatch = useDispatch<AppDispatch>();

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

    const removeAllNotes = () => {
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

    const deleteImage = () => {
        if (note) {
            if (setCallingComponentVisible) {
                setCallingComponentVisible(false);
            }
            if (note.note === "") {
                dispatch(deleteNoteFromAllCategories(note.id));
                return;
            }

            const noteCopy = { ...note };
            dispatch(updateNote({ ...noteCopy, imageURI: "" }));
        }
    };

    const handleDelete = () => {
        switch (deleteInfo.deleteType) {
            case "deleteNote": {
                dispatch(deleteNoteFromAllCategories(overlay.menuData.noteID));
                break;
            }
            case "deleteCategory": {
                deleteCategory();
                break;
            }
            case "removeAll": {
                removeAllNotes();
                break;
            }
            case "deleteImage": {
                deleteImage();
                break;
            }
        }
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={deleteModalVisible}
            onRequestClose={() => {
                setDeleteModalVisible(false);
            }}
        >
            <View style={modalStyles.modalContainer}>
                <TouchableOpacity
                    style={modalStyles.modalCloseCategoryIconContainer}
                    onPress={() => {
                        setDeleteModalVisible(false);
                    }}
                >
                    <Text style={modalStyles.newCategoryModalIconText}>&minus;</Text>
                </TouchableOpacity>
                <View style={modalStyles.modalTextInputContainer}>
                    <Text style={modalStyles.text}>{deleteInfo.deleteMessage}</Text>
                    <View style={modalStyles.deleteButtonContainer}>
                        <View style={modalStyles.deleteButton}>
                            <Button title="Delete" onPress={handleDelete} />
                        </View>
                        <View style={modalStyles.deleteButton}>
                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setDeleteModalVisible(false);
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DeleteModal;
