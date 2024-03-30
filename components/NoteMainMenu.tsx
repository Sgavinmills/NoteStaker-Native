import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { AppDispatch } from "../redux/store/store";
import CategoryModal from "./CategoryModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import * as ImagePicker from "expo-image-picker";
import { deleteNoteFromAllCategories, updateMenuOverlay, updateNote } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
interface TileProps {
    setIsMoveArrows: React.Dispatch<React.SetStateAction<boolean>>;
    setIsNoteMainMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoteMainMenu: React.FC<TileProps> = ({ setIsMoveArrows, setIsNoteMainMenu }) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const memory = useSelector((state: RootState) => state.memory);

    const handleMoveNote = () => {
        setIsMoveArrows(true);
        setIsNoteMainMenu(false);
    };

    const handleCameraPress = (event: GestureResponderEvent) => {
        pickImage();
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (memory.menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
        }

        if (!result.canceled) {
            const imageURI = result.assets[0].uri;
            const noteCopy = { ...memory.notes[overlay.menuData.noteID] };
            dispatch(updateNote({ ...noteCopy, imageURI: imageURI }));
        }
    };

    const handleHighPriorityPress = () => {
        const noteCopy = { ...memory.notes[overlay.menuData.noteID] };
        noteCopy.priority = noteCopy.priority !== "high" ? "high" : "normal";
        dispatch(updateNote(noteCopy));
    };

    const handleDelete = () => {
        // TODO : Add confirmation check before deleting.
        const id = overlay.menuData.noteID;
        dispatch(deleteNoteFromAllCategories(id));
    };

    const dispatch = useDispatch<AppDispatch>();
    return (
        <>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleCameraPress}>
                <FontAwesome name="camera" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Add photo to note (tmp)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="plus" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Move between categories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleHighPriorityPress}>
                <FontAwesome name="edit" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Mark as high priority</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMoveNote}>
                <Entypo name="select-arrows" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Move note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleDelete}>
                <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                <Text style={menuOverlayStyles.text}>Delete note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="times" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>See additional note info</Text>
            </TouchableOpacity>
        </>
    );
};

export default NoteMainMenu;
