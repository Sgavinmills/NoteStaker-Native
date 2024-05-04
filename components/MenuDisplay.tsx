import React, { useEffect, useState } from "react";
import { View, Button, BackHandler, TouchableWithoutFeedback, Modal } from "react-native";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { AppDispatch } from "../redux/store/store";
import { useDispatch } from "react-redux";
import { updateMenuOverlay } from "../redux/slice";
import { MenuOverlay } from "../types";
import CategoryMainMenu from "./CategoryMainMenu";
import NoteMainMenu from "./NoteMainMenu";
import HomeScreenMainMenu from "./HomeScreenMainMenu";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import SubCategoryMainMenu from "./SubCategoryMainMenu";

interface TileProps {
    setScrollTo: React.Dispatch<React.SetStateAction<number | null>>;
    setCloseAllCategories: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO - Move menu config componenets into own folder.

const MenuDisplay: React.FC<TileProps> = ({ setScrollTo, setCloseAllCategories }) => {
    const dispatch = useDispatch<AppDispatch>();
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const menuType = overlay.menuType;

    // console.log("is note main menu: " + isNoteMainMenu);
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
                isSearchTile: false,
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
    }, [overlay.isShowing]);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={overlay.isShowing}
            onRequestClose={() => {
                handleClose();
            }}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={menuOverlayStyles.modal}></View>
            </TouchableWithoutFeedback>
            <>
                {overlay.isShowing && (
                    <TouchableWithoutFeedback>
                        <View style={menuOverlayStyles.container}>
                            <View style={menuOverlayStyles.contentContainer}>
                                {menuType === "category" ? (
                                    <CategoryMainMenu setScrollTo={setScrollTo} />
                                ) : menuType === "subCategory" ? (
                                    <SubCategoryMainMenu setScrollTo={setScrollTo} />
                                ) : menuType === "note" ? (
                                    <NoteMainMenu setScrollTo={setScrollTo} />
                                ) : menuType === "homeScreen" ? (
                                    <HomeScreenMainMenu setCloseAllCategories={setCloseAllCategories} />
                                ) : (
                                    <></>
                                )}
                            </View>
                            {overlay.isShowing && <Button title="Close" onPress={handleClose} />}
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </>
        </Modal>
    );
};

export default MenuDisplay;
