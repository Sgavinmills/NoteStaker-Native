import { Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Note } from "../types";
import { useDispatch } from "react-redux";
import { deleteNote, updateNote } from "../redux/slice";

interface TileProps {
    note: Note;
}

const NoteTile: React.FC<TileProps> = ({ note }) => {
    const dispatch = useDispatch();

    const handleNoteChange = (text: string) => {
        dispatch(updateNote({ ...note, note: text }));
    };

    const handleNoteBlur = () => {
        if (note.note === "") {
            const id = note.id;
            dispatch(deleteNote(id));
        }
    };

    return (
        <View style={noteStyles.noteTile}>
            <TextInput
                style={noteStyles.noteText}
                onChangeText={handleNoteChange}
                onBlur={handleNoteBlur}
                value={note.note}
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
