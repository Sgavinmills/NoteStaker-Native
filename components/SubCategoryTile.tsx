import { GestureResponderEvent, Text, View, TouchableWithoutFeedback, FlatList, TouchableOpacity } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { RootState } from "../redux/reducers/reducers";
import { useDispatch, useSelector } from "react-redux";
import NoteTile from "./NoteTile";
import { MenuOverlay, Category, HeightUpdateInfo, NewNoteData } from "../types";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { createNewNote, updateMenuOverlay, updateSubCategoryHeight } from "../redux/slice";
import { AppDispatch } from "../redux/store/store";
import * as ImagePicker from "expo-image-picker";
import SubtleMessage from "./SubtleMessage";

interface TileProps {
    subCategoryID: string;
    isLastCategory: boolean;
    isLastSubCategory: boolean;
    parentCategory: Category;
    index: number;
    parentCategoryIndex: number;
}

const SubCategoryTile: React.FC<TileProps> = ({
    subCategoryID,
    isLastCategory,
    isLastSubCategory,
    parentCategory,
    parentCategoryIndex,
    index: index,
}) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const subCategory = subCategories[subCategoryID];
    const dispatch = useDispatch<AppDispatch>();

    const [showSubtleMessage, setShowSubtleMessage] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        const isEmpty = subCategory.notes.length === 0;
        if (isEmpty) {
            setShowSubtleMessage(true);
            setTimeout(() => {
                setShowSubtleMessage(false);
            }, 500);
            return;
        }

        setIsExpanded(!isExpanded);
    };

    const tileHasMenuOpen = () => {
        if (
            overlay.isShowing &&
            overlay.menuType === "subCategory" &&
            overlay.menuData.subCategoryID === subCategory.id
        ) {
            return true;
        }

        return false;
    };

    const addBottomTileMargin = () => {
        if (!isLastCategory) {
            return false;
        }

        if (!isLastSubCategory) {
            return false;
        }

        if (!isExpanded) {
            return true;
        }

        const isEmpty = subCategory.notes.length === 0;
        if (isEmpty) {
            return true;
        }

        return false;
    };

    const handleMenuPress = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
        const newOverlay: MenuOverlay = {
            isShowing: true,
            menuType: "subCategory",
            menuData: {
                noteID: "",
                categoryID: parentCategory.id,
                subCategoryID: subCategory.id,
                noteIndex: null,
                subCategoryIndex: index,
                categoryIndex: parentCategoryIndex,
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
    };

    const handleAddNote = () => {
        const newNoteData: NewNoteData = {
            categoryID: "",
            subCategoryID: subCategoryID,
            imageURI: "",
            noteInsertIndex: 0,
        };

        dispatch(createNewNote(newNoteData));
        if (!isExpanded) {
            toggleExpansion();
        }
    };

    const handleLongPressAddNote = (event: GestureResponderEvent) => {
        pickImage();
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const imageURI = result.assets[0].uri;
            const newNoteData: NewNoteData = {
                categoryID: "",
                subCategoryID: subCategoryID,
                imageURI: imageURI,
                noteInsertIndex: 0,
            };

            dispatch(createNewNote(newNoteData));
        }
        setIsExpanded(true);
    };

    const handleCategoryLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        const update: HeightUpdateInfo = {
            newHeight: height,
            categoryIndex: parentCategoryIndex,
            subCategoryIndex: index,
            noteIndex: -1,
        };
        dispatch(updateSubCategoryHeight(update));
    };

    return (
        <View onLayout={handleCategoryLayout}>
            <TouchableWithoutFeedback onPress={toggleExpansion} onLongPress={handleMenuPress}>
                <View
                    style={[
                        categoryStyles.subCategoryTile,
                        addBottomTileMargin() && categoryStyles.lastMargin,
                        tileHasMenuOpen() && categoryStyles.categoryTileSelected,
                    ]}
                >
                    <View style={categoryStyles.categoryTextContainer}>
                        <Text style={categoryStyles.subCategoryText} adjustsFontSizeToFit={true} numberOfLines={1}>
                            ↳ {subCategory.name}
                        </Text>
                    </View>
                    <View style={categoryStyles.tileIconsContainer}>
                        <TouchableOpacity onPress={handleAddNote} onLongPress={handleLongPressAddNote}>
                            <FontAwesome name="plus" style={[categoryStyles.categoryText, categoryStyles.icons]} />
                        </TouchableOpacity>
                        <FontAwesome
                            name={isExpanded ? "caret-up" : "caret-down"}
                            style={[categoryStyles.categoryText, categoryStyles.icons]}
                        />
                        <TouchableOpacity onPress={handleMenuPress}>
                            <FontAwesome
                                name="ellipsis-v"
                                style={[categoryStyles.ellipsisIconText, categoryStyles.icons]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {showSubtleMessage && (
                <SubtleMessage
                    message="This sub-category is empty"
                    visible={showSubtleMessage}
                    setSubtleMessage={setShowSubtleMessage}
                />
            )}
            {isExpanded &&
                subCategory.notes.map((noteID, noteIndex) => {
                    return (
                        <NoteTile
                            index={noteIndex}
                            subCategoryIndex={index}
                            parentCategoryIndex={parentCategoryIndex}
                            subCategory={subCategory}
                            category={parentCategory}
                            noteID={noteID}
                            isLastNote={noteIndex === subCategory.notes.length - 1}
                            isLastCategory={isLastCategory}
                            isLastSubCategory={isLastSubCategory}
                            isInSubCategory={true}
                            key={noteID}
                        />
                    );
                })}
        </View>
    );
};

export default SubCategoryTile;
