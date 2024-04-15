import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { AppDispatch } from "../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store/store";
import * as ImagePicker from "expo-image-picker";
import { updateMenuOverlay, updateNote, updateNoteSecureStatus } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import DeleteModal from "./DeleteModal";
import { DeleteInfo } from "../types";
import * as LocalAuthentication from "expo-local-authentication";
import AdjustingCategories from "./AdjustingCategories";
import MoveArrows from "./MoveArrows";
import NoteAdditionalInfo from "./NoteAdditionalInfo";

interface TileProps {
    setScrollTo: React.Dispatch<React.SetStateAction<number | null>>;
}

const NoteMainMenu: React.FC<TileProps> = ({ setScrollTo }) => {
    const [isAdjustingCategories, setIsAdjustingCategories] = useState(false);
    const [isAdditionalInfo, setIsAdditionalInfo] = useState(false);
    const [isMoveArrows, setIsMoveArrows] = useState(false);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const heightData = useSelector((state: RootState) => state.memory.heightData);

    const note = useSelector((state: RootState) => state.memory.notes[overlay.menuData.noteID]);
    const subCategory = useSelector((state: RootState) => state.memory.subCategories[overlay.menuData.subCategoryID]);
    const category = useSelector((state: RootState) => state.memory.categories[overlay.menuData.categoryID]);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo>({
        deleteType: "",
        deleteMessage: "",
        additionalMessage: "",
    });

    const handleMoveNote = () => {
        setIsMoveArrows(true);
    };

    const handleHighPriorityPress = () => {
        const noteCopy = { ...note };
        noteCopy.priority = noteCopy.priority !== "high" ? "high" : "normal";
        dispatch(updateNote(noteCopy));
    };

    const handleMakeSecure = () => {
        adjustNoteSecurity();
    };

    const adjustNoteSecurity = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (compatible) {
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (enrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Authenticate to continue",
                });
                if (result.success) {
                    if (overlay.isShowing) {
                        dispatch(updateMenuOverlay(getEmptyOverlay()));
                    }
                    dispatch(updateNoteSecureStatus(note.id));
                }
            }
        }
    };

    const handleDelete = () => {
        setDeleteModalVisible(true);
        const deleteInfo: DeleteInfo = {
            deleteType: "deleteNote",
            deleteMessage: "Are you sure you want to delete?",
            additionalMessage: "",
        };

        if (note.locations.length > 1) {
            deleteInfo.deleteMessage =
                "The note you are about to delete exists in other categories. If you delete, it will be removed from those too. If you only want to remove it from this category then use the move between categories option instead.";
        }

        setDeleteInfo(deleteInfo);
    };

    const handleAddRemoveCategories = () => {
        setIsAdjustingCategories(true);
    };

    const handleAdditionalInfoPress = () => {
        setIsAdditionalInfo(true);
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
                const numOfSubs = category.subCategories.length;
                for (let j = subCategoryIndex + 1; j < numOfSubs; j++) {
                    offset -= heightData[categoryIndex].subHeights[j].subHeight;
                }

                const noteIndex = overlay.menuData.noteIndex;
                if (noteIndex != null && noteIndex >= 0) {
                    const numOfNotes = subCategory.notes.length;
                    for (let k = noteIndex; k < numOfNotes; k++) {
                        offset -= heightData[categoryIndex].subHeights[subCategoryIndex].noteHeights[noteIndex];
                    }
                }
            } else {
                const noteIndex = overlay.menuData.noteIndex;
                if (noteIndex != null && noteIndex >= 0) {
                    const numOfNotes = category.notes.length;
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
            {isAdjustingCategories ? (
                <AdjustingCategories />
            ) : isAdditionalInfo ? (
                <NoteAdditionalInfo />
            ) : isMoveArrows ? (
                <MoveArrows />
            ) : (
                <>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAddRemoveCategories}>
                        <FontAwesome name="reorder" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>Move between categories</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleHighPriorityPress}>
                        <FontAwesome name="star" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>Mark as high priority</Text>
                    </TouchableOpacity>
                    {!overlay.menuData.isSearchTile && (
                        <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMoveNote}>
                            <Entypo name="select-arrows" style={menuOverlayStyles.icons} />
                            <Text style={menuOverlayStyles.text}>Reorder note</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMakeSecure}>
                        <FontAwesome name="lock" style={menuOverlayStyles.icons} />
                        {!note.isSecureNote && <Text style={menuOverlayStyles.text}>Make secure note</Text>}
                        {note.isSecureNote && <Text style={menuOverlayStyles.text}>Unsecure note</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleDelete}>
                        <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                        <Text style={menuOverlayStyles.text}>Delete note</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAdditionalInfoPress}>
                        <MaterialIcons name="read-more" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>See note details</Text>
                    </TouchableOpacity>
                </>
            )}
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
