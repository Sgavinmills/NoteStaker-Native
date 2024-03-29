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
    setIsCategoryMainMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryMainMenu: React.FC<TileProps> = ({ setIsMoveArrows, setIsCategoryMainMenu }) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const memory = useSelector((state: RootState) => state.memory);
    const [catModalInfo, setCatModalInfo] = useState({ currentName: "", parentCat: "" });
    const catName = overlay.menuType === "category" ? "category" : "sub-category";

    const handleEditName = () => {
        setCatModalInfo({
            currentName: getNameOfMenu(),
            parentCat: overlay.menuType === "subCategory" ? overlay.menuData.categoryID : "",
        });
        setIsCategoryModal(true);
    };

    const getNameOfMenu = () => {
        if (overlay.menuType === "category") {
            return memory.categories[overlay.menuData.categoryID].name;
        }

        if (overlay.menuType === "subCategory") {
            return memory.subCategories[overlay.menuData.subCategoryID].name;
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

    const dispatch = useDispatch<AppDispatch>();
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
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="trash" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Remove all notes from {catName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                <Text style={menuOverlayStyles.text}>Delete {catName}</Text>
            </TouchableOpacity>

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
