import React, { useState } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import adjustCatsStyles from "../styles/adjustingCategoriesStyles";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { AppDispatch } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory, updateCategoryList, updateMenuOverlay, updateSubCategory } from "../redux/slice";
import { RootState } from "../redux/reducers/reducers";
import { noteExistsInOtherCategories } from "../utilFuncs/utilFuncs";
import theme from "../styles/constants";

interface TileProps {}

// since menuoverlay data wont change we can just extract to easily readable and reusuable consts.

const AdjustingCategories: React.FC<TileProps> = ({}) => {
    const handleSubCategoryClick = (subCategoryID: string) => {
        // basically just check if it is in the notes array and add/remove it accordingly?
        // we still need the check to make sue it exists else where... but we will also need that in cats too.
        const subCategoryCopy = { ...memory.subCategories[subCategoryID] };
        const notesCopy = [...subCategoryCopy.notes];
        const index = notesCopy.indexOf(memory.menuOverlay.menuData.noteID);
        if (index > -1) {
            // since were taking out, just check it exists elsewhere first and dont o anything if not
            if (
                !noteExistsInOtherCategories(
                    memory.categories,
                    memory.subCategories,
                    memory.menuOverlay.menuData.noteID,
                    null,
                    [subCategoryID]
                )
            ) {
                return;
            }

            notesCopy.splice(index, 1);
        } else {
            notesCopy.push(memory.menuOverlay.menuData.noteID);
        }
        subCategoryCopy.notes = notesCopy;
        dispatch(updateSubCategory(subCategoryCopy));
    };

    const handleParentCategoryClick = (categoryID: string) => {
        // if category does not have sub cats then just do a state update to put the note into this category.
        if (memory.categories[categoryID].subCategories.length === 0) {
            const categoryCopy = { ...memory.categories[categoryID] };
            const notesCopy = [...categoryCopy.notes];
            const index = notesCopy.indexOf(memory.menuOverlay.menuData.noteID);
            if (index > -1) {
                if (
                    !noteExistsInOtherCategories(
                        memory.categories,
                        memory.subCategories,
                        memory.menuOverlay.menuData.noteID,
                        categoryID,
                        []
                    )
                ) {
                    return;
                }
                notesCopy.splice(index, 1);
            } else {
                notesCopy.push(memory.menuOverlay.menuData.noteID);
            }
            categoryCopy.notes = notesCopy;
            dispatch(updateCategory(categoryCopy));
            return;
        }

        setParentCatToDisplaySubsOf(categoryID);
        setDisplayMainCategories(false);

        // if category does have subcats then we will turn off displaymaincategories (so presumably switch to displaying subs)
        // will need to tell it which subcats are on display
    };

    const dispatch = useDispatch<AppDispatch>();
    const memory = useSelector((state: RootState) => state.memory);
    const [displayMainCategories, setDisplayMainCategories] = useState(
        memory.menuOverlay.menuData.subCategoryID ? false : true
    );
    memory.menuOverlay.menuData;
    const [parentCatToDisplaySubsOf, setParentCatToDisplaySubsOf] = useState(memory.menuOverlay.menuData.categoryID);
    const isInMainCategory = (categoryID: string): boolean => {
        // TODO: This also needs to check the categories subcats to see if its in there.
        if (memory.categories[categoryID].notes.includes(memory.menuOverlay.menuData.noteID)) {
            return true;
        }

        return memory.categories[categoryID].subCategories.some((subCatID) => {
            return memory.subCategories[subCatID].notes.includes(memory.menuOverlay.menuData.noteID);
        });
    };

    const isInSubCategory = (subCategoryID: string): boolean => {
        if (memory.subCategories[subCategoryID].notes.includes(memory.menuOverlay.menuData.noteID)) {
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
                    {memory.categoryList.map((categoryID) => {
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
                                <Text style={adjustCatsStyles.text}>{memory.categories[categoryID].name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </>
            )}
            {!displayMainCategories && (
                <>
                    {memory.categories[parentCatToDisplaySubsOf].subCategories.map((subCategoryID) => {
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
                                <Text style={adjustCatsStyles.text}>{memory.subCategories[subCategoryID].name}</Text>
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
        </View>
    );
};

export default AdjustingCategories;
