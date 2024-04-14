import { GestureResponderEvent, Text, View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import NoteTile from "./NoteTile";
import { MenuOverlay, HeightUpdateInfo, NewNoteData } from "../types";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { createNewNote, removeFromShowSecureNote, updateMenuOverlay, updateSubCategoryHeight } from "../redux/slice";
import { AppDispatch } from "../redux/store/store";
import * as ImagePicker from "expo-image-picker";

interface TileProps {
    subCategoryID: string;
    isLastCategory: boolean;
    isLastSubCategory: boolean;
    parentCategoryID: string;
    index: number;
    parentCategoryIndex: number;
}

const SubCategoryTile: React.FC<TileProps> = ({
    subCategoryID,
    isLastCategory,
    isLastSubCategory,
    parentCategoryID,
    parentCategoryIndex,
    index: index,
}) => {
    const showSecure = useSelector((state: RootState) => state.memory.canShowSecure);
    const subCategory = useSelector((state: RootState) => state.memory.subCategories[subCategoryID]);

    const dispatch = useDispatch<AppDispatch>();

    console.log("re render subcategory: " + subCategory.name);
    const showingSecure =
        showSecure.homeScreen ||
        showSecure.categories.includes(subCategoryID) ||
        showSecure.categories.includes(parentCategoryID);
    const notesForSubCat: string[] = [];
    subCategory.notes.forEach((noteRef) => {
        if (showingSecure || !noteRef.isSecure) {
            notesForSubCat.push(noteRef.id);
        }
    });

    // clean up method
    useEffect(() => {
        return () => {
            // if this subcat id is in the showing list then remove it
            if (showSecure.categories.includes(subCategoryID)) {
                dispatch(removeFromShowSecureNote(subCategoryID));
            }
        };
    }, [showSecure.categories]);

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // needed for when a solitary note is deleted so the border radius is added properly
        if (notesForSubCat.length === 0) {
            setIsExpanded(false);
        }
    }, [notesForSubCat]);

    const handleTilePress = () => {
        const isEmpty = notesForSubCat.length === 0;
        if (isEmpty) {
            addNewNote();
            if (!isExpanded) {
                toggleExpansion();
            }
            return;
        }

        toggleExpansion();
    };

    const toggleExpansion = () => {
        if (isExpanded) {
            if (showingSecure) {
                dispatch(removeFromShowSecureNote(subCategoryID));
            }
        }
        setIsExpanded(!isExpanded);
    };

    const handleMenuPress = () => {
        const newOverlay: MenuOverlay = {
            isShowing: true,
            menuType: "subCategory",
            menuData: {
                noteID: "",
                categoryID: parentCategoryID,
                subCategoryID: subCategory.id,
                noteIndex: null,
                subCategoryIndex: index,
                categoryIndex: parentCategoryIndex,
                isSearchTile: false,
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
    };

    const addNewNote = () => {
        dispatch(updateMenuOverlay(getEmptyOverlay()));

        const newNoteData: NewNoteData = {
            categoryID: parentCategoryID,
            subCategoryID: subCategoryID,
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
                categoryID: parentCategoryID,
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
            <TouchableWithoutFeedback onPress={handleTilePress} onLongPress={handleMenuPress}>
                <View
                    style={[
                        categoryStyles.subCategoryTile,
                        !isExpanded && isLastSubCategory && categoryStyles.bottomRadius,
                    ]}
                >
                    <View style={categoryStyles.categoryTextContainer}>
                        <Text style={categoryStyles.subCategoryText} adjustsFontSizeToFit={true} numberOfLines={1}>
                            {subCategory.isSecure && (
                                <FontAwesome name="lock" style={categoryStyles.padlock}></FontAwesome>
                            )}
                            {subCategory.isSecure && "  "}↳ {subCategory.name}
                        </Text>
                    </View>
                    <View style={categoryStyles.tileIconsContainer}>
                        <TouchableOpacity onPress={handleAddNotePress} onLongPress={handleLongPressAddNote}>
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
            {isExpanded &&
                notesForSubCat.map((noteID, noteIndex) => {
                    return (
                        <NoteTile
                            index={noteIndex}
                            subCategoryIndex={index}
                            parentCategoryIndex={parentCategoryIndex}
                            subCategoryID={subCategoryID}
                            categoryID={parentCategoryID}
                            noteID={noteID}
                            isLastNote={noteIndex === notesForSubCat.length - 1}
                            isLastCategory={isLastCategory}
                            isLastSubCategory={isLastSubCategory}
                            key={noteID}
                            isSearchTile={false}
                        />
                    );
                })}
        </View>
    );
};

export default SubCategoryTile;
