import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import CategoryModal from "./CategoryModal";
import { DeleteInfo } from "../types";
import { AppDispatch } from "../redux/store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { addToShowSecureNote, updateMenuOverlay } from "../redux/slice";
import DeleteModal from "./DeleteModal";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import * as LocalAuthentication from "expo-local-authentication";

interface TileProps {
    setIsMoveArrows: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCategoryMainMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setScrollTo: React.Dispatch<React.SetStateAction<number | null>>;
}

// CategoryMainMenu provides main menu for parent categories and sub categories
const CategoryMainMenu: React.FC<TileProps> = ({ setIsMoveArrows, setIsCategoryMainMenu, setScrollTo }) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);

    const isCategory = overlay.menuType === "category" ? true : false;
    const category = useSelector((state: RootState) => state.memory.categories[overlay.menuData.categoryID]);
    const subCategory = isCategory
        ? null
        : useSelector((state: RootState) => state.memory.subCategories[overlay.menuData.subCategoryID]);
    const heightData = useSelector((state: RootState) => state.memory.heightData);
    const dispatch = useDispatch<AppDispatch>();

    const [catModalInfo, setCatModalInfo] = useState({ currentName: "", parentCat: "" });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo>({ deleteMessage: "", deleteType: "" });

    const catName = isCategory ? "category" : "sub-category";
    const openCategoryID = isCategory ? overlay.menuData.categoryID : overlay.menuData.subCategoryID;

    // whether to show any options that depend on the category having notes or not
    const showNoteSpecificOptions = () => {
        if (!isCategory) {
            return true;
        }

        return category.subCategories.length === 0;
    };
    const handleEditName = () => {
        setCatModalInfo({
            currentName: getNameOfMenu(),
            parentCat: overlay.menuType === "subCategory" ? overlay.menuData.categoryID : "",
        });
        setIsCategoryModal(true);
    };

    const getNameOfMenu = () => {
        if (!subCategory) {
            return category.name;
        }

        if (subCategory) {
            return subCategory.name;
        }

        return "";
    };

    const handleMoveCategory = () => {
        setIsMoveArrows(true);
        setIsCategoryMainMenu(false);
    };

    const handleAddSubCat = () => {
        setCatModalInfo({ currentName: "", parentCat: overlay.menuData.categoryID });
        setIsCategoryModal(true);
    };

    const handleRemoveAllNotes = () => {
        const deleteInfo: DeleteInfo = {
            deleteType: "removeAll",
            deleteMessage: "",
        };

        let catName: string;
        if (!subCategory) {
            catName = category.name;
        } else {
            catName = subCategory.name;
        }

        deleteInfo.deleteMessage = `Are you sure you want to remove all notes from ${catName}? All notes not within other categories will be permenantly deleted`;
        setDeleteInfo(deleteInfo);
        setDeleteModalVisible(true);
    };

    const handleDeleteCategory = () => {
        const deleteInfo: DeleteInfo = {
            deleteType: "deleteCategory",
            deleteMessage: "",
        };

        let catName: string;
        if (!subCategory) {
            catName = category.name;
        } else {
            catName = subCategory.name;
        }

        deleteInfo.deleteMessage = `Are you sure you want to delete the category ${catName}? All notes not within other categories will be permenantly deleted`;

        setDeleteInfo(deleteInfo);
        setDeleteModalVisible(true);
    };

    const handleShowSecureNote = () => {
        showSecureNotes();
    };

    const showSecureNotes = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (compatible) {
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (enrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Authenticate to continue",
                });
                if (result.success) {
                    dispatch(addToShowSecureNote(openCategoryID));
                    dispatch(updateMenuOverlay(getEmptyOverlay()));
                }
            }
        }
    };

    const handleScrollTo = () => {
        if (!subCategory) {
            let offset = 0;
            const categoryIndex = overlay.menuData.categoryIndex;
            if (categoryIndex != null && categoryIndex >= 0) {
                for (let i = 0; i < categoryIndex; i++) {
                    offset += heightData[i].catHeight;
                }
            }

            setScrollTo(offset);
        } else {
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
        }
    };

    const [isCategoryModal, setIsCategoryModal] = useState(false);
    return (
        <>
            {overlay.menuType === "category" && (
                <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAddSubCat}>
                    <FontAwesome name="plus" style={menuOverlayStyles.icons} />
                    <Text style={menuOverlayStyles.text}>Add Sub-Category</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleEditName}>
                <FontAwesome name="edit" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Edit {catName} name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMoveCategory}>
                <Entypo name="select-arrows" style={[menuOverlayStyles.icons]} />
                <Text style={menuOverlayStyles.text}>Move {catName}</Text>
            </TouchableOpacity>
            {showNoteSpecificOptions() && (
                <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleRemoveAllNotes}>
                    <FontAwesome name="trash" style={menuOverlayStyles.icons} />
                    <Text style={menuOverlayStyles.text}>Remove all notes from {catName}</Text>
                </TouchableOpacity>
            )}
            {showNoteSpecificOptions() && (
                <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleShowSecureNote}>
                    <FontAwesome name="lock" style={menuOverlayStyles.icons} />
                    <Text style={menuOverlayStyles.text}>Show secure notes</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleDeleteCategory}>
                <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                <Text style={menuOverlayStyles.text}>Delete {catName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleScrollTo}>
                <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                <Text style={menuOverlayStyles.text}>SCROLL TO</Text>
            </TouchableOpacity>
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
