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
import { Category, MenuOverlay, Note, SubCategory, HeightUpdateInfo } from "../types";
import { useDispatch } from "react-redux";
import {
    addNewNoteToNotes,
    deleteNoteFromAllCategories,
    updateCategory,
    updateMenuOverlay,
    updateNote,
    updateSubCategory,
    updateNoteHeight,
} from "../redux/slice";
import { useEffect, useRef, useState } from "react";
import ImageModal from "./ImageModal";
import { AppDispatch } from "../redux/store/store";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { getRandomID } from "../memoryfunctions/memoryfunctions";
import React from "react";
interface TileProps {
    noteID: string;
    isLastCategory: boolean;
    isLastSubCategory?: boolean;
    isLastNote: boolean;
    isInSubCategory: boolean; // prob dont need this as well as ID, but leaving for now
    subCategory?: SubCategory;
    category: Category;
    index: number;
    subCategoryIndex: number;
    parentCategoryIndex: number;
}

const NoteTile: React.FC<TileProps> = ({
    noteID,
    isLastCategory,
    isLastNote,
    isLastSubCategory,
    category,
    subCategory,
    index,
    subCategoryIndex,
    parentCategoryIndex,
}) => {
    const menuOverlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const notes = useSelector((state: RootState) => state.memory.notes);
    const note = notes[noteID];
    const dispatch = useDispatch<AppDispatch>();

    const [noteEditMode, setNoteEditMode] = useState(note.isNewNote);
    const [isShowingImage, setIsShowingImage] = useState(false);

    const handleNoteChange = (text: string) => {
        const noteCopy = { ...note, note: text };
        if (noteCopy.isNewNote) {
            noteCopy.isNewNote = false;
        }
        dispatch(updateNote(noteCopy));
    };

    const handleNoteBlur = () => {
        if (note.note === "" && note.imageURI === "") {
            const id = note.id;
            dispatch(deleteNoteFromAllCategories(id));
        }

        if (note.isNewNote) {
            const noteCopy = { ...note, isNewNote: false };
            dispatch(updateNote(noteCopy));
        }
        setNoteEditMode(false);
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
                categoryID: category ? category.id : "",
                subCategoryID: subCategory ? subCategory.id : "",
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

        if (!subCategory) {
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
            if (menuOverlay.menuData.subCategoryID && subCategory) {
                return menuOverlay.menuData.subCategoryID === subCategory.id;
            }

            return menuOverlay.menuData.categoryID === category.id;
        }

        return false;
    };

    const handleCategoryLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;

        const update: HeightUpdateInfo = {
            newHeight: height,
            categoryIndex: parentCategoryIndex,
            subCategoryIndex: subCategoryIndex >= -1 ? subCategoryIndex : -1, // should prob allow null
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
                {<InsertNote subCategory={subCategory} category={category} index={index} />}
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
    subCategory?: SubCategory;
    category?: Category;
    index: number;
}

// InsertNote is an invisible symbol at the bottom left of each note tile to allow a clickable space
// for inserting notes into specific places in the note list.
const InsertNote: React.FC<Props> = ({ subCategory, category, index }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleAddNoteToBottom = () => {
        const noteToAdd: Note = {
            id: getRandomID(),
            note: "",
            additionalInfo: "",
            dateAdded: "",
            dateUpdated: "",
            priority: "normal",
            completed: false,
            imageURI: "",
            isNewNote: true,
        };
        dispatch(addNewNoteToNotes(noteToAdd));

        if (subCategory) {
            const subCategoryNotes = [...subCategory.notes];
            subCategoryNotes.splice(index + 1, 0, noteToAdd.id);
            dispatch(updateSubCategory({ ...subCategory, notes: subCategoryNotes }));
            return;
        }

        if (category) {
            const categoryNotes = [...category.notes];
            categoryNotes.splice(index + 1, 0, noteToAdd.id);

            dispatch(updateCategory({ ...category, notes: categoryNotes }));
        }
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
