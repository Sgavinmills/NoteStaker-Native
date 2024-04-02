import React, { useEffect, useState } from "react";
import { Modal, View, Text, Button, TouchableOpacity, BackHandler } from "react-native";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { AppDispatch } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory, updateMenuOverlay, updateSubCategory } from "../redux/slice";
import { MenuOverlay } from "../types";
import CategoryMainMenu from "./CategoryMainMenu";
import MoveArrows from "./MoveArrows";
import NoteMainMenu from "./NoteMainMenu";
import AdjustingCategories from "./AdjustingCategories";

interface TileProps {
    overlay: MenuOverlay;
    setScrollTo: React.Dispatch<React.SetStateAction<string>>;
}

// TODO - Move menu config componenets into own folder.

const MenuDisplay: React.FC<TileProps> = ({ overlay, setScrollTo }) => {
    const dispatch = useDispatch<AppDispatch>();
    // const memory = useSelector((state: RootState) => state.memory);
    const [isAdjustingCategories, setIsAdjustingCategories] = useState(false);

    const [isCatsMainMenu, setIsCatsMainMenu] = useState(
        overlay.menuType === "category" || overlay.menuType === "subCategory"
    );
    const [isNoteMainMenu, setIsNoteMainMenu] = useState(overlay.menuType === "note");
    const [isMoveArrows, setIsMoveArrows] = useState(false);

    const handleClose = () => {
        const overlay: MenuOverlay = {
            isShowing: false,
            menuType: "",
            menuData: {
                noteID: "",
                categoryID: "",
                subCategoryID: "",
                categoryIndex: null,
                subCategoryIndex: null,
                noteIndex: null,
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
                {isCatsMainMenu && (
                    <CategoryMainMenu
                        setScrollTo={setScrollTo}
                        setIsMoveArrows={setIsMoveArrows}
                        setIsCategoryMainMenu={setIsCatsMainMenu}
                    />
                )}
                {isNoteMainMenu && (
                    <NoteMainMenu
                        setIsAdjustingCategories={setIsAdjustingCategories}
                        setIsMoveArrows={setIsMoveArrows}
                        setIsNoteMainMenu={setIsNoteMainMenu}
                        setScrollTo={setScrollTo}
                    />
                )}
                {isMoveArrows && <MoveArrows />}
                {isAdjustingCategories && <AdjustingCategories />}
            </View>
            <Button title="Close" onPress={handleClose} />
        </View>
    );
};

export default MenuDisplay;
