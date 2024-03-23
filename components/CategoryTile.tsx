import { Text, View, FlatList, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useState } from "react";
import noteStyles from "../styles/noteStyles";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import SubCategoryTile from "./SubCategoryTile";
import { Category, SubCategory, Note } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import NoteTile from "./NoteTile";
import NewNoteTile from "./NewNoteTile";
import { isEmptyCategory } from "../utilFuncs/utilFuncs";
import { useDispatch } from "react-redux";
import { updateNotes, updateSubCategories } from "../redux/slice";
import { NestableDraggableFlatList } from "react-native-draggable-flatlist";
import { ScaleDecorator } from "react-native-draggable-flatlist";

interface TileProps {
    category: Category;
    index: number | undefined;
    isLastCategory: boolean;
    drag: () => void;
    isActive: boolean;
}

// If we decude we dont like draggable categories can extract easily enough.
// Just revert to flatlists. Fix the renderItem functions. Pretty much it.
// THen dont need the touchables thing wrapping the whole app anymore
// And can take the new imports out of package and babel too.
const CategoryTile: React.FC<TileProps> = ({ category, index, isLastCategory, drag, isActive }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const notes = useSelector((state: RootState) => state.memory.notes);
    const [isAddingNewNote, setAddingNewNote] = useState(false);
    const dispatch = useDispatch();
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
                isLastCategory={isLastCategory}
                isLastNote={getIndex() === notesForThisCat.length - 1}
                isInSubCategory={false}
                drag={drag}
                isActive={isActive}
            />
        </ScaleDecorator>
    );

    const renderSubCategory = ({
        item,
        getIndex,
        drag,
        isActive,
    }: {
        item: SubCategory;
        getIndex: () => number | undefined;
        drag: () => void;
        isActive: boolean;
    }) => (
        <ScaleDecorator>
            <SubCategoryTile
                isLastCategory={isLastCategory}
                subCategory={item}
                isLastSubCategory={index === subCatsForThisCat.length - 1}
                drag={drag}
                isActive={isActive}
            />
        </ScaleDecorator>
    );

    const subCatsForThisCat = subCategories.filter((subCategory) => {
        return subCategory.parentCategory === category.id;
    });

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const notesForThisCat = notes.filter((note) => {
        return note.categories.includes(category.id);
    });

    const handleAddNote = () => {
        setAddingNewNote(true);
        if (!isExpanded) {
            toggleExpansion();
        }
    };

    const addBottomTileMartin = () => {
        if (!isLastCategory) {
            return false;
        }

        if (!isExpanded) {
            return true;
        }

        const isEmpty = isEmptyCategory(category, notes);
        if (isEmpty && !isAddingNewNote) {
            return true;
        }
        return false;
    };

    const onNoteDragEnd = ({ data: newData }: { data: Note[] }) => {
        dispatch(updateNotes(newData));
    };

    const onSubCategoryDragEnd = ({ data: newData }: { data: SubCategory[] }) => {
        dispatch(updateSubCategories(newData));
    };

    return (
        <>
            <TouchableWithoutFeedback disabled={isActive} onLongPress={drag} onPress={toggleExpansion}>
                <View
                    style={[
                        categoryStyles.categoryTile,
                        index === 0 && categoryStyles.categoryTileFirst,
                        addBottomTileMartin() && categoryStyles.lastMargin,
                    ]}
                >
                    <View style={categoryStyles.categoryTextContainer}>
                        <Text style={categoryStyles.categoryText} adjustsFontSizeToFit={true} numberOfLines={1}>
                            {category.name}
                        </Text>
                    </View>
                    <View style={categoryStyles.tileIconsContainer}>
                        {category.subCategories.length === 0 && (
                            <TouchableOpacity onPress={handleAddNote}>
                                <FontAwesome name="plus" style={[categoryStyles.plusIconText, categoryStyles.icons]} />
                            </TouchableOpacity>
                        )}
                        <FontAwesome
                            name={isExpanded ? "caret-up" : "caret-down"}
                            style={[categoryStyles.caretIconText, categoryStyles.icons]}
                        />
                        <FontAwesome
                            name="ellipsis-v"
                            style={[categoryStyles.ellipsisIconText, categoryStyles.icons]}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {isExpanded && category.subCategories.length > 0 && (
                <NestableDraggableFlatList
                    removeClippedSubviews={false}
                    style={categoryStyles.subCategoryContainer}
                    data={subCatsForThisCat}
                    renderItem={renderSubCategory}
                    keyExtractor={(cat) => cat.id}
                    onDragEnd={onSubCategoryDragEnd}
                />
            )}
            {isAddingNewNote && (
                <NewNoteTile isLastCategory={isLastCategory} category={category} setAddingNewNote={setAddingNewNote} />
            )}
            {isExpanded && category.subCategories.length == 0 && (
                <NestableDraggableFlatList
                    removeClippedSubviews={false}
                    style={noteStyles.noteContainer}
                    data={notesForThisCat}
                    onDragEnd={onNoteDragEnd}
                    renderItem={renderNote}
                    keyExtractor={(note) => note.id}
                />
            )}
        </>
    );
};

export default CategoryTile;
