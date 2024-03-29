import { Text, View, TouchableWithoutFeedback, FlatList, TouchableOpacity } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { RootState } from "../redux/reducers/reducers";
import { useDispatch, useSelector } from "react-redux";
import NoteTile from "./NoteTile";
import { Note, SubCategory } from "../types";
import NewNoteTile from "./NewNoteTile";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { updateMenuOverlay } from "../redux/slice";
import { AppDispatch } from "../redux/store/store";

interface TileProps {
    subCategory: SubCategory;
    isLastCategory: boolean;
    isLastSubCategory: boolean;
    isNoteInputActive: boolean;
    setIsNoteInputActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubCategoryTile: React.FC<TileProps> = ({
    subCategory,
    isLastCategory,
    isLastSubCategory,
    isNoteInputActive,
    setIsNoteInputActive,
}) => {
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

    const renderNote = ({ item, index }: { item: Note; index: Number }) => (
        <NoteTile
            subCategoryID={subCategory.id}
            note={item}
            isLastNote={index === notesForThisSubCat.length - 1}
            isLastCategory={isLastCategory}
            isLastSubCategory={isLastSubCategory}
            isInSubCategory={true}
            isNoteInputActive={isNoteInputActive}
            setIsNoteInputActive={setIsNoteInputActive}
        />
    );

    const handleAddNote = () => {
        setIsExpanded(true);
        setAddingNewNote(true);
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
                        <FontAwesome name="ellipsis-v" style={[categoryStyles.categoryText, categoryStyles.icons]} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {isAddingNewNote && (
                <NewNoteTile
                    isLastCategory={isLastCategory}
                    subCategory={subCategory}
                    isLastSubCategory={isLastSubCategory}
                    setAddingNewNote={setAddingNewNote}
                />
            )}
            {isExpanded && (
                <FlatList
                    style={noteStyles.noteContainer}
                    data={notesForThisSubCat}
                    renderItem={renderNote}
                    keyExtractor={(note) => note.id}
                />
            )}
        </>
    );
};

export default SubCategoryTile;
