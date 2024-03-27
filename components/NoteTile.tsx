import {
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    GestureResponderEvent,
    NativeSyntheticEvent,
    TextInputFocusEventData,
} from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Note } from "../types";
import { useDispatch } from "react-redux";
import { deleteNoteFromAllCategories, updateNote } from "../redux/slice";
import { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import NoteMenu from "./NoteMenu";
import ImageModal from "./ImageModal";

interface TileProps {
    note: Note;
    isLastCategory: boolean;
    isLastSubCategory?: boolean;
    isLastNote: boolean;
    isInSubCategory: boolean; // prob dont need this as well as ID, but leaving for now
    subCategoryID?: string;
    categoryID?: string;
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
    categoryID,
    subCategoryID,
    isNoteInputActive,
    setIsNoteInputActive,
}) => {
    const dispatch = useDispatch();
    const textInputRef = useRef<TextInput>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isShowingImage, setIsShowingImage] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isShowingNoteMenu, setIsShowingNoteMenu] = useState(false);
    const [xCoordNoteMenu, setXCoordNoteMenu] = useState(0);
    const [yCoordNoteMenu, setYCoordNoteMenu] = useState(0);
    const handleNoteChange = (text: string) => {
        dispatch(updateNote({ ...note, note: text }));
    };

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

        return !isNoteInputActive;
    };

    const handleMenuPress = (event: GestureResponderEvent) => {
        setIsShowingNoteMenu(true);
        setXCoordNoteMenu(event.nativeEvent.pageX);
        setYCoordNoteMenu(event.nativeEvent.pageY);
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
                        style={[noteStyles.noteText, (isFocused || isShowingNoteMenu) && noteStyles.noteTextFocused]}
                        onChangeText={handleNoteChange}
                        onBlur={handleNoteBlur}
                        onFocus={handleNoteFocus}
                        value={note.note}
                        ref={textInputRef}
                        editable={isEdittable()}
                    />
                </View>
                <View style={noteStyles.tileIconsContainer}>
                    {note.completed && <Text style={[noteStyles.icons, noteStyles.completedCheckbox]}>&#x2705;</Text>}
                    {!note.completed && (
                        <Text style={[noteStyles.icons, noteStyles.notCompletedCheckbox]}>&#x26AA;</Text>
                    )}
                    <TouchableOpacity onPress={handleMenuPress}>
                        <FontAwesome name="ellipsis-v" style={[noteStyles.icons, noteStyles.noteEllipsis]} />
                    </TouchableOpacity>
                    {isShowingNoteMenu && (
                        <NoteMenu
                            xCoordNoteMenu={xCoordNoteMenu}
                            yCoordNoteMenu={yCoordNoteMenu}
                            note={note}
                            isShowingNoteMenu={isShowingNoteMenu}
                            setIsShowingNoteMenu={setIsShowingNoteMenu}
                        />
                    )}
                </View>
            </View>
            {isShowingImage && (
                <ImageModal
                    height={100}
                    width={100}
                    isShowingImage={isShowingImage}
                    setIsShowingImage={setIsShowingImage}
                    imageURI={note.imageURI}
                />
            )}
        </View>
    );
};

export default NoteTile;
