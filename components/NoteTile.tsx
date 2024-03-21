import { Text, View } from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Note } from "../types";

interface TileProps {
    note: Note;
}

const NoteTile: React.FC<TileProps> = ({ note }) => {
    return (
        <View style={noteStyles.noteTile}>
            <Text style={noteStyles.noteText}>{note.note}</Text>
            <View style={noteStyles.tileIconsContainer}>
                {note.completed && (
                    <Text style={[noteStyles.noteText, noteStyles.icons]}>
                        &#x2705;
                    </Text>
                )}
                {!note.completed && (
                    <Text style={[noteStyles.noteText, noteStyles.icons]}>
                        &#x26AA;
                    </Text>
                )}
                <FontAwesome
                    name="ellipsis-v"
                    style={[
                        noteStyles.noteText,
                        noteStyles.icons,
                        noteStyles.noteEllipsis,
                    ]}
                />
            </View>
        </View>
    );
};

export default NoteTile;
