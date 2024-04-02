import { GestureResponderEvent, Text, View, TouchableWithoutFeedback, FlatList, TouchableOpacity } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { RootState } from "../redux/reducers/reducers";
import { useDispatch, useSelector } from "react-redux";
import NoteTile from "./NoteTile";
import { Note, SubCategory, MenuOverlay, Category, CatHeight, SubHeight } from "../types";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { addNewNoteToNotes, updateMenuOverlay, updateSubCategory } from "../redux/slice";
import { AppDispatch } from "../redux/store/store";
import { getRandomID } from "../memoryfunctions/memoryfunctions";
import * as ImagePicker from "expo-image-picker";
import SubtleMessage from "./SubtleMessage";

interface TileProps {
    subCategory: SubCategory;
    isLastCategory: boolean;
    isLastSubCategory: boolean;
    parentCategory: Category;
    heightData: CatHeight[];
    setHeightData: React.Dispatch<React.SetStateAction<CatHeight[]>>;
    index: number;
    parentCategoryIndex: number;
}

const SubCategoryTile: React.FC<TileProps> = ({
    heightData,
    setHeightData,
    subCategory,
    isLastCategory,
    isLastSubCategory,
    parentCategory,
    parentCategoryIndex,
    index: index,
}) => {
    const notes = useSelector((state: RootState) => state.memory.notes);
    const [showSubtleMessage, setShowSubtleMessage] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingNewNote, setAddingNewNote] = useState(false);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const dispatch = useDispatch<AppDispatch>();
    const notesForThisSubCat: Note[] = [];
    subCategory.notes.forEach((note) => {
        if (notes[note]) {
            notesForThisSubCat.push(notes[note]);
        }
    });

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
        if (isEmpty && !isAddingNewNote) {
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

        // might be able to put this back tbh
        // if (!isExpanded) {
        //     setIsExpanded(true);
        // }
    };

    const handleAddNote = () => {
        const noteToAdd: Note = {
            id: getRandomID(),
            note: "",
            additionalInfo: "",
            dateAdded: "",
            dateUpdated: "",
            priority: "normal",
            completed: false,
            imageURI: "",
            isNewNote: true,
        };
        dispatch(addNewNoteToNotes(noteToAdd));

        const subCategoryNotes = [...subCategory.notes];
        subCategoryNotes.unshift(noteToAdd.id);
        dispatch(updateSubCategory({ ...subCategory, notes: subCategoryNotes }));
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
            const noteToAdd: Note = {
                id: getRandomID(),
                note: "",
                additionalInfo: "",
                dateAdded: "",
                dateUpdated: "",
                priority: "normal",
                completed: false,
                imageURI: imageURI,
                isNewNote: true,
            };
            dispatch(addNewNoteToNotes(noteToAdd));

            const subCategoryNotes = [...subCategory.notes];
            subCategoryNotes.unshift(noteToAdd.id);
            dispatch(updateSubCategory({ ...subCategory, notes: subCategoryNotes }));
        }
        setIsExpanded(true);
    };

    const handleCategoryLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;

        setHeightData((prevState) => {
            const newState = [...prevState];

            const newCatHeight = { ...newState[parentCategoryIndex] };

            if (newCatHeight.subHeights[index]) {
                newCatHeight.subHeights[index].subHeight = height;
            } else {
                const newSubCatHeightItem: SubHeight = {
                    subHeight: height,
                    noteHeights: [],
                };

                newCatHeight.subHeights[index] = newSubCatHeightItem;
            }
            newState[parentCategoryIndex] = newCatHeight;

            return newState;
        });
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
                notesForThisSubCat.map((note, noteIndex) => {
                    return (
                        <NoteTile
                            index={noteIndex}
                            subCategoryIndex={index}
                            parentCategoryIndex={parentCategoryIndex}
                            subCategory={subCategory}
                            category={parentCategory}
                            note={note}
                            isLastNote={noteIndex === notesForThisSubCat.length - 1}
                            isLastCategory={isLastCategory}
                            isLastSubCategory={isLastSubCategory}
                            isInSubCategory={true}
                            key={note.id}
                            heightData={heightData}
                            setHeightData={setHeightData}
                        />
                    );
                })}
        </View>
    );
};

export default SubCategoryTile;
