import { Text, View, TextInput, Image, TouchableOpacity, GestureResponderEvent } from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { MenuOverlay, Note } from "../types";
import { useDispatch } from "react-redux";
import { deleteNoteFromAllCategories, updateMenuOverlay, updateNote } from "../redux/slice";
import { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import ImageModal from "./ImageModal";
import { AppDispatch } from "../redux/store/store";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { memory } from "../mockMemory";

interface TileProps {
    note: Note;
    isLastCategory: boolean;
    isLastSubCategory?: boolean;
    isLastNote: boolean;
    isInSubCategory: boolean; // prob dont need this as well as ID, but leaving for now
    subCategoryID?: string;
    categoryID?: string; // dont think this is optional anymore. Should simplify some conditions elsewhere.
    isNoteInputActive: boolean;
    setIsNoteInputActive: React.Dispatch<React.SetStateAction<boolean>>;
}

// Add button to print current state to console.

// Add 'add note to bottom' of cat functionality. Might be nice with a small subtle downarrow at the bottom of the last note in cat
// which then adds a addnotetile .

const NoteTile: React.FC<TileProps> = ({
    note,
    isLastCategory,
    isInSubCategory, //p prob wont need with passing the IDs too
    isLastNote,
    isLastSubCategory,
    categoryID, // might as well just pass full category and subcategory rather than just IDs...
    subCategoryID,
    isNoteInputActive,
    setIsNoteInputActive,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const menuOverlay = useSelector((state: RootState) => state.memory.menuOverlay);

    const textInputRef = useRef<TextInput>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isShowingImage, setIsShowingImage] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const handleNoteChange = (text: string) => {
        dispatch(updateNote({ ...note, note: text }));
    };

    const menuOverlayRef = useRef(menuOverlay);

    // allows cleanup method to access current state
    useEffect(() => {
        menuOverlayRef.current = menuOverlay;
    }, [menuOverlay]);

    // cleanup method so when notetile is disposed of (think removed from category) the menu is turned off
    // if thats the only benefit then maybe we dont want it, might be good to keep menuoverlay open in that situation
    useEffect(() => {
        return () => {
            // cleanup method. Turns off arrow overlay if connected to this note
            if (menuOverlayRef.current && menuOverlayRef.current.menuData.noteID === note.id) {
                const closeOverlay = subCategoryID
                    ? menuOverlayRef.current.menuData.categoryID === categoryID &&
                      menuOverlayRef.current.menuData.subCategoryID === subCategoryID
                    : menuOverlayRef.current.menuData.categoryID === categoryID;
                if (closeOverlay) {
                    dispatch(updateMenuOverlay(getEmptyOverlay())); // or actually, make turnoffmeuoverlay reducer that just sets all menu data to empty
                }
            }
        };
    }, []);

    const handleNoteBlur = () => {
        setIsNoteInputActive(false);
        if (note.note === "") {
            const id = note.id;
            dispatch(deleteNoteFromAllCategories(id));
            // should give option to delete from just the category or sub category
            //   " you are about to remove note from all cats and sub cats, would you prefer to just delete from this one?"
        }
        setIsFocused(false);
    };

    const handleNoteFocus = () => {
        setIsFocused(true);
        setIsNoteInputActive(true);
    };

    const isEdittable = () => {
        if (isFocused) {
            return true;
        }

        if (menuOverlay.isShowing) {
            return false;
        }

        return !isNoteInputActive;
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
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
    };

    const handleImagePress = () => {
        setIsShowingImage(true);
    };

    const addBottomTileMargin = () => {
        if (!isLastCategory) {
            return false;
        }

        if (!isInSubCategory) {
            return isLastNote;
        }

        return isLastSubCategory && isLastNote;
    };

    const handleCheckboxPress = () => {
        const noteCopy = { ...note };
        noteCopy.completed = !noteCopy.completed;
        dispatch(updateNote(noteCopy));
    };

    return (
        <View style={[addBottomTileMargin() && noteStyles.lastMargin, isLastNote && noteStyles.bottomBorder]}>
            <View
                style={[
                    addBottomTileMargin() && noteStyles.lastMargin,
                    isLastNote && noteStyles.bottomBorder,
                    noteStyles.noteTile,
                ]}
            >
                <View style={noteStyles.noteContainer}>
                    <TouchableOpacity onPress={handleImagePress}>
                        {note.imageURI && <Image source={{ uri: note.imageURI }} style={{ height: 150, width: 150 }} />}
                    </TouchableOpacity>
                    <TextInput
                        multiline
                        style={[
                            noteStyles.noteText,
                            isFocused && noteStyles.noteTextFocused,
                            note.priority === "high" && noteStyles.highPriority,
                        ]}
                        onChangeText={handleNoteChange}
                        onBlur={handleNoteBlur}
                        onFocus={handleNoteFocus}
                        value={note.note}
                        ref={textInputRef}
                        editable={isEdittable()}
                    />
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

export default NoteTile;
