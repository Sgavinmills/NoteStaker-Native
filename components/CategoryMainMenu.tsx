import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import CategoryModal from "./CategoryModal";
import { DeleteInfo } from "../types";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import {} from "../redux/slice";
import DeleteModal from "./DeleteModal";

interface TileProps {
    setIsMoveArrows: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCategoryMainMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setScrollTo: React.Dispatch<React.SetStateAction<number | null>>;
}

// CategoryMainMenu provides main menu for parent categories and sub categories
const CategoryMainMenu: React.FC<TileProps> = ({ setIsMoveArrows, setIsCategoryMainMenu, setScrollTo }) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const categories = useSelector((state: RootState) => state.memory.categories);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const heightData = useSelector((state: RootState) => state.memory.heightData);

    const [catModalInfo, setCatModalInfo] = useState({ currentName: "", parentCat: "" });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo>({ deleteMessage: "", deleteType: "" });

    const catName = overlay.menuType === "category" ? "category" : "sub-category";

    const showRemoveAllOption = () => {
        if (overlay.menuType === "subCategory") {
            return true;
        }

        return categories[overlay.menuData.categoryID].subCategories.length === 0;
    };
    const handleEditName = () => {
        setCatModalInfo({
            currentName: getNameOfMenu(),
            parentCat: overlay.menuType === "subCategory" ? overlay.menuData.categoryID : "",
        });
        setIsCategoryModal(true);
    };

    const getNameOfMenu = () => {
        if (overlay.menuType === "category") {
            return categories[overlay.menuData.categoryID].name;
        }

        if (overlay.menuType === "subCategory") {
            return subCategories[overlay.menuData.subCategoryID].name;
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
        if (overlay.menuType === "category") {
            catName = categories[overlay.menuData.categoryID].name;
        } else {
            catName = subCategories[overlay.menuData.subCategoryID].name;
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
        if (overlay.menuType === "category") {
            catName = categories[overlay.menuData.categoryID].name;
        } else {
            catName = subCategories[overlay.menuData.subCategoryID].name;
        }

        deleteInfo.deleteMessage = `Are you sure you want to delete the category ${catName}? All notes not within other categories will be permenantly deleted`;

        setDeleteInfo(deleteInfo);
        setDeleteModalVisible(true);
    };

    const handleScrollTo = () => {
        if (overlay.menuType === "category") {
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
                    const numOfSubs = categories[overlay.menuData.categoryID].subCategories.length;
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
            {showRemoveAllOption() && (
                <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleRemoveAllNotes}>
                    <FontAwesome name="trash" style={menuOverlayStyles.icons} />
                    <Text style={menuOverlayStyles.text}>Remove all notes from {catName}</Text>
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
