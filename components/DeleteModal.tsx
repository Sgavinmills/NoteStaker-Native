import { Button, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import modalStyles from "../styles/modalStyles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getRandomID } from "../memoryfunctions/memoryfunctions";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import {
    addCategory,
    addSubCategory,
    deleteNoteFromAllCategories,
    updateMenuOverlay,
    updateSubCategory,
} from "../redux/slice";
import { Category, MenuOverlay, SubCategory } from "../types";
import { AppDispatch } from "../redux/store/store";
import { updateCategory } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
interface TileProps {
    setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    deleteModalVisible: boolean;
    deleteInfo: {
        dataType: string;
        id: string;
        deleteMessage: string;
    };
    deleteCategory?: (() => void) | null; // later when this has been refactored we wont need to pass it in. shpould just call  memory/util func with cat id.
}

// TODO  repurpose this as ConfirmModal ? See if can reuse for 'rmove all notes from categoris' first.

// TODO - reffactor reducers and util funcs so dont need to pass in delete function to here and then check for its existence etc. Should be able to just call
// relevasnt util func and then dispatch.

const DeleteModal: React.FC<TileProps> = ({
    setDeleteModalVisible,
    deleteModalVisible,
    deleteInfo,
    deleteCategory,
}) => {
    const memory = useSelector((state: RootState) => state.memory);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);

    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = () => {
        const id = deleteInfo.id;
        console.log(deleteInfo.dataType);
        switch (deleteInfo.dataType) {
            case "note":
                dispatch(deleteNoteFromAllCategories(id));
                break;
            case "category":
            case "subCategory": {
                if (deleteCategory) deleteCategory();
                console.log(deleteCategory);
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
