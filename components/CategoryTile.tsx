import { Text, View, TouchableWithoutFeedback, TouchableOpacity, GestureResponderEvent } from "react-native";
import { useState } from "react";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import SubCategoryTile from "./SubCategoryTile";
import { MenuOverlay, HeightUpdateInfo, NewNoteData } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import NoteTile from "./NoteTile";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { createNewNote, updateCategoryHeight, updateMenuOverlay } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import * as ImagePicker from "expo-image-picker";
import SubtleMessage from "./SubtleMessage";
interface TileProps {
    categoryID: string;
    index: number;
    isLastCategory: boolean;
}

const CategoryTile: React.FC<TileProps> = ({ categoryID, index, isLastCategory }) => {
    const categories = useSelector((state: RootState) => state.memory.categories);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const category = categories[categoryID];
    const dispatch = useDispatch<AppDispatch>();

    const [isExpanded, setIsExpanded] = useState(false);
    const [showSubtleMessage, setShowSubtleMessage] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const handleTilePress = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        const isEmpty = category.notes.length === 0 && category.subCategories.length === 0;
        if (isEmpty) {
            addNewNote();
            if (!isExpanded) {
                toggleExpansion();
            }
            return;
        }
        setIsExpanded(!isExpanded);
    };

    const addNewNote = () => {
        const newNoteData: NewNoteData = {
            categoryID: categoryID,
            subCategoryID: "",
            imageURI: "",
            noteInsertIndex: 0,
        };
        dispatch(createNewNote(newNoteData));
    };

    const handleAddNotePress = () => {
        addNewNote();
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
                categoryID: categoryID,
                subCategoryID: "",
                imageURI: imageURI,
                noteInsertIndex: 0,
            };
            dispatch(createNewNote(newNoteData));
        }
        setIsExpanded(true);
    };

    const handleMenuPress = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
        const newOverlay: MenuOverlay = {
            isShowing: true,
            menuType: "category",
            menuData: {
                noteID: "",
                categoryID: category.id,
                subCategoryID: "",
                categoryIndex: index,
                subCategoryIndex: null,
                noteIndex: null,
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
        if (!isExpanded) {
            setIsExpanded(true);
        }
    };

    const addBottomTileMartin = () => {
        if (!isLastCategory) {
            return false;
        }

        if (!isExpanded) {
            return true;
        }

        const isEmpty = category.notes.length === 0 && category.subCategories.length === 0;
        return isEmpty;
    };

    const tileHasMenuOpen = () => {
        if (overlay.isShowing && overlay.menuType === "category" && overlay.menuData.categoryID === category.id) {
            return true;
        }

        return false;
    };

    const handleCategoryLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        const update: HeightUpdateInfo = {
            newHeight: height,
            categoryIndex: index,
            subCategoryIndex: -1,
            noteIndex: -1,
        };
        dispatch(updateCategoryHeight(update));
    };
    return (
        <View onLayout={handleCategoryLayout}>
            <TouchableWithoutFeedback onPress={handleTilePress} onLongPress={handleMenuPress}>
                <View
                    style={[
                        categoryStyles.categoryTile,
                        index === 0 && categoryStyles.categoryTileFirst,
                        addBottomTileMartin() && categoryStyles.lastMargin,
                        tileHasMenuOpen() && categoryStyles.categoryTileSelected,
                    ]}
                >
                    <View style={categoryStyles.categoryTextContainer}>
                        <Text style={categoryStyles.categoryText} adjustsFontSizeToFit={true} numberOfLines={1}>
                            {category.name}
                        </Text>
                    </View>
                    <View style={categoryStyles.tileIconsContainer}>
                        {category.subCategories.length === 0 && (
                            <TouchableOpacity onPress={handleAddNotePress} onLongPress={handleLongPressAddNote}>
                                <FontAwesome name="plus" style={[categoryStyles.plusIconText, categoryStyles.icons]} />
                            </TouchableOpacity>
                        )}
                        <FontAwesome
                            name={isExpanded ? "caret-up" : "caret-down"}
                            style={[categoryStyles.caretIconText, categoryStyles.icons]}
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
                    message="This category is empty"
                    visible={showSubtleMessage}
                    setSubtleMessage={setShowSubtleMessage}
                />
            )}
            {isExpanded &&
                category.subCategories.length > 0 &&
                category.subCategories.map((subCatID, subCatIndex) => {
                    return (
                        <SubCategoryTile
                            parentCategory={category}
                            isLastCategory={isLastCategory}
                            subCategoryID={subCatID}
                            isLastSubCategory={subCatIndex === category.subCategories.length - 1}
                            key={subCatID}
                            index={subCatIndex}
                            parentCategoryIndex={index}
                        />
                    );
                })}
            {isExpanded &&
                category.subCategories.length == 0 &&
                category.notes.map((noteID, noteIndex) => {
                    return (
                        <NoteTile
                            index={Number(noteIndex)}
                            parentCategoryIndex={index}
                            noteID={noteID}
                            category={category}
                            isLastCategory={isLastCategory}
                            isLastNote={noteIndex === category.notes.length - 1}
                            isInSubCategory={false}
                            key={noteID}
                            subCategoryIndex={-1}
                        />
                    );
                })}
        </View>
    );
};

export default CategoryTile;
