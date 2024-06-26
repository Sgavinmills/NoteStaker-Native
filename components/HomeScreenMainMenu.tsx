import React, { useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import CategoryModal from "./CategoryModal";
import { DeleteInfo } from "../types";
import DeleteModal from "./DeleteModal";
import * as LocalAuthentication from "expo-local-authentication";
import { migrateData, toggleHomeScreenShowingSecureCategories, updateMenuOverlay } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { RootState } from "../redux/store/store";
import { useSelector } from "react-redux";

interface TileProps {
    setCloseAllCategories: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeScreenMainMenu: React.FC<TileProps> = ({ setCloseAllCategories }) => {
    const homeScreenShowSecure = useSelector((state: RootState) => state.memory.canShowSecure.homeScreen);

    const [isCategoryModal, setIsCategoryModal] = useState(false);
    const [catModalInfo, setCatModalInfo] = useState({ currentName: "", parentCat: "" });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo>({
        deleteMessage: "",
        deleteType: "",
        additionalMessage: "",
    });
    const dispatch = useDispatch<AppDispatch>();

    const handleAddCategoryPress = () => {
        setCatModalInfo({ currentName: "", parentCat: "" });
        setIsCategoryModal(true);
    };

    const handleCloseAllCategoriesPress = () => {
        setCloseAllCategories(true);
    };
    const handleViewSecureCategoriesPress = () => {
        if (homeScreenShowSecure) {
            dispatch(toggleHomeScreenShowingSecureCategories());
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
        showSecureCategories();
    };

    const showSecureCategories = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (compatible) {
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (enrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Authenticate to continue",
                });
                if (result.success) {
                    dispatch(toggleHomeScreenShowingSecureCategories());
                    dispatch(updateMenuOverlay(getEmptyOverlay()));
                }
            }
        }
    };

    const handleBackupDataPress = () => {
        const deleteInfo: DeleteInfo = {
            deleteType: "backupData",
            deleteMessage:
                "Save a copy of note data to phone? This will not be encrypted and technically viewable to anyone with access to your phone",
            additionalMessage: "",
        };

        setDeleteInfo(deleteInfo);
        setDeleteModalVisible(true);
    };
    const handleImportDataPress = () => {
        const deleteInfo: DeleteInfo = {
            deleteType: "importData",
            deleteMessage:
                "You are about to import data from a backup file. All current data stored in the app will be overwritten. Ensure you have backed up data first.",
            additionalMessage: "",
        };

        setDeleteInfo(deleteInfo);
        setDeleteModalVisible(true);
    };

    // TODO ADD WARNINGS, MAKE SECURE, MAKE ONLY AVAILABLE WHEN REQUIRED ETC.
    const handleMigrateData = () => {
        dispatch(migrateData());
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
                {homeScreenShowSecure && <Text style={menuOverlayStyles.text}>Hide secure categories and notes</Text>}
                {!homeScreenShowSecure && <Text style={menuOverlayStyles.text}>View secure categories and notes</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleBackupDataPress}>
                <Entypo name="save" style={menuOverlayStyles.icons} />
                <Text style={menuOverlayStyles.text}>Backup Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleImportDataPress}>
                <FontAwesome name="save" style={[menuOverlayStyles.icons]} />
                <Text style={menuOverlayStyles.text}>Import Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMigrateData}>
                <FontAwesome name="warning" style={[menuOverlayStyles.icons]} />
                <Text style={menuOverlayStyles.text}>Migrate Data</Text>
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

export default HomeScreenMainMenu;
