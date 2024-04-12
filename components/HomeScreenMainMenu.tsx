import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import CategoryModal from "./CategoryModal";

interface TileProps {
    setIsHomeScreenMainMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setCloseAllCategories: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeScreenMainMenu: React.FC<TileProps> = ({ setIsHomeScreenMainMenu, setCloseAllCategories }) => {
    const [isCategoryModal, setIsCategoryModal] = useState(false);
    const [catModalInfo, setCatModalInfo] = useState({ currentName: "", parentCat: "" });

    const handleAddCategoryPress = () => {
        setCatModalInfo({ currentName: "", parentCat: "" });
        setIsCategoryModal(true);
    };

    const handleCloseAllCategoriesPress = () => {
        setCloseAllCategories(true);
    };
    const handleViewSecureCategoriesPress = () => {
        console.log("ViewSecureCategoriesPress");
    };
    const handleBackupDataPress = () => {
        console.log("addBackupDataPress");
    };
    const handleImportDataPress = () => {
        console.log("ImportDataPress");
    };

    return (
        <>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAddCategoryPress}>
                <FontAwesome name="plus" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Add new category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleCloseAllCategoriesPress}>
                <FontAwesome name="minus" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Close all categories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleViewSecureCategoriesPress}>
                <FontAwesome name="lock" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>View secure categories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleBackupDataPress}>
                <Entypo name="save" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Backup Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleImportDataPress}>
                <FontAwesome name="save" style={[menuOverlayStyles.icons]} />
                <Text style={menuOverlayStyles.text}>Import Data</Text>
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

export default HomeScreenMainMenu;
