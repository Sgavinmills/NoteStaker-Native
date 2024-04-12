import React, { useEffect, useState } from "react";
import { View, Button, BackHandler, TouchableWithoutFeedback } from "react-native";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { AppDispatch } from "../redux/store/store";
import { useDispatch } from "react-redux";
import { updateMenuOverlay } from "../redux/slice";
import { MenuOverlay } from "../types";
import CategoryMainMenu from "./CategoryMainMenu";
import MoveArrows from "./MoveArrows";
import NoteMainMenu from "./NoteMainMenu";
import AdjustingCategories from "./AdjustingCategories";
import AdditionalInfo from "./AdditionalInfo";
import HomeScreenMainMenu from "./HomeScreenMainMenu";

interface TileProps {
    overlay: MenuOverlay;
    setScrollTo: React.Dispatch<React.SetStateAction<number | null>>;
    setCloseAllCategories: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO - Move menu config componenets into own folder.

const MenuDisplay: React.FC<TileProps> = ({ overlay, setScrollTo, setCloseAllCategories }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isAdjustingCategories, setIsAdjustingCategories] = useState(false);
    const [isAdditionalInfo, setIsAdditionalInfo] = useState(false);

    // TODO: having 4 states for each type of menu is a bit daft. Should be one state with variable ting but ok for now.
    const [isNoteMainMenu, setIsNoteMainMenu] = useState(overlay.menuType === "note");
    const [isMoveArrows, setIsMoveArrows] = useState(false);
    const [isCatsMainMenu, setIsCatsMainMenu] = useState(
        overlay.menuType === "category" || overlay.menuType === "subCategory"
    );
    const [isHomeScreenMainMenu, setIsHomeScreenMainMenu] = useState(overlay.menuType === "homeScreen");
    console.log("menu display rerender: " + overlay.menuType);
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
        <TouchableWithoutFeedback>
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
                            setIsAdditionalInfo={setIsAdditionalInfo}
                        />
                    )}
                    {isHomeScreenMainMenu && (
                        <HomeScreenMainMenu
                            setIsHomeScreenMainMenu={setIsHomeScreenMainMenu}
                            setCloseAllCategories={setCloseAllCategories}
                        />
                    )}
                    {isMoveArrows && <MoveArrows />}
                    {isAdjustingCategories && <AdjustingCategories />}
                    {isAdditionalInfo && <AdditionalInfo />}
                </View>
                <Button title="Close" onPress={handleClose} />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default MenuDisplay;
