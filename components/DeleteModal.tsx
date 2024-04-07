import { Button, Modal, Text, TouchableOpacity, View } from "react-native";
import modalStyles from "../styles/modalStyles";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import {
    deleteCategory,
    deleteNote,
    deleteSubCategory,
    removeAllNotesFromCategory,
    removeAllNotesFromSubCategory,
    updateMenuOverlay,
    updateNote,
} from "../redux/slice";
import { DeleteInfo, Note } from "../types";
import { AppDispatch } from "../redux/store/store";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
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
    const dispatch = useDispatch<AppDispatch>();

    const deleteCat = () => {
        if (overlay.menuType === "category") {
            dispatch(deleteCategory(overlay.menuData.categoryID));
        }

        if (overlay.menuType === "subCategory") {
            const deleteInfo = {
                subCategoryID: overlay.menuData.subCategoryID,
                parentCategoryID: overlay.menuData.categoryID,
            };
            dispatch(deleteSubCategory(deleteInfo));
        }
        dispatch(updateMenuOverlay(getEmptyOverlay()));
    };

    const removeAllNotes = () => {
        if (overlay.menuType === "category") {
            dispatch(removeAllNotesFromCategory(overlay.menuData.categoryID));
        }

        if (overlay.menuType === "subCategory") {
            dispatch(removeAllNotesFromSubCategory(overlay.menuData.subCategoryID));
        }
        dispatch(updateMenuOverlay(getEmptyOverlay()));
    };

    const deleteImage = () => {
        if (note) {
            if (setCallingComponentVisible) {
                setCallingComponentVisible(false);
            }
            if (note.note === "") {
                dispatch(deleteNote(note.id));
                return;
            }

            const noteCopy = { ...note };
            dispatch(updateNote({ ...noteCopy, imageURI: "" }));
        }
    };

    const handleDelete = () => {
        switch (deleteInfo.deleteType) {
            case "deleteNote": {
                dispatch(deleteNote(overlay.menuData.noteID));
                dispatch(updateMenuOverlay(getEmptyOverlay()));
                break;
            }
            case "deleteCategory": {
                deleteCat();
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
