import React, { useEffect, useState } from "react";
import { Modal, View, Text, Button, TouchableOpacity, BackHandler } from "react-native";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo, EvilIcons } from "@expo/vector-icons";
import { AppDispatch } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory, updateMenuOverlay, updateSubCategory } from "../redux/slice";
import { RootState } from "../redux/reducers/reducers";
import { MenuOverlay } from "../types";
import CategoryMainMenu from "./CategoryMainMenu";
import MoveArrows from "./MoveArrows";
import NoteMenu from "./NoteMenu";

interface TileProps {
    overlay: MenuOverlay;
}

// TODO - Move menu config componenets into own folder.

const MenuDisplay: React.FC<TileProps> = ({ overlay }) => {
    const dispatch = useDispatch<AppDispatch>();
    // const memory = useSelector((state: RootState) => state.memory);

    const [isCategoryMainMenu, setIsCategoryMainMenu] = useState(overlay.menuType === "category");
    const [isActiveNoteMenu, setIsActiveNoteMenu] = useState(overlay.menuType === "note");
    const [isMoveArrows, setIsMoveArrows] = useState(false);

    const handleClose = () => {
        const overlay: MenuOverlay = {
            isShowing: false,
            menuType: "",
            menuData: {
                noteID: "",
                categoryID: "",
                subCategoryID: "",
            },
        };

        dispatch(updateMenuOverlay(overlay));
    };

    // back button closes overlay rather than normal behaviour
    useEffect(() => {
        const backAction = () => {
            if (overlay.isShowing) {
                handleClose();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove(); // Cleanup the event listener
    }, []);

    return (
        <View style={menuOverlayStyles.container}>
            <View style={menuOverlayStyles.contentContainer}>
                {isCategoryMainMenu && (
                    // extract this
                    <CategoryMainMenu
                        categoryID={overlay.menuData.categoryID}
                        setIsMoveArrows={setIsMoveArrows}
                        setIsCategoryMainMenu={setIsCategoryMainMenu}
                    />
                )}
                {isMoveArrows && <MoveArrows />}
            </View>
            <Button title="Close" onPress={handleClose} />
        </View>
    );
};

export default MenuDisplay;
