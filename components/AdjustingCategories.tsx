import React, { useState } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import adjustCatsStyles from "../styles/adjustingCategoriesStyles";
import { FontAwesome6 } from "@expo/vector-icons";
import { AppDispatch } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory, updateSubCategory } from "../redux/slice";
import { RootState } from "../redux/store/store";
import { noteExistsInOtherCategories } from "../utilFuncs/utilFuncs";
import theme from "../styles/constants";
import SubtleMessage from "./SubtleMessage";

interface TileProps {}

// AdjustingCategories is the menu view for moving notes between categories
const AdjustingCategories: React.FC<TileProps> = ({}) => {
    const categories = useSelector((state: RootState) => state.memory.categories);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const categoryList = useSelector((state: RootState) => state.memory.categoryList);
    const dispatch = useDispatch<AppDispatch>();

    const [parentCatToDisplaySubsOf, setParentCatToDisplaySubsOf] = useState(overlay.menuData.categoryID);
    const [showSubtleMessage, setShowSubtleMessage] = useState(false);
    const [displayMainCategories, setDisplayMainCategories] = useState(overlay.menuData.subCategoryID ? false : true);

    const handleSubCategoryClick = (subCategoryID: string) => {
        const subCategoryCopy = { ...subCategories[subCategoryID] };
        const notesCopy = [...subCategoryCopy.notes];
        const index = notesCopy.indexOf(overlay.menuData.noteID);
        if (index > -1) {
            // since were taking out, just check it exists elsewhere first and dont o anything if not
            if (
                !noteExistsInOtherCategories(categories, subCategories, overlay.menuData.noteID, null, [subCategoryID])
            ) {
                setShowSubtleMessage(true);
                setTimeout(() => {
                    setShowSubtleMessage(false);
                }, 500);
                return;
            }

            notesCopy.splice(index, 1);
        } else {
            notesCopy.push(overlay.menuData.noteID);
        }
        subCategoryCopy.notes = notesCopy;
        dispatch(updateSubCategory(subCategoryCopy));
    };

    const handleParentCategoryClick = (categoryID: string) => {
        // if category does not have sub cats then just do a state update to put the note into this category.
        if (categories[categoryID].subCategories.length === 0) {
            const categoryCopy = { ...categories[categoryID] };
            const notesCopy = [...categoryCopy.notes];
            const index = notesCopy.indexOf(overlay.menuData.noteID);
            if (index > -1) {
                if (!noteExistsInOtherCategories(categories, subCategories, overlay.menuData.noteID, categoryID, [])) {
                    setShowSubtleMessage(true);
                    setTimeout(() => {
                        setShowSubtleMessage(false);
                    }, 500);
                    return;
                }
                notesCopy.splice(index, 1);
            } else {
                notesCopy.push(overlay.menuData.noteID);
            }
            categoryCopy.notes = notesCopy;
            dispatch(updateCategory(categoryCopy));
            return;
        }

        setParentCatToDisplaySubsOf(categoryID);
        setDisplayMainCategories(false);
    };

    const isInMainCategory = (categoryID: string): boolean => {
        // TODO: This also needs to check the categories subcats to see if its in there.
        if (categories[categoryID].notes.includes(overlay.menuData.noteID)) {
            return true;
        }

        return categories[categoryID].subCategories.some((subCatID) => {
            return subCategories[subCatID].notes.includes(overlay.menuData.noteID);
        });
    };

    const isInSubCategory = (subCategoryID: string): boolean => {
        if (subCategories[subCategoryID].notes.includes(overlay.menuData.noteID)) {
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
                    {categoryList.map((categoryID) => {
                        return (
                            <TouchableOpacity
                                key={categoryID}
                                style={[
                                    adjustCatsStyles.tab,
                                    isInMainCategory(categoryID) && adjustCatsStyles.tabSelected,
                                ]}
                                onPress={() => {
                                    handleParentCategoryClick(categoryID);
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
                    {categories[parentCatToDisplaySubsOf].subCategories.map((subCategoryID) => {
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
            {showSubtleMessage && (
                <SubtleMessage
                    message="Can't remove from only category"
                    visible={showSubtleMessage}
                    setSubtleMessage={setShowSubtleMessage}
                />
            )}
        </View>
    );
};

export default AdjustingCategories;
