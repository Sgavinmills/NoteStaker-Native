import { Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Note } from "../types";
import { useRef } from "react";
import { useDispatch } from "react-redux";

interface TileProps {
    note: Note;
}

const NoteTile: React.FC<TileProps> = ({ note }) => {
    const textInputRef = useRef<TextInput>(null);
    const dispatch = useDispatch();

    const handleContainerPress = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
            <View style={noteStyles.noteTile}>
                <TextInput style={noteStyles.noteText} ref={textInputRef}>
                    {note.note}{" "}
                </TextInput>
                <View style={noteStyles.tileIconsContainer}>
                    {note.completed && <Text style={[noteStyles.noteText, noteStyles.icons]}>&#x2705;</Text>}
                    {!note.completed && <Text style={[noteStyles.noteText, noteStyles.icons]}>&#x26AA;</Text>}
                    <FontAwesome
                        name="ellipsis-v"
                        style={[noteStyles.noteText, noteStyles.icons, noteStyles.noteEllipsis]}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default NoteTile;
