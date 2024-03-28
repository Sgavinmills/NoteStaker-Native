import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import CategoryModal from "./CategoryModal";

interface TileProps {
    setIsMoveArrows: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCategoryMainMenu: React.Dispatch<React.SetStateAction<boolean>>;
    categoryID: string;
}

const CategoryMainMenu: React.FC<TileProps> = ({ categoryID, setIsMoveArrows, setIsCategoryMainMenu }) => {
    const handleEditName = () => {
        setIsCategoryModal(true);
    };
    const handleMoveCategory = () => {
        setIsMoveArrows(true);
        setIsCategoryMainMenu(false);
    };

    const dispatch = useDispatch<AppDispatch>();
    const [isCategoryModal, setIsCategoryModal] = useState(false);
    return (
        <>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="plus" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Add Sub-Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleEditName}>
                <FontAwesome name="edit" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Edit category name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMoveCategory}>
                <Entypo name="select-arrows" style={[menuOverlayStyles.icons]} />
                <Text style={menuOverlayStyles.text}>Move category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="trash" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Remove all notes from category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer}>
                <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                <Text style={menuOverlayStyles.text}>Delete category</Text>
            </TouchableOpacity>

            {isCategoryModal && (
                <CategoryModal
                    newCatModalVisible={isCategoryModal}
                    setNewCatModalVisible={setIsCategoryModal}
                    categoryID={categoryID}
                />
            )}
        </>
    );
};

export default CategoryMainMenu;
