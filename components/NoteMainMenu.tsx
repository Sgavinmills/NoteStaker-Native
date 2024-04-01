import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { AppDispatch } from "../redux/store/store";
import CategoryModal from "./CategoryModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import * as ImagePicker from "expo-image-picker";
import { deleteNoteFromAllCategories, updateMenuOverlay, updateNote } from "../redux/slice";
import { getEmptyOverlay, noteExistsInOtherCategories } from "../utilFuncs/utilFuncs";
import DeleteModal from "./DeleteModal";
import { DeleteInfo } from "../types";

interface TileProps {
    setIsMoveArrows: React.Dispatch<React.SetStateAction<boolean>>;
    setIsNoteMainMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAdjustingCategories: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoteMainMenu: React.FC<TileProps> = ({ setIsMoveArrows, setIsNoteMainMenu, setIsAdjustingCategories }) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const memory = useSelector((state: RootState) => state.memory);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo>({ deleteType: "", deleteMessage: "" });

    const handleMoveNote = () => {
        setIsMoveArrows(true);
        setIsNoteMainMenu(false);
    };

    const handleCameraPress = (event: GestureResponderEvent) => {
        pickImage();
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (memory.menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
        }

        if (!result.canceled) {
            const imageURI = result.assets[0].uri;
            const noteCopy = { ...memory.notes[overlay.menuData.noteID] };
            dispatch(updateNote({ ...noteCopy, imageURI: imageURI }));
        }
    };

    const handleHighPriorityPress = () => {
        const noteCopy = { ...memory.notes[overlay.menuData.noteID] };
        noteCopy.priority = noteCopy.priority !== "high" ? "high" : "normal";
        dispatch(updateNote(noteCopy));
    };

    const handleDelete = () => {
        setDeleteModalVisible(true);
        const deleteInfo: DeleteInfo = {
            deleteType: "deleteNote",
            deleteMessage: "Are you sure you want to delete?",
        };

        const catsToSkip = overlay.menuData.subCategoryID ? null : overlay.menuData.categoryID;
        const subCatsToSkip = overlay.menuData.subCategoryID ? [overlay.menuData.subCategoryID] : [];

        if (
            noteExistsInOtherCategories(
                memory.categories,
                memory.subCategories,
                overlay.menuData.noteID,
                catsToSkip,
                subCatsToSkip
            )
        ) {
            deleteInfo.deleteMessage =
                "The note you are about to delete exists in other categories. If you delete, it will be removed from those too. If you only want to remove it from this category then use the move between categories option instead.";
        }
        setDeleteInfo(deleteInfo);
    };

    const handleAddRemoveCategories = () => {
        setIsAdjustingCategories(true);
        setIsNoteMainMenu(false);
    };

    const dispatch = useDispatch<AppDispatch>();
    return (
        <>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleCameraPress}>
                <FontAwesome name="camera" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Add photo to note (tmp)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAddRemoveCategories}>
                <FontAwesome name="reorder" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Move between categories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleHighPriorityPress}>
                <FontAwesome name="star" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Mark as high priority</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMoveNote}>
                <Entypo name="select-arrows" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Move note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleDelete}>
                <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                <Text style={menuOverlayStyles.text}>Delete note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="times" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>See additional note info</Text>
            </TouchableOpacity>
            {deleteModalVisible && (
                <DeleteModal
                    setDeleteModalVisible={setDeleteModalVisible}
                    deleteModalVisible={deleteModalVisible}
                    deleteInfo={deleteInfo}
                />
            )}
        </>
    );
};

export default NoteMainMenu;
