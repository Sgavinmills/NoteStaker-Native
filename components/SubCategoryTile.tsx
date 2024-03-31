import { Text, View, TouchableWithoutFeedback, FlatList, TouchableOpacity } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { RootState } from "../redux/reducers/reducers";
import { useDispatch, useSelector } from "react-redux";
import NoteTile from "./NoteTile";
import { Note, SubCategory, MenuOverlay } from "../types";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { addNewNoteToNotes, updateMenuOverlay, updateSubCategory } from "../redux/slice";
import { AppDispatch } from "../redux/store/store";
import { getRandomID } from "../memoryfunctions/memoryfunctions";

interface TileProps {
    subCategory: SubCategory;
    isLastCategory: boolean;
    isLastSubCategory: boolean;
    parentCategoryID: string;
}

const SubCategoryTile: React.FC<TileProps> = ({ subCategory, isLastCategory, isLastSubCategory, parentCategoryID }) => {
    const notes = useSelector((state: RootState) => state.memory.notes);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingNewNote, setAddingNewNote] = useState(false);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const dispatch = useDispatch<AppDispatch>();

    const notesForThisSubCat = subCategory.notes.map((note) => {
        return notes[note];
    });

    const toggleExpansion = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        setIsExpanded(!isExpanded);
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
                categoryID: parentCategoryID,
                subCategoryID: subCategory.id,
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
    };

    const renderNote = ({ item, index }: { item: Note; index: Number }) => (
        <NoteTile
            subCategoryID={subCategory.id}
            categoryID={parentCategoryID}
            note={item}
            isLastNote={index === notesForThisSubCat.length - 1}
            isLastCategory={isLastCategory}
            isLastSubCategory={isLastSubCategory}
            isInSubCategory={true}
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

        const subCategoryNotes = [...subCategory.notes];
        subCategoryNotes.unshift(noteToAdd.id);
        dispatch(updateSubCategory({ ...subCategory, notes: subCategoryNotes }));
        if (!isExpanded) {
            toggleExpansion();
        }
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={toggleExpansion}>
                <View style={[categoryStyles.subCategoryTile, addBottomTileMargin() && categoryStyles.lastMargin]}>
                    <Text style={categoryStyles.subCategoryText}>↳ {subCategory.name}</Text>
                    <View style={categoryStyles.tileIconsContainer}>
                        <TouchableOpacity onPress={handleAddNote}>
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
                // <FlatList
                //     style={noteStyles.noteContainer}
                //     data={notesForThisSubCat}
                //     renderItem={renderNote}
                //     keyExtractor={(note) => note.id}
                // />
                notesForThisSubCat.map((note, index) => {
                    return (
                        <NoteTile
                            subCategoryID={subCategory.id}
                            categoryID={parentCategoryID}
                            note={note}
                            isLastNote={index === notesForThisSubCat.length - 1}
                            isLastCategory={isLastCategory}
                            isLastSubCategory={isLastSubCategory}
                            isInSubCategory={true}
                            key={note.id}
                        />
                    );
                })}
        </>
    );
};

export default SubCategoryTile;
