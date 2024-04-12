import {
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    GestureResponderEvent,
    TouchableWithoutFeedback,
} from "react-native";
import noteStyles from "../styles/noteStyles";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import { MenuOverlay, HeightUpdateInfo, NewNoteData } from "../types";
import { useDispatch } from "react-redux";
import { createNewNote, deleteNote, updateMenuOverlay, updateNote, updateNoteHeight } from "../redux/slice";
import { useState } from "react";
import ImageModal from "./ImageModal";
import { AppDispatch } from "../redux/store/store";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import React from "react";
interface TileProps {
    noteID: string;
    isLastCategory: boolean;
    isLastSubCategory?: boolean;
    isLastNote: boolean;
    subCategoryID: string;
    categoryID: string;
    index: number;
    subCategoryIndex: number;
    parentCategoryIndex: number;
}

const NoteTile: React.FC<TileProps> = ({
    noteID,
    isLastCategory,
    isLastNote,
    isLastSubCategory,
    categoryID,
    subCategoryID,
    index,
    subCategoryIndex,
    parentCategoryIndex,
}) => {
    const menuOverlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const note = useSelector((state: RootState) => state.memory.notes[noteID]);
    const dispatch = useDispatch<AppDispatch>();

    const [noteEditMode, setNoteEditMode] = useState(note.isNewNote);
    const [isShowingImage, setIsShowingImage] = useState(false);
    // console.log("re render note: " + note.note);
    const handleNoteChange = (text: string) => {
        const noteCopy = { ...note, note: text };
        if (noteCopy.isNewNote) {
            noteCopy.isNewNote = false;
        }
        dispatch(updateNote(noteCopy));
    };

    const handleNoteBlur = () => {
        setNoteEditMode(false);

        if (note.note === "" && note.imageURI === "") {
            const id = note.id;
            dispatch(deleteNote(id));
            return;
        }

        if (note.isNewNote) {
            const noteCopy = { ...note, isNewNote: false };
            dispatch(updateNote(noteCopy));
        }
    };

    const handleMenuPress = (event: GestureResponderEvent) => {
        if (menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
        const newOverlay: MenuOverlay = {
            isShowing: true,
            menuType: "note",
            menuData: {
                noteID: note.id,
                categoryID: categoryID ? categoryID : "",
                subCategoryID: subCategoryID ? subCategoryID : "",
                categoryIndex: parentCategoryIndex,
                subCategoryIndex: subCategoryIndex !== undefined ? subCategoryIndex : null,
                noteIndex: index,
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
    };

    const handleImagePress = () => {
        if (menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        setIsShowingImage(true);
    };

    const addBottomTileMargin = () => {
        if (!isLastCategory) {
            return false;
        }

        if (!subCategoryID) {
            return isLastNote;
        }
        return isLastSubCategory && isLastNote;
    };

    const handleCheckboxPress = () => {
        const noteCopy = { ...note };
        noteCopy.completed = !noteCopy.completed;
        dispatch(updateNote(noteCopy));
    };

    const handleTouchNote = () => {
        if (menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
        setNoteEditMode(true);
    };

    const tileHasMenuOpen = () => {
        if (menuOverlay.isShowing && menuOverlay.menuType === "note" && menuOverlay.menuData.noteID === note.id) {
            if (menuOverlay.menuData.subCategoryID && subCategoryID) {
                return menuOverlay.menuData.subCategoryID === subCategoryID;
            }

            return menuOverlay.menuData.categoryID === categoryID;
        }

        return false;
    };

    const handleCategoryLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;

        const update: HeightUpdateInfo = {
            newHeight: height,
            categoryIndex: parentCategoryIndex,
            subCategoryIndex: subCategoryIndex >= -1 ? subCategoryIndex : -1,
            noteIndex: index,
        };

        dispatch(updateNoteHeight(update));
    };
    return (
        <View
            onLayout={handleCategoryLayout}
            style={[addBottomTileMargin() && noteStyles.lastMargin, isLastNote && noteStyles.bottomBorder]}
        >
            <View
                style={[
                    addBottomTileMargin() && noteStyles.lastMargin,
                    isLastNote && noteStyles.bottomBorder,
                    noteStyles.noteTile,
                    tileHasMenuOpen() && categoryStyles.categoryTileSelected,
                ]}
            >
                <View style={noteStyles.noteContainer}>
                    <TouchableOpacity onPress={handleImagePress}>
                        {note.imageURI && <Image source={{ uri: note.imageURI }} style={{ height: 150, width: 150 }} />}
                    </TouchableOpacity>
                    {noteEditMode && (
                        <TextInput
                            multiline
                            style={[
                                noteStyles.noteText,
                                noteStyles.noteTextFocused,
                                note.priority === "high" && noteStyles.highPriority,
                            ]}
                            onChangeText={handleNoteChange}
                            onBlur={handleNoteBlur}
                            value={note.note}
                            autoFocus
                        />
                    )}
                    {!noteEditMode && (
                        <TouchableWithoutFeedback onPress={handleTouchNote} onLongPress={handleMenuPress}>
                            <Text style={[noteStyles.noteText, note.priority === "high" && noteStyles.highPriority]}>
                                {note.isSecureNote && (
                                    <FontAwesome name="lock" style={noteStyles.padlock}></FontAwesome>
                                )}
                                {note.isSecureNote && "  "}
                                {note.note}
                            </Text>
                        </TouchableWithoutFeedback>
                    )}
                </View>
                <View style={noteStyles.tileIconsContainer}>
                    <TouchableOpacity onPress={handleCheckboxPress}>
                        {note.completed && (
                            <Text style={[noteStyles.icons, noteStyles.completedCheckbox]}>&#x2705;</Text>
                        )}
                        {!note.completed && (
                            <Text style={[noteStyles.icons, noteStyles.notCompletedCheckbox]}>&#x26AA;</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMenuPress}>
                        <FontAwesome name="ellipsis-v" style={[noteStyles.icons, noteStyles.noteEllipsis]} />
                    </TouchableOpacity>
                </View>
                {<InsertNote subCategoryID={subCategoryID} categoryID={categoryID} index={index} />}
            </View>
            {isShowingImage && (
                <ImageModal
                    height={100}
                    width={100}
                    isShowingImage={isShowingImage}
                    setIsShowingImage={setIsShowingImage}
                    imageURI={note.imageURI}
                    note={note}
                />
            )}
        </View>
    );
};

interface Props {
    subCategoryID?: string;
    categoryID: string;
    index: number;
}

// InsertNote is an invisible symbol at the bottom left of each note tile to allow a clickable space
// for inserting notes into specific places in the note list.
const InsertNote: React.FC<Props> = ({ subCategoryID, categoryID, index }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleAddNoteToBottom = () => {
        const newNoteData: NewNoteData = {
            categoryID: categoryID,
            subCategoryID: subCategoryID ? subCategoryID : "",
            imageURI: "",
            noteInsertIndex: index + 1,
        };
        dispatch(createNewNote(newNoteData));
    };
    return (
        <View style={noteStyles.addToBottomContainer}>
            <TouchableWithoutFeedback onPress={handleAddNoteToBottom}>
                <Text style={noteStyles.addToBottomText}>+</Text>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default NoteTile;
