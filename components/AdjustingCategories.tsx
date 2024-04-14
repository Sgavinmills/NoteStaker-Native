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
import { IDs } from "../types";

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

    const dispatch = useDispatch<AppDispatch>();
    const note = useSelector((state: RootState) => state.memory.notes[overlay.menuData.noteID]);
    const [parentCatToDisplaySubsOf, setParentCatToDisplaySubsOf] = useState(overlay.menuData.categoryID);
    const [displayMainCategories, setDisplayMainCategories] = useState(overlay.menuData.subCategoryID ? false : true);

    const [errorMessage, setErrorMessage] = useState("");

    const subCatTabsToDisplay: string[] = [];
    const catTabsToDisplay: string[] = [];
    if (!displayMainCategories) {
        console.log("1");
        categories[parentCatToDisplaySubsOf].subCategories.forEach((subCatRef) => {
            if (showingSecure || !subCatRef.isSecure) {
                subCatTabsToDisplay.push(subCatRef.id);
            }
        });
    } else {
        console.log("2");

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

    const handleMainCategoryClick = (categoryID: string) => {
        // if category does not have sub cats then just do a state update to put the note into this category.
        if (categories[categoryID].subCategories.length === 0) {
            // check if note exists in subcategory we've clicked on
            const noteAlreadyInThisCategory = note.locations.some((loc) => loc[0] === categoryID);
            // means we're doing a removal
            if (noteAlreadyInThisCategory) {
                // does it exist in other categories or sub categories?
                const existsElsewhere = note.locations.length > 1;
                if (existsElsewhere) {
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
    );
};

export default AdjustingCategories;
