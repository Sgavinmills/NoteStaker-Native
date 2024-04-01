import { Text, View, FlatList, TouchableWithoutFeedback, TouchableOpacity, GestureResponderEvent } from "react-native";
import { useRef, useState } from "react";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import SubCategoryTile from "./SubCategoryTile";
import { Category, SubCategory, Note, MenuOverlay } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import NoteTile from "./NoteTile";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { addNewNoteToNotes, updateCategory, updateMenuOverlay, updateNote } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { getRandomID } from "../memoryfunctions/memoryfunctions";
import * as ImagePicker from "expo-image-picker";
import SubtleMessage from "./SubtleMessage";

interface TileProps {
    category: Category;
    index: number;
    isLastCategory: boolean;
}

const CategoryTile: React.FC<TileProps> = ({ category, index, isLastCategory }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSubtleMessage, setShowSubtleMessage] = useState(false);

    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const notes = useSelector((state: RootState) => state.memory.notes);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const [isAddingNewNote, setAddingNewNote] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const renderNote = ({ item, index }: { item: Note; index: Number }) => (
        <NoteTile
            note={item}
            categoryID={category.id}
            isLastCategory={isLastCategory}
            isLastNote={index === notesForThisCat.length - 1}
            isInSubCategory={false}
        />
    );

    // TODO - Change these to forEachs so can have error handling if it doesnt find
    // a ct or not (cos it was deleted) it doesnt add it to the array, like this it adds undefined to array.
    const subCatsForThisCat = category.subCategories.map((subCat) => {
        return subCategories[subCat];
    });

    const notesForThisCat = category.notes.map((note) => {
        return notes[note];
    });

    const toggleExpansion = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        const isEmpty = category.notes.length === 0 && category.subCategories.length === 0;
        if (isEmpty) {
            setShowSubtleMessage(true);
            setTimeout(() => {
                setShowSubtleMessage(false);
            }, 500);
            return;
        }
        setIsExpanded(!isExpanded);
    };

    const renderSubCategory = ({ item, index }: { item: SubCategory; index: number }) => (
        <SubCategoryTile
            parentCategoryID={category.id}
            isLastCategory={isLastCategory}
            subCategory={item}
            isLastSubCategory={index === subCatsForThisCat.length - 1}
        />
    );

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

        const categoryNotes = [...category.notes];
        categoryNotes.unshift(noteToAdd.id);
        dispatch(updateCategory({ ...category, notes: categoryNotes }));

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

            const categoryNotes = [...category.notes];
            categoryNotes.unshift(noteToAdd.id);
            dispatch(updateCategory({ ...category, notes: categoryNotes }));
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

    return (
        <>
            <TouchableWithoutFeedback onPress={toggleExpansion}>
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
                            <TouchableOpacity onPress={handleAddNote} onLongPress={handleLongPressAddNote}>
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
            {isExpanded && category.subCategories.length > 0 && (
                <FlatList
                    removeClippedSubviews={false}
                    style={categoryStyles.subCategoryContainer}
                    data={subCatsForThisCat}
                    renderItem={renderSubCategory}
                    keyExtractor={(cat) => cat.id}
                />
            )}
            {isExpanded && category.subCategories.length == 0 && (
                <FlatList
                    removeClippedSubviews={false}
                    data={notesForThisCat}
                    renderItem={renderNote}
                    keyExtractor={(note) => note.id}
                />
            )}
        </>
    );
};

export default CategoryTile;
