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

interface TileProps {
    subCategory: SubCategory;
    isLastCategory: boolean;
    isLastSubCategory: boolean;
}

const SubCategoryTile: React.FC<TileProps> = ({ subCategory, isLastCategory, isLastSubCategory }) => {
    const notes = useSelector((state: RootState) => state.memory.notes);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingNewNote, setAddingNewNote] = useState(false);

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

    // might extract, but should prob find a better way to do this data cos atm am filtering then reducing for no good reason.
    const renderNote = ({ item, index }: { item: Note; index: Number }) => (
        <NoteTile
            note={item}
            // extract and/or comment this
            isLastNote={
                index ===
                notes.reduce((acc, note) => {
                    return note.subCategories.includes(subCategory.id) ? acc + 1 : acc;
                }, 0) -
                    1
                    ? true
                    : false
            }
            isLastCategory={isLastCategory}
            isLastSubCategory={isLastSubCategory}
            isInSubCategory={true}
        />
    );

    const handleAddNote = () => {
        setAddingNewNote(true);
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
                    data={notes.filter((note) => {
                        return note.subCategories.includes(subCategory.id);
                    })}
                    renderItem={renderNote}
                    keyExtractor={(note) => note.id}
                />
            )}
        </>
    );
};

export default SubCategoryTile;
