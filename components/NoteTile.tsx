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
import { MenuOverlay, Note } from "../types";
import { useDispatch } from "react-redux";
import { deleteNoteFromAllCategories, updateMenuOverlay, updateNote } from "../redux/slice";
import { useEffect, useRef, useState } from "react";
import ImageModal from "./ImageModal";
import { AppDispatch } from "../redux/store/store";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";

interface TileProps {
    note: Note;
    isLastCategory: boolean;
    isLastSubCategory?: boolean;
    isLastNote: boolean;
    isInSubCategory: boolean; // prob dont need this as well as ID, but leaving for now
    subCategoryID?: string;
    categoryID?: string; // dont think this is optional anymore. Should simplify some conditions elsewhere.
}

const NoteTile: React.FC<TileProps> = ({
    note,
    isLastCategory,
    isInSubCategory, //p prob wont need with passing the IDs too
    isLastNote,
    isLastSubCategory,
    categoryID, // might as well just pass full category and subcategory rather than just IDs...
    subCategoryID,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const menuOverlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const [noteEditMode, setNoteEditMode] = useState(note.isNewNote);

    const [isShowingImage, setIsShowingImage] = useState(false);
    const handleNoteChange = (text: string) => {
        const noteCopy = { ...note, note: text };
        if (noteCopy.isNewNote) {
            noteCopy.isNewNote = false;
        }
        dispatch(updateNote(noteCopy));
    };

    const menuOverlayRef = useRef(menuOverlay);

    // allows cleanup method to access current state
    useEffect(() => {
        menuOverlayRef.current = menuOverlay;
    }, [menuOverlay]);

    // this cleanup method closes the menu overlay if the tile its related to gets disposed of. Originally was for if the category got closed (which is no longer possible)
    // and then for when removing from category, but we've now taken that out. GUnna leave code in for now incase it does need to be actioned but atm doesnt do anything.
    useEffect(() => {
        return () => {
            // cleanup method. Turns off arrow overlay if connected to this note
            if (menuOverlayRef.current && menuOverlayRef.current.menuData.noteID === note.id) {
                const closeOverlay = subCategoryID
                    ? menuOverlayRef.current.menuData.categoryID === categoryID &&
                      menuOverlayRef.current.menuData.subCategoryID === subCategoryID
                    : menuOverlayRef.current.menuData.categoryID === categoryID;
                if (closeOverlay) {
                    // dispatch(updateMenuOverlay(getEmptyOverlay())); // or actually, make turnoffmeuoverlay reducer that just sets all menu data to empty
                }
            }
        };
    }, []);

    const handleNoteBlur = () => {
        if (note.note === "" && note.imageURI === "") {
            const id = note.id;
            dispatch(deleteNoteFromAllCategories(id));
            // should give option to delete from just the category or sub category
            //   " you are about to remove note from all cats and sub cats, would you prefer to just delete from this one?"
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
                categoryID: categoryID ? categoryID : "",
                subCategoryID: subCategoryID ? subCategoryID : "",
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

    const handleTouchNote = () => {
        if (menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
        setNoteEditMode(true);
    };

    const tileHasMenuOpen = () => {
        if (menuOverlay.isShowing && menuOverlay.menuType === "note" && menuOverlay.menuData.noteID === note.id) {
            if (menuOverlay.menuData.subCategoryID) {
                return menuOverlay.menuData.subCategoryID === subCategoryID;
            }

            return menuOverlay.menuData.categoryID === categoryID;
        }

        return false;
    };

    return (
        <View style={[addBottomTileMargin() && noteStyles.lastMargin, isLastNote && noteStyles.bottomBorder]}>
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
