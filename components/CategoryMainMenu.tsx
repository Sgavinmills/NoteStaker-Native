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
} from "../redux/slice";
import DeleteModal from "./DeleteModal";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import * as LocalAuthentication from "expo-local-authentication";
import CategoryAdditionalInfo from "./CategoryAdditionalInfo";

interface TileProps {
    setScrollTo: React.Dispatch<React.SetStateAction<number | null>>;
}

// CategoryMainMenu provides main menu for parent categories and sub categories
const CategoryMainMenu: React.FC<TileProps> = ({ setScrollTo }) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const showingSecureCategories = useSelector((state: RootState) => state.memory.canShowSecure.categories);

    const category = useSelector((state: RootState) => state.memory.categories[overlay.menuData.categoryID]);

    const heightData = useSelector((state: RootState) => state.memory.heightData);
    const dispatch = useDispatch<AppDispatch>();

    const [isAdditionalInfo, setIsAdditionalInfo] = useState(false);
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
            currentName: category.name,
            parentCat: "",
        });
        setIsCategoryModal(true);
    };

    const handleAddSubCat = () => {
        setCatModalInfo({ currentName: "", parentCat: category.id });
        setIsCategoryModal(true);
    };

    const handleRemoveAllNotes = () => {
        const deleteInfo: DeleteInfo = {
            deleteType: "removeAll",
            deleteMessage: "",
            additionalMessage: "",
        };

        let name = category.name;
        deleteInfo.deleteMessage = `Are you sure you want to remove all notes from ${name}? All notes not within other categories will be permenantly deleted`;

        if (category.notes.some((noteRef) => noteRef.isSecure === true)) {
            deleteInfo.additionalMessage = `There are secure notes in this category that will be deleted`;
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

        let catName = category.name;

        deleteInfo.deleteMessage = `Are you sure you want to delete the category ${catName}? All notes not within other categories will be permenantly deleted`;

        if (category.subCategories.length === 0) {
            if (category.notes.some((noteRef) => noteRef.isSecure === true)) {
                deleteInfo.additionalMessage = `There are secure notes in this category that will be deleted`;
            }
        } else {
            // need to know if the subcategories have any secure notes.
            if (category.subCategories.some((subCatRef) => subCatRef.isSecure === true)) {
                deleteInfo.additionalMessage = `There are secure subcategories in this category that will be deleted`;
            } else {
                // cant get any more specific than this without having access to subCategories
                deleteInfo.additionalMessage = `There may be secure notes in the subcategories that will be deleted`;
            }
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
                    dispatch(updateCategorySecureStatus(overlay.menuData.categoryID));
                }
            }
        }
    };

    const handleShowSecureNote = () => {
        showSecureNotes();
    };

    const showSecureNotes = async () => {
        if (showingSecureCategories.includes(category.id)) {
            dispatch(removeFromShowSecureNote(category.id));
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
                    dispatch(addToShowSecureNote(category.id));
                }
            }
        }
    };

    // useEffect(() => {
    //     handleScrollTo();
    // }, []);

    const handleScrollTo = () => {
        let offset = 0;
        const categoryIndex = overlay.menuData.categoryIndex;
        if (categoryIndex != null && categoryIndex >= 0) {
            for (let i = 0; i < categoryIndex; i++) {
                if (heightData[i]) {
                    offset += heightData[i].catHeight;
                }
            }
        }

        setScrollTo(offset);
    };

    // too much for one line, can be made nicer but in a rush.
    const makeCategorySecure = (): string => {
        if (category.isSecure) {
            return "Unsecure category";
        } else {
            return "Make category secure";
        }
    };

    const handleAdditionalInfoPress = () => {
        setIsAdditionalInfo(true);
    };

    const makeCategorySecureText = makeCategorySecure();

    const getSecureItemsText = () => {
        if (showingSecureCategories.includes(category.id)) {
            if (category.subCategories.length > 0) {
                return "Hide secure subcategories";
            }

            return "Hide secure notes";
        } else {
            // show text
            if (category.subCategories.length > 0) {
                return "Show secure subcategories";
            }
            return "Show secure notes";
        }
    };

    return (
        <>
            {isAdditionalInfo ? (
                <CategoryAdditionalInfo />
            ) : (
                <>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAddSubCat}>
                        <FontAwesome name="plus" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>Add subcategory</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleEditName}>
                        <FontAwesome name="edit" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>Edit category name</Text>
                    </TouchableOpacity>
                    {category.notes.length > 0 && (
                        <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleRemoveAllNotes}>
                            <FontAwesome name="trash" style={menuOverlayStyles.icons} />
                            <Text style={menuOverlayStyles.text}>Remove all notes from category</Text>
                        </TouchableOpacity>
                    )}
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
                        <Text style={menuOverlayStyles.text}>Delete category</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAdditionalInfoPress}>
                        <MaterialIcons name="read-more" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>See category details</Text>
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

export default CategoryMainMenu;
