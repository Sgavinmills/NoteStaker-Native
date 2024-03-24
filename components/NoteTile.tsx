import { Text, View, TextInput, Image, Platform, Button } from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Note } from "../types";
import { useDispatch } from "react-redux";
import { deleteNote, updateNote } from "../redux/slice";
import { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import NoteIcons from "./NoteIcons";
import IconsModal from "./IconsModal";

interface TileProps {
    note: Note;
    isLastCategory: boolean;
    isLastSubCategory?: boolean;
    isLastNote: boolean;
    isInSubCategory: boolean;
}

// TODO: Border n dots thingy on new note
// - longer notes need box to expand.

// Add button to print current state to console.

const NoteTile: React.FC<TileProps> = ({ note, isLastCategory, isInSubCategory, isLastNote, isLastSubCategory }) => {
    const dispatch = useDispatch();
    const textInputRef = useRef<TextInput>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isFullImageVisible, setIsFullImageVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const handleNoteChange = (text: string) => {
        dispatch(updateNote({ ...note, note: text }));
    };
    console.log(note.imageURI);

    const handleNoteBlur = () => {
        console.log("blurring");
        if (note.note === "") {
            const id = note.id;
            dispatch(deleteNote(id));
        }
        setIsFocused(false);
    };

    const handleNoteFocus = () => {
        setIsFocused(true);
    };

    if (note.note === "" && textInputRef.current) {
        textInputRef.current.focus();
    }

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
                {/* // if wanna solve issue of notes sometimes scrolling slightly off tile  */}
                {/* // then would need to make text display and swap to textinput when clicked.  */}
                <View style={noteStyles.noteContainer}>
                    {note.imageURI && <Image source={{ uri: note.imageURI }} style={{ height: 200, width: 200 }} />}
                    <TextInput
                        multiline
                        style={[noteStyles.noteText, isFocused && noteStyles.noteTextFocused]}
                        onChangeText={handleNoteChange}
                        onBlur={handleNoteBlur}
                        onFocus={handleNoteFocus}
                        value={note.note}
                        ref={textInputRef}
                    />
                    {isFocused && <NoteIcons note={note} />}
                </View>
                <View style={noteStyles.tileIconsContainer}>
                    {note.completed && <Text style={[noteStyles.icons, noteStyles.completedCheckbox]}>&#x2705;</Text>}
                    {!note.completed && (
                        <Text style={[noteStyles.icons, noteStyles.notCompletedCheckbox]}>&#x26AA;</Text>
                    )}
                    <FontAwesome name="ellipsis-v" style={[noteStyles.icons, noteStyles.noteEllipsis]} />
                </View>
            </View>
        </View>
    );
};

export default NoteTile;
