import { Text, View, TouchableWithoutFeedback, TouchableOpacity, GestureResponderEvent } from "react-native";
import { useEffect, useState } from "react";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import SubCategoryTile from "./SubCategoryTile";
import { MenuOverlay, HeightUpdateInfo, NewNoteData, Note } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import NoteTile from "./NoteTile";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { createNewNote, removeFromShowSecureNote, updateCategoryHeight, updateMenuOverlay } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import * as ImagePicker from "expo-image-picker";
interface TileProps {
    categoryID: string;
    index: number;
    isLastCategory: boolean;
    setCloseAllCategories: React.Dispatch<React.SetStateAction<boolean>>;
    closeAllCategories: boolean;
}

const CategoryTile: React.FC<TileProps> = ({
    categoryID,
    index,
    isLastCategory,
    closeAllCategories,
    setCloseAllCategories,
}) => {
    const category = useSelector((state: RootState) => state.memory.categories[categoryID]);
    const showSecureNotes = useSelector((state: RootState) => state.memory.showSecureNote);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const showingSecureNotes = showSecureNotes.includes(categoryID);
    // console.log("re render category: " + category.name);

    const notesForCat: string[] = [];
    category.notes.forEach((noteRef) => {
        if (showingSecureNotes || !noteRef.isSecure) {
            notesForCat.push(noteRef.id);
        }
    });

    const dispatch = useDispatch<AppDispatch>();

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (closeAllCategories && isExpanded) {
            setIsExpanded(false);
            setCloseAllCategories(false);
        }
    }, [closeAllCategories]);

    const toggleExpansion = () => {
        if (isExpanded) {
            if (showingSecureNotes) {
                dispatch(removeFromShowSecureNote(categoryID));
            }
        }
        setIsExpanded(!isExpanded);
    };

    const handleTilePress = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        const isEmpty = notesForCat.length === 0 && category.subCategories.length === 0;
        if (isEmpty) {
            addNewNote();
            if (!isExpanded) {
                toggleExpansion();
            }
            return;
        }
        toggleExpansion();
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
            {isExpanded &&
                category.subCategories.length > 0 &&
                category.subCategories.map((subCatID, subCatIndex) => {
                    return (
                        <SubCategoryTile
                            parentCategoryID={category.id}
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
                notesForCat.map((noteID, noteIndex) => {
                    return (
                        <NoteTile
                            index={Number(noteIndex)}
                            parentCategoryIndex={index}
                            noteID={noteID}
                            categoryID={categoryID}
                            subCategoryID={""}
                            isLastCategory={isLastCategory}
                            isLastNote={noteIndex === notesForCat.length - 1}
                            key={noteID}
                            subCategoryIndex={-1}
                        />
                    );
                })}
        </View>
    );
};

export default CategoryTile;
