import React, { useEffect, useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import CategoryModal from "./CategoryModal";
import { DeleteInfo } from "../types";
import { AppDispatch } from "../redux/store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import {
    addToShowSecureNote,
    removeFromShowSecureNote,
    updateCategorySecureStatus,
    updateMenuOverlay,
    updateSubCategorySecureStatus,
} from "../redux/slice";
import DeleteModal from "./DeleteModal";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import * as LocalAuthentication from "expo-local-authentication";
import MoveArrows from "./MoveArrows";
import CategoryAdditionalInfo from "./CategoryAdditionalInfo";

interface TileProps {
    setScrollTo: React.Dispatch<React.SetStateAction<number | null>>;
}

// CategoryMainMenu provides main menu for parent categories and sub categories
const SubCategoryMainMenu: React.FC<TileProps> = ({ setScrollTo }) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const showingSecureCategories = useSelector((state: RootState) => state.memory.canShowSecure.categories);
    const heightData = useSelector((state: RootState) => state.memory.heightData);
    const category = useSelector((state: RootState) => state.memory.categories[overlay.menuData.categoryID]);

    const subCategory = useSelector((state: RootState) => state.memory.subCategories[overlay.menuData.subCategoryID]);
    // const heightData = useSelector((state: RootState) => state.memory.heightData);
    const dispatch = useDispatch<AppDispatch>();

    const [isAdditionalInfo, setIsAdditionalInfo] = useState(false);
    const [isMoveArrows, setIsMoveArrows] = useState(false);
    const [catModalInfo, setCatModalInfo] = useState({ currentName: "", parentCat: "" });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo>({
        deleteMessage: "",
        deleteType: "",
        additionalMessage: "",
    });
    const [isCategoryModal, setIsCategoryModal] = useState(false);

    const handleEditName = () => {
        setCatModalInfo({
            currentName: subCategory.name,
            parentCat: overlay.menuData.categoryID,
        });
        setIsCategoryModal(true);
    };

    const handleMoveCategory = () => {
        setIsMoveArrows(true);
    };

    const handleRemoveAllNotes = () => {
        const deleteInfo: DeleteInfo = {
            deleteType: "removeAll",
            deleteMessage: "",
            additionalMessage: "",
        };

        let name = subCategory.name;

        deleteInfo.deleteMessage = `Are you sure you want to remove all notes from ${name}? All notes not within other categories will be permenantly deleted`;

        if (subCategory.notes.some((noteRef) => noteRef.isSecure === true)) {
            deleteInfo.additionalMessage = `There are secure notes in this subCategory that will be deleted`;
        }

        setDeleteInfo(deleteInfo);
        setDeleteModalVisible(true);
    };

    const handleDeleteCategory = () => {
        const deleteInfo: DeleteInfo = {
            deleteType: "deleteCategory",
            deleteMessage: "",
            additionalMessage: "",
        };

        let catName = subCategory.name;

        deleteInfo.deleteMessage = `Are you sure you want to delete the category ${catName}? All notes not within other categories will be permenantly deleted`;

        if (subCategory.notes.some((noteRef) => noteRef.isSecure === true)) {
            deleteInfo.additionalMessage = `There are secure notes in this subcategory that will be deleted`;
        }

        setDeleteInfo(deleteInfo);
        setDeleteModalVisible(true);
    };

    const handleMakeSecureCategory = () => {
        adjustCategorySecurity();
    };

    const adjustCategorySecurity = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (compatible) {
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (enrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Authenticate to continue",
                });
                if (result.success) {
                    if (overlay.isShowing) {
                        dispatch(updateMenuOverlay(getEmptyOverlay()));
                    }
                    dispatch(updateSubCategorySecureStatus(overlay.menuData.subCategoryID));
                }
            }
        }
    };

    const handleShowSecureNote = () => {
        showSecureNotes();
    };

    const showSecureNotes = async () => {
        if (showingSecureCategories.includes(subCategory.id)) {
            dispatch(removeFromShowSecureNote(subCategory.id));
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (compatible) {
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (enrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Authenticate to continue",
                });
                if (result.success) {
                    dispatch(updateMenuOverlay(getEmptyOverlay()));
                    dispatch(addToShowSecureNote(subCategory.id));
                }
            }
        }
    };

    useEffect(() => {
        handleScrollTo();
    }, []);

    const handleScrollTo = () => {
        let offset = 0;
        const categoryIndex = overlay.menuData.categoryIndex;
        if (categoryIndex != undefined && categoryIndex >= 0) {
            for (let i = 0; i <= categoryIndex; i++) {
                offset += heightData[i].catHeight;
            }
            const subCategoryIndex = overlay.menuData.subCategoryIndex;
            if (subCategoryIndex != undefined && subCategoryIndex >= 0) {
                const numOfSubs = category.subCategories.length;
                for (let j = subCategoryIndex; j < numOfSubs; j++) {
                    offset -= heightData[categoryIndex].subHeights[j].subHeight;
                }
            }
        }

        setScrollTo(offset);
    };

    // too much for one line, can be made nicer but in a rush.
    const makeCategorySecure = (): string => {
        if (subCategory.isSecure) {
            return "Unsecure subcategory";
        } else {
            return "Make subcategory secure";
        }
    };

    const handleAdditionalInfoPress = () => {
        setIsAdditionalInfo(true);
    };

    const makeCategorySecureText = makeCategorySecure();

    const getSecureItemsText = () => {
        if (showingSecureCategories.includes(subCategory.id)) {
            return "Hide secure notes";
        } else {
            return "Show secure notes";
        }
    };

    return (
        <>
            {isMoveArrows ? (
                <MoveArrows />
            ) : isAdditionalInfo ? (
                <CategoryAdditionalInfo />
            ) : (
                <>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleEditName}>
                        <FontAwesome name="edit" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>Edit subcategory name</Text>
                    </TouchableOpacity>
                    {subCategory.notes.length > 0 && (
                        <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleRemoveAllNotes}>
                            <FontAwesome name="trash" style={menuOverlayStyles.icons} />
                            <Text style={menuOverlayStyles.text}>Remove all notes from subcategory</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMoveCategory}>
                        <Entypo name="select-arrows" style={[menuOverlayStyles.icons]} />
                        <Text style={menuOverlayStyles.text}>Reorder subcategory</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleShowSecureNote}>
                        <FontAwesome name="key" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>{getSecureItemsText()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMakeSecureCategory}>
                        <FontAwesome name="lock" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>{makeCategorySecureText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleDeleteCategory}>
                        <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                        <Text style={menuOverlayStyles.text}>Delete subcategory</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAdditionalInfoPress}>
                        <MaterialIcons name="read-more" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>See subcategory details</Text>
                    </TouchableOpacity>
                </>
            )}
            {deleteModalVisible && (
                <DeleteModal
                    deleteInfo={deleteInfo}
                    deleteModalVisible={deleteModalVisible}
                    setDeleteModalVisible={setDeleteModalVisible}
                />
            )}
            {isCategoryModal && (
                <CategoryModal
                    newCatModalVisible={isCategoryModal}
                    setNewCatModalVisible={setIsCategoryModal}
                    catInfo={catModalInfo}
                />
            )}
        </>
    );
};

export default SubCategoryMainMenu;
