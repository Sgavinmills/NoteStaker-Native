import { GestureResponderEvent, Text, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import NoteTile from "./NoteTile";
import { MenuOverlay, HeightUpdateInfo, NewNoteData, Ref } from "../types";
import { getEmptyOverlay, moveDownList, moveUpList } from "../utilFuncs/utilFuncs";
import {
    createNewNote,
    removeFromShowSecureNote,
    updateCategory,
    updateMenuOverlay,
    updateSubCategoryHeight,
    updateSubCategorySilently,
} from "../redux/slice";
import { AppDispatch } from "../redux/store/store";
import * as ImagePicker from "expo-image-picker";

interface TileProps {
    subCategoryID: string;
    isLastCategory: boolean;
    isLastSubCategory: boolean;
    parentCategoryID: string;
    index: number;
    parentCategoryIndex: number;
    moving: string;
    setMoving: React.Dispatch<React.SetStateAction<string>>;
}

const SubCategoryTile: React.FC<TileProps> = ({
    subCategoryID,
    isLastCategory,
    isLastSubCategory,
    parentCategoryID,
    parentCategoryIndex,
    index: index,
    moving,
    setMoving,
}) => {
    const showSecure = useSelector((state: RootState) => state.memory.canShowSecure);
    const subCategory = useSelector((state: RootState) => state.memory.subCategories[subCategoryID]);
    const isSelected = subCategory.isSelected;
    const dispatch = useDispatch<AppDispatch>();

    console.log("------ re render subcategory: " + subCategory.name);
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

    const dontForgetMeList = useSelector((state: RootState) => state.memory.dontForgetMe);
    const dontForgetMe = subCategory.notes.some((ref) => {
        const dontForgetMeRef = dontForgetMeList[ref.id];

        if (dontForgetMeRef) {
            if (dontForgetMeRef.location[1] === subCategoryID) {
                const currentTime = new Date();
                const reminderTime = new Date(dontForgetMeRef.date);
                return reminderTime.getTime() < currentTime.getTime();
            }
        }

        return false;
    });

    useEffect(() => {
        if (subCategory.isSelected) {
            const subCategoryCopy = { ...subCategory };
            subCategoryCopy.isSelected = false;
            dispatch(updateSubCategorySilently(subCategoryCopy));
        }
    }, []);

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
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
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
            if (showingSecure) {
                dispatch(removeFromShowSecureNote(subCategoryID));
            }
        }
        setIsExpanded(!isExpanded);
    };

    const handleMenuPress = () => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
        }

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
                subMenu: "",
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
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
        }

        if (moving) {
            setMoving("");
            return true;
        }

        addNewNote();
        if (!isExpanded) {
            toggleExpansion();
        }
    };

    const handleLongPressAddNote = (event: GestureResponderEvent) => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
        }

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

    const parentCategory = useSelector((state: RootState) => state.memory.categories[parentCategoryID]);
    const handleUpPress = () => {
        const parentCategoryCopy = { ...parentCategory };

        const newList = [...parentCategoryCopy.subCategories];
        const currentIndex = newList.findIndex((ref) => ref.id === subCategoryID);
        if (currentIndex > 0) {
            parentCategoryCopy.subCategories = moveUpList(newList, currentIndex);
            dispatch(updateCategory(parentCategoryCopy));
        }
        return;
    };

    const handleDownPress = () => {
        const parentCategoryCopy = { ...parentCategory };

        const newList = [...parentCategoryCopy.subCategories];
        const currentIndex = newList.findIndex((ref) => ref.id === subCategoryID);
        if (currentIndex < newList.length - 1) {
            parentCategoryCopy.subCategories = moveDownList(newList, currentIndex);
            dispatch(updateCategory(parentCategoryCopy));
        }
        return;
    };

    const handleLongPress = () => {
        setMoving(subCategoryID);
    };

    return (
        <View onLayout={handleCategoryLayout}>
            <TouchableWithoutFeedback onPress={handleTilePress} onLongPress={handleLongPress}>
                <View
                    style={[
                        categoryStyles.subCategoryTile,
                        !isExpanded && isLastSubCategory && categoryStyles.bottomRadius,
                        moving === subCategoryID && categoryStyles.categoryTileSelected,
                        isSelected && categoryStyles.categoryTileSelected,
                    ]}
                >
                    {dontForgetMe && !isExpanded && (
                        <View style={categoryStyles.dontForgetMeContainer}>
                            <Ionicons name="notifications-outline" style={categoryStyles.dontForgetMeBell} />
                        </View>
                    )}
                    <View style={categoryStyles.categoryTextContainer}>
                        <Text style={categoryStyles.subCategoryText} adjustsFontSizeToFit={true} numberOfLines={1}>
                            {subCategory.isSecure && (
                                <FontAwesome name="lock" style={categoryStyles.padlock}></FontAwesome>
                            )}
                            {subCategory.isSecure && "  "}↳ {subCategory.name}
                        </Text>
                    </View>
                    <View style={categoryStyles.tileIconsContainer}>
                        {moving !== subCategoryID ? (
                            <>
                                <TouchableOpacity onPress={handleAddNotePress} onLongPress={handleLongPressAddNote}>
                                    <FontAwesome
                                        name="plus"
                                        style={[categoryStyles.categoryText, categoryStyles.icons]}
                                    />
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
                            </>
                        ) : (
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity onPress={handleUpPress}>
                                    <Entypo
                                        name="arrow-bold-up"
                                        style={[categoryStyles.categoryText, categoryStyles.moveArrows]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDownPress}>
                                    <Entypo
                                        name="arrow-bold-down"
                                        style={[categoryStyles.categoryText, categoryStyles.moveArrows]}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
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
                            moving={moving}
                            setMoving={setMoving}
                        />
                    );
                })}
        </View>
    );
};

export default SubCategoryTile;
