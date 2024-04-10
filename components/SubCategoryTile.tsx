import { GestureResponderEvent, Text, View, TouchableWithoutFeedback, FlatList, TouchableOpacity } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { RootState } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import NoteTile from "./NoteTile";
import { MenuOverlay, Category, HeightUpdateInfo, NewNoteData, Note, SubCategory } from "../types";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { createNewNote, removeFromShowSecureNote, updateMenuOverlay, updateSubCategoryHeight } from "../redux/slice";
import { AppDispatch } from "../redux/store/store";
import * as ImagePicker from "expo-image-picker";
import SubtleMessage from "./SubtleMessage";

interface TileProps {
    subCategory: SubCategory;
    isLastCategory: boolean;
    isLastSubCategory: boolean;
    parentCategory: Category;
    index: number;
    parentCategoryIndex: number;
}

const SubCategoryTile: React.FC<TileProps> = ({
    subCategory,
    isLastCategory,
    isLastSubCategory,
    parentCategory,
    parentCategoryIndex,
    index: index,
}) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const showSecureNotes = useSelector((state: RootState) => state.memory.showSecureNote);
    // const notes = useSelector((state: RootState) => state.memory.notes)

    // const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const showingSecureNotes = showSecureNotes.includes(subCategory.id);
    const notesForSubCat: Note[] = [];
    console.log("----SubCategory: " + subCategory.name);
    subCategory.noteList.forEach((noteID) => {
        const note = subCategory.notes[noteID];
        if (!note.isSecureNote || showingSecureNotes) {
            notesForSubCat.push(note);
        }
    });

    const dispatch = useDispatch<AppDispatch>();

    const [isExpanded, setIsExpanded] = useState(false);

    const handleTilePress = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

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
            if (showingSecureNotes) {
                dispatch(removeFromShowSecureNote(subCategory.id));
            }
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

        const isEmpty = subCategory.noteList.length === 0;
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

    const addNewNote = () => {
        const newNoteData: NewNoteData = {
            categoryID: "",
            subCategoryID: subCategory.id,
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
                categoryID: "",
                subCategoryID: subCategory.id,
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
                notesForSubCat.map((note, noteIndex) => {
                    return (
                        <NoteTile
                            index={noteIndex}
                            subCategoryIndex={index}
                            parentCategoryIndex={parentCategoryIndex}
                            subCategory={subCategory}
                            category={parentCategory}
                            note={note}
                            isLastNote={noteIndex === notesForSubCat.length - 1}
                            isLastCategory={isLastCategory}
                            isLastSubCategory={isLastSubCategory}
                            isInSubCategory={true}
                            key={note.id}
                            showingSecureNotes={showingSecureNotes}
                        />
                    );
                })}
        </View>
    );
};

export default SubCategoryTile;
