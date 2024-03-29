import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { AppDispatch } from "../redux/store/store";
import CategoryModal from "./CategoryModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers/reducers";

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

    const dispatch = useDispatch<AppDispatch>();
    return (
        <>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="camera" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Add photo to note (tmp)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="plus" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Move between categories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="edit" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Mark as high priority</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMoveNote}>
                <Entypo name="select-arrows" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Move note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
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
