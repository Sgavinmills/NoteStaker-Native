import { Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Note } from "../types";
import { useDispatch } from "react-redux";
import { deleteNote, updateNote } from "../redux/slice";
import { useRef } from "react";

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

    const handleNoteChange = (text: string) => {
        dispatch(updateNote({ ...note, note: text }));
    };

    const handleNoteBlur = () => {
        if (note.note === "") {
            const id = note.id;
            dispatch(deleteNote(id));
        }
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
        <View
            style={[
                noteStyles.noteTile,
                addBottomTileMargin() && noteStyles.lastMargin,
                isLastNote && noteStyles.bottomBorder,
            ]}
        >
            <TextInput
                multiline
                style={noteStyles.noteText}
                onChangeText={handleNoteChange}
                onBlur={handleNoteBlur}
                value={note.note}
                ref={textInputRef}
            />
            <View style={noteStyles.tileIconsContainer}>
                {note.completed && <Text style={noteStyles.icons}>&#x2705;</Text>}
                {!note.completed && <Text style={noteStyles.icons}>&#x26AA;</Text>}
                <FontAwesome name="ellipsis-v" style={[noteStyles.icons, noteStyles.noteEllipsis]} />
            </View>
        </View>
    );
};

export default NoteTile;
