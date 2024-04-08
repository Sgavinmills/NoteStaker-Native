import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { AppDispatch } from "../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store/store";
import * as ImagePicker from "expo-image-picker";
import { updateMenuOverlay, updateNote } from "../redux/slice";
import { getEmptyOverlay, noteExistsInOtherCategories } from "../utilFuncs/utilFuncs";
import DeleteModal from "./DeleteModal";
import { DeleteInfo } from "../types";

interface TileProps {
    setIsMoveArrows: React.Dispatch<React.SetStateAction<boolean>>;
    setIsNoteMainMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setScrollTo: React.Dispatch<React.SetStateAction<number | null>>;
    setIsAdjustingCategories: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAdditionalInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoteMainMenu: React.FC<TileProps> = ({
    setScrollTo,
    setIsMoveArrows,
    setIsNoteMainMenu,
    setIsAdjustingCategories,
    setIsAdditionalInfo,
}) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const categories = useSelector((state: RootState) => state.memory.categories);
    const notes = useSelector((state: RootState) => state.memory.notes);
    const heightData = useSelector((state: RootState) => state.memory.heightData);

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

        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
        }

        if (!result.canceled) {
            const imageURI = result.assets[0].uri;
            const noteCopy = { ...notes[overlay.menuData.noteID] };
            dispatch(updateNote({ ...noteCopy, imageURI: imageURI }));
        }
    };

    const handleHighPriorityPress = () => {
        const noteCopy = { ...notes[overlay.menuData.noteID] };
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
            noteExistsInOtherCategories(categories, subCategories, overlay.menuData.noteID, catsToSkip, subCatsToSkip)
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

    const handleAdditionalInfoPress = () => {
        setIsAdditionalInfo(true);
        setIsNoteMainMenu(false);
    };

    const handleScrollToNote = () => {
        let offset = 0;
        // to scroll to offset for all cats up to and inc this one
        // if there are subcats
        // then subtract the subcts below and any notes in the sub cat we're in below... (done)

        // if there are not subcats then just subtract the notes below...
        const categoryIndex = overlay.menuData.categoryIndex;
        if (categoryIndex != null && categoryIndex >= 0) {
            for (let i = 0; i <= categoryIndex; i++) {
                offset += heightData[i].catHeight;
            }

            const subCategoryIndex = overlay.menuData.subCategoryIndex;
            if (subCategoryIndex != null && subCategoryIndex >= 0) {
                const numOfSubs = categories[overlay.menuData.categoryID].subCategories.length;
                for (let j = subCategoryIndex + 1; j < numOfSubs; j++) {
                    offset -= heightData[categoryIndex].subHeights[j].subHeight;
                }

                const noteIndex = overlay.menuData.noteIndex;
                if (noteIndex != null && noteIndex >= 0) {
                    const numOfNotes = subCategories[overlay.menuData.subCategoryID].notes.length;
                    for (let k = noteIndex; k < numOfNotes; k++) {
                        offset -= heightData[categoryIndex].subHeights[subCategoryIndex].noteHeights[noteIndex];
                    }
                }
            } else {
                const noteIndex = overlay.menuData.noteIndex;
                if (noteIndex != null && noteIndex >= 0) {
                    const numOfNotes = categories[overlay.menuData.categoryID].notes.length;
                    for (let k = noteIndex; k < numOfNotes; k++) {
                        offset -= heightData[categoryIndex].noteHeights[noteIndex];
                    }
                }
            }
        }
        setScrollTo(offset);
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
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleScrollToNote}>
                <FontAwesome name="times" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Scroll To</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAdditionalInfoPress}>
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
