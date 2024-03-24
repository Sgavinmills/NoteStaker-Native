import {
    Text,
    View,
    TextInput,
    Image,
    Platform,
    Button,
    TouchableOpacity,
    GestureResponderEvent,
    TouchableWithoutFeedback,
} from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Note } from "../types";
import { useDispatch } from "react-redux";
import { deleteNote, updateNote } from "../redux/slice";
import { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";

interface TileProps {
    note: Note;
}

const NoteIcons: React.FC<TileProps> = ({ note }) => {
    const dispatch = useDispatch();

    const handleCameraPress = (event: GestureResponderEvent) => {
        event.stopPropagation();
        pickImage();
    };

    const pickImage = async () => {
        console.log("pick image...");
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        console.log("£done awaiting");
        if (!result.canceled) {
            const imageURI = result.assets[0].uri;
            console.log("dispatching?");
            dispatch(updateNote({ ...note, imageURI: imageURI }));
        }
    };
    return (
        <View style={noteStyles.noteIconContainer}>
            <TouchableWithoutFeedback onPress={handleCameraPress}>
                <FontAwesome name="camera" style={noteStyles.noteIconText} />
            </TouchableWithoutFeedback>
            <FontAwesome name="times" style={[noteStyles.noteIconText, noteStyles.noteIconTextCross]} />
        </View>
    );
};

export default NoteIcons;
