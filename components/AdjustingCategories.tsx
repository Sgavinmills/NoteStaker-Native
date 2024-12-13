import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import adjustCatsStyles from "../styles/adjustingCategoriesStyles";
import { FontAwesome6 } from "@expo/vector-icons";
import { AppDispatch } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
    addNoteToCategory,
    addNoteToSubCategory,
    removeNoteFromCategory,
    removeNoteFromSubCategory,
} from "../redux/slice";
import { RootState } from "../redux/store/store";
import theme from "../styles/constants";
import { DeleteInfo, IDs, reminderID } from "../types";
import PickDateTimeModal from "./PickDateTimeModal";
import DeleteModal from "./DeleteModal";

interface TileProps {}

// TODO  - WE can remove dependency on subCategories as we can get the info off the note now
// Harder to remove categories though so not urgent to do atm.

// AdjustingCategories is the menu view for moving notes between categories
const AdjustingCategories: React.FC<TileProps> = ({}) => {
    const categories = useSelector((state: RootState) => state.memory.categories);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const categoryList = useSelector((state: RootState) => state.memory.categoryList);
    const showingSecure = useSelector((state: RootState) => state.memory.canShowSecure.homeScreen);
    const note = useSelector((state: RootState) => state.memory.notes[overlay.menuData.noteID]);

    const [errorMessage, setErrorMessage] = useState("");
    const [parentCatToDisplaySubsOf, setParentCatToDisplaySubsOf] = useState(overlay.menuData.categoryID);
    const [displayMainCategories, setDisplayMainCategories] = useState(overlay.menuData.subCategoryID ? false : true);
    const [pickDateTimeModalVisible, setPickDateTimeModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo>({
        deleteMessage: "",
        deleteType: "",
        additionalMessage: "",
        deleteFunction: () => {},
    });

    const dispatch = useDispatch<AppDispatch>();

    const subCatTabsToDisplay: string[] = [];
    const catTabsToDisplay: string[] = [];
    if (!displayMainCategories) {
        categories[parentCatToDisplaySubsOf].subCategories.forEach((subCatRef) => {
            if (showingSecure || !subCatRef.isSecure) {
                subCatTabsToDisplay.push(subCatRef.id);
            }
        });
    } else {
        categoryList.forEach((catRef) => {
            if (showingSecure || !catRef.isSecure) {
                catTabsToDisplay.push(catRef.id);
            }
        });
    }

    const handleSubCategoryClick = (subCategoryID: string) => {
        // check if note exists in subcategory we've clicked on
        const noteAlreadyInThisSubCategory = note.locations.some((loc) => loc[1] === subCategoryID);
        // means we're doing a removal
        if (noteAlreadyInThisSubCategory) {
            // does it exist in other categories or sub categories?
            const existsElsewhere = note.locations.length > 1;
            if (existsElsewhere) {
                const ids: IDs = {
                    noteID: note.id,
                    subCategoryID: subCategoryID,
                    categoryID: "",
                };
                dispatch(removeNoteFromSubCategory(ids));
            } else {
                setErrorMessage("Can't remove from only category. Note would be deleted.");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
        } else {
            // add the note
            const ids: IDs = {
                noteID: note.id,
                subCategoryID: subCategoryID,
                categoryID: parentCatToDisplaySubsOf,
            };
            dispatch(addNoteToSubCategory(ids));
        }
    };

    const removeFromReminders = () => {
        const ids: IDs = {
            noteID: note.id,
            subCategoryID: "",
            categoryID: reminderID,
        };
        dispatch(removeNoteFromCategory(ids));
        setDeleteModalVisible(false);
    };

    const handleMainCategoryClick = (categoryID: string) => {
        // if category does not have sub cats then do a state update to put the note into this category.
        if (categories[categoryID].subCategories.length === 0) {
            // check if note exists in category we've clicked on
            const noteAlreadyInThisCategory = note.locations.some((loc) => loc[0] === categoryID);
            // means we're doing a removal
            if (noteAlreadyInThisCategory) {
                // does it exist in other categories or sub categories?
                const existsElsewhere = note.locations.length > 1;
                if (existsElsewhere) {
                    if (categoryID === reminderID) {
                        // if its a reminder then get confirmation before removing (as it will trigger removal of notification)
                        // also check if note has expired - if it has can just remove from category normally
                        const currentTime = new Date();
                        const reminderTime = new Date(note.notificationTime);
                        if (reminderTime.getTime() > currentTime.getTime()) {
                            setDeleteModalVisible(true);
                            setDeleteInfo({
                                deleteMessage: "Removing from Reminders will delete any scheduled notification",
                                additionalMessage: "",
                                deleteFunction: removeFromReminders,
                            });
                            return;
                        }
                    }

                    const ids: IDs = {
                        noteID: note.id,
                        subCategoryID: "",
                        categoryID: categoryID,
                    };
                    dispatch(removeNoteFromCategory(ids));
                } else {
                    setErrorMessage("Can't remove from only category. Note would be deleted.");
                    setTimeout(() => {
                        setErrorMessage("");
                    }, 500);
                }
            } else {
                // add the note
                if (categoryID === reminderID) {
                    // if its a reminder enforce setting of a reminder time
                    setPickDateTimeModalVisible(true);
                }

                const ids: IDs = {
                    noteID: note.id,
                    subCategoryID: "",
                    categoryID: categoryID,
                };
                dispatch(addNoteToCategory(ids));
            }
            return;
        }

        // if it does have sub cats then display those instead
        setParentCatToDisplaySubsOf(categoryID);
        setDisplayMainCategories(false);
    };

    const isInMainCategory = (categoryID: string): boolean => {
        if (categories[categoryID].notes.some((noteRef) => noteRef.id === overlay.menuData.noteID)) {
            return true;
        }

        return categories[categoryID].subCategories.some((subCatRef) => {
            return subCategories[subCatRef.id].notes.some((noteRef) => noteRef.id === overlay.menuData.noteID);
        });
    };

    const isInSubCategory = (subCategoryID: string): boolean => {
        if (subCategories[subCategoryID].notes.some((noteRef) => noteRef.id === overlay.menuData.noteID)) {
            return true;
        }
        return false;
    };

    const handleUpLevel = () => {
        setDisplayMainCategories(true);
    };

    return (
        <>
            {deleteModalVisible && (
                <DeleteModal
                    deleteInfo={deleteInfo}
                    deleteModalVisible={deleteModalVisible}
                    setDeleteModalVisible={setDeleteModalVisible}
                />
            )}
            <PickDateTimeModal
                setPickDateTimeModalVisible={setPickDateTimeModalVisible}
                pickDateTimeModalVisible={pickDateTimeModalVisible}
                modalType={"reminder"}
                ids={{
                    noteID: note.id,
                    categoryID: reminderID,
                    subCategoryID: "",
                }}
            />
            <View style={adjustCatsStyles.container}>
                {displayMainCategories && (
                    <>
                        {catTabsToDisplay.map((categoryID) => {
                            return (
                                <TouchableOpacity
                                    key={categoryID}
                                    style={[
                                        adjustCatsStyles.tab,
                                        isInMainCategory(categoryID) && adjustCatsStyles.tabSelected,
                                    ]}
                                    onPress={() => {
                                        handleMainCategoryClick(categoryID);
                                    }}
                                >
                                    <Text style={adjustCatsStyles.text}>{categories[categoryID].name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </>
                )}
                {!displayMainCategories && (
                    <>
                        {subCatTabsToDisplay.map((subCategoryID) => {
                            return (
                                <TouchableOpacity
                                    key={subCategoryID}
                                    style={[
                                        adjustCatsStyles.subTab,
                                        isInSubCategory(subCategoryID) && adjustCatsStyles.tabSelected,
                                    ]}
                                    onPress={() => {
                                        handleSubCategoryClick(subCategoryID);
                                    }}
                                >
                                    <Text style={adjustCatsStyles.text}>{subCategories[subCategoryID].name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                        <TouchableOpacity
                            style={[adjustCatsStyles.tab, adjustCatsStyles.arrow]}
                            onPress={() => {
                                handleUpLevel();
                            }}
                        >
                            <FontAwesome6 name="arrow-turn-up" size={24} color={theme.colors.categoryText} />
                        </TouchableOpacity>
                    </>
                )}

                {errorMessage && <Text style={adjustCatsStyles.errorText}>{errorMessage}</Text>}
            </View>
        </>
    );
};

export default AdjustingCategories;
