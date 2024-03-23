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
import { isEmptySubCategory } from "../utilFuncs/utilFuncs";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { NestableDraggableFlatList } from "react-native-draggable-flatlist";
import { updateNotes } from "../redux/slice";

interface TileProps {
    subCategory: SubCategory;
    isLastCategory: boolean;
    isLastSubCategory: boolean;
    drag: () => void;
    isActive: boolean;
}

const SubCategoryTile: React.FC<TileProps> = ({ subCategory, isLastCategory, isLastSubCategory, drag, isActive }) => {
    const notes = useSelector((state: RootState) => state.memory.notes);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingNewNote, setAddingNewNote] = useState(false);
    const dispatch = useDispatch();

    const notesForThisSubCat = notes.filter((note) => {
        return note.subCategories.includes(subCategory.id);
    });

    const toggleExpansion = () => {
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
        const isEmpty = isEmptySubCategory(subCategory, notes);
        if (isEmpty && !isAddingNewNote) {
            return true;
        }

        return false;
    };

    const onNoteDragEnd = ({ data: newData }: { data: Note[] }) => {
        dispatch(updateNotes(newData));
    };

    const renderNote = ({
        item,
        getIndex,
        drag,
        isActive,
    }: {
        item: Note;
        getIndex: () => number | undefined;
        drag: () => void;
        isActive: boolean;
    }) => (
        <ScaleDecorator>
            <NoteTile
                note={item}
                isLastNote={getIndex() === notesForThisSubCat.length - 1}
                isLastCategory={isLastCategory}
                isLastSubCategory={isLastSubCategory}
                isInSubCategory={true}
                drag={drag}
                isActive={isActive}
            />
        </ScaleDecorator>
    );

    const handleAddNote = () => {
        setAddingNewNote(true);
        if (!isExpanded) {
            toggleExpansion();
        }
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={toggleExpansion} disabled={isActive} onLongPress={drag}>
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
                <NestableDraggableFlatList
                    removeClippedSubviews={false}
                    style={noteStyles.noteContainer}
                    data={notesForThisSubCat}
                    renderItem={renderNote}
                    onDragEnd={onNoteDragEnd}
                    keyExtractor={(note) => note.id}
                />
            )}
        </>
    );
};

export default SubCategoryTile;
