import React, { useEffect, useState } from "react";
import menuOverlayStyles from "../styles/menuOverlayStyles";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { AppDispatch } from "../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store/store";
import { addDontForgetMe, updateMenuOverlay, updateNote, updateNoteSecureStatus } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import DeleteModal from "./DeleteModal";
import { DeleteInfo, DontForgetMeConfig, reminderID } from "../types";
import * as LocalAuthentication from "expo-local-authentication";
import AdjustingCategories from "./AdjustingCategories";
import NoteAdditionalInfo from "./NoteAdditionalInfo";
import PickDateTimeModal from "./PickDateTimeModal";
import * as Notifications from "expo-notifications";

interface TileProps {}

const NoteMainMenu: React.FC<TileProps> = ({}) => {
    const dispatch = useDispatch<AppDispatch>();

    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const heightData = useSelector((state: RootState) => state.memory.heightData);
    const note = useSelector((state: RootState) => state.memory.notes[overlay.menuData.noteID]);
    const subCategory = useSelector((state: RootState) => state.memory.subCategories[overlay.menuData.subCategoryID]);
    const category = useSelector((state: RootState) => state.memory.categories[overlay.menuData.categoryID]);
    const dontForgetMeList = useSelector((state: RootState) => state.memory.dontForgetMe);

    const [isAdjustingCategories, setIsAdjustingCategories] = useState(false);
    const [isAdditionalInfo, setIsAdditionalInfo] = useState(false);
    const [isDontForgetMe, setIsDontForgetMe] = useState(false);
    const [editReminder, setEditReminder] = useState(false);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo>({
        deleteType: "",
        deleteMessage: "",
        additionalMessage: "",
    });

    const hasDontForgetMe = () => {
        return dontForgetMeList[note.id];
    };

    const handleDontForgetMe = () => {
        if (hasDontForgetMe()) {
            const config: DontForgetMeConfig = {
                noteID: note.id,
                subCategoryID: subCategory ? subCategory.id : "",
                categoryID: category.id,
                date: "",
            };
            dispatch(addDontForgetMe(config));
            return;
        }

        setIsDontForgetMe(true);
    };

    const handleHighPriorityPress = () => {
        const noteCopy = { ...note };
        noteCopy.priority = noteCopy.priority !== "high" ? "high" : "normal";
        dispatch(updateNote(noteCopy));
    };

    const handleMakeSecure = () => {
        adjustNoteSecurity();
    };

    const adjustNoteSecurity = async () => {
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
                    dispatch(updateNoteSecureStatus(note.id));
                }
            }
        }
    };

    const handleDelete = () => {
        setDeleteModalVisible(true);
        const deleteInfo: DeleteInfo = {
            deleteType: "deleteNote",
            deleteMessage: "Are you sure you want to delete?",
            additionalMessage: "",
        };

        if (note.locations.length > 1) {
            deleteInfo.deleteMessage =
                "The note you are about to delete exists in other categories. If you delete, it will be removed from those too. If you only want to remove it from this category then use the move between categories option instead.";
        }

        if (note.notificationID && category.id !== reminderID) {
            deleteInfo.deleteMessage = "The note has a reminder set, deleting will also delete the reminder.";
        }

        setDeleteInfo(deleteInfo);
    };

    const handleAddRemoveCategories = () => {
        setIsAdjustingCategories(true);
    };

    const handleAdditionalInfoPress = () => {
        setIsAdditionalInfo(true);
    };

    const handleEditReminder = async () => {
        await Notifications.cancelScheduledNotificationAsync(note.notificationID);
        const noteCopy = { ...note };
        noteCopy.notificationID = "";
        noteCopy.notificationTime = "";
        dispatch(updateNote(noteCopy));
        setEditReminder(true);
    };

    return (
        <>
            {isAdjustingCategories ? (
                <AdjustingCategories />
            ) : editReminder ? (
                <PickDateTimeModal
                    modalType="reminder"
                    setPickDateTimeModalVisible={setEditReminder}
                    pickDateTimeModalVisible={editReminder}
                    ids={{
                        categoryID: category.id,
                        noteID: note.id,
                        subCategoryID: "",
                    }}
                />
            ) : isAdditionalInfo ? (
                <NoteAdditionalInfo />
            ) : isDontForgetMe ? (
                <PickDateTimeModal
                    modalType="dontForgetMe"
                    setPickDateTimeModalVisible={setIsDontForgetMe}
                    pickDateTimeModalVisible={isDontForgetMe}
                    ids={{
                        categoryID: category.id,
                        noteID: note.id,
                        subCategoryID: subCategory ? subCategory.id : "",
                    }}
                />
            ) : (
                <>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAddRemoveCategories}>
                        <FontAwesome name="reorder" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>Move between categories</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleHighPriorityPress}>
                        <FontAwesome name="star" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>Mark as high priority</Text>
                    </TouchableOpacity>
                    {category.id !== reminderID && (
                        <>
                            {!overlay.menuData.isSearchTile && (
                                <TouchableOpacity
                                    style={menuOverlayStyles.menuItemContainer}
                                    onPress={handleDontForgetMe}
                                >
                                    <Ionicons name="notifications-outline" style={menuOverlayStyles.icons} />
                                    <Text style={menuOverlayStyles.text}>
                                        {hasDontForgetMe() ? "Remove dont-forget-me reminder" : "Don't forget me"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleMakeSecure}>
                                <FontAwesome name="lock" style={menuOverlayStyles.icons} />
                                {!note.isSecureNote && <Text style={menuOverlayStyles.text}>Make secure note</Text>}
                                {note.isSecureNote && <Text style={menuOverlayStyles.text}>Unsecure note</Text>}
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleDelete}>
                        <FontAwesome name="times" style={[menuOverlayStyles.icons, menuOverlayStyles.crossIcon]} />
                        <Text style={menuOverlayStyles.text}>Delete note</Text>
                    </TouchableOpacity>
                    {category.id === reminderID && (
                        <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleEditReminder}>
                            <FontAwesome name="clock-o" style={[menuOverlayStyles.icons]} />
                            <Text style={menuOverlayStyles.text}>Edit reminder time</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={menuOverlayStyles.menuItemContainer} onPress={handleAdditionalInfoPress}>
                        <MaterialIcons name="read-more" style={menuOverlayStyles.icons} />
                        <Text style={menuOverlayStyles.text}>See note details</Text>
                    </TouchableOpacity>
                </>
            )}
            {deleteModalVisible && (
                <DeleteModal
                    setDeleteModalVisible={setDeleteModalVisible}
                    deleteModalVisible={deleteModalVisible}
                    deleteInfo={deleteInfo}
                />
            )}
        </>
    );
};

export default NoteMainMenu;
