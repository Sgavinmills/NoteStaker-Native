import { Text, View, FlatList, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useRef, useState } from "react";
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

interface TileProps {
    category: Category;
    index: number;
    isLastCategory: boolean;
}

const CategoryTile: React.FC<TileProps> = ({ category, index, isLastCategory }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const notes = useSelector((state: RootState) => state.memory.notes);
    const [isAddingNewNote, setAddingNewNote] = useState(false);

    const renderNote = ({ item, index }: { item: Note; index: Number }) => (
        <NoteTile
            note={item}
            isLastCategory={isLastCategory}
            isLastNote={
                index ===
                notes.reduce((acc, note) => {
                    return note.categories.includes(category.id) ? acc + 1 : acc;
                }, 0) -
                    1
                    ? true
                    : false
            }
            isInSubCategory={false}
        />
    );

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    // to know if subcategory is the last subcategory... need to know how many subcategories there are then its when index = that (-1)
    // to know how many sub categories there are...
    // need to count the numb of sub cats where parentcategory is category.id
    // we will implement that, and it will amtch the note way
    // but maybe we do something better so we're not filtering and reducing the same array.
    const renderSubCategory = (
        { item, index }: { item: SubCategory; index: number } // check what its using islast for, should it be getting told if its the last subcat as well as main cat?
    ) => (
        <SubCategoryTile
            isLastCategory={isLastCategory}
            subCategory={item}
            isLastSubCategory={
                index ===
                subCategories.reduce((acc, subCategory) => {
                    return subCategory.parentCategory === category.id ? acc + 1 : acc;
                }, 0) -
                    1
                    ? true
                    : false
            }
        />
    );

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

    return (
        <>
            <TouchableWithoutFeedback onPress={toggleExpansion}>
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
                <FlatList
                    removeClippedSubviews={false}
                    style={categoryStyles.subCategoryContainer}
                    data={subCategories.filter((subCategory) => {
                        return subCategory.parentCategory === category.id;
                    })}
                    renderItem={renderSubCategory}
                    keyExtractor={(cat) => cat.id}
                />
            )}
            {isAddingNewNote && (
                <NewNoteTile isLastCategory={isLastCategory} category={category} setAddingNewNote={setAddingNewNote} />
            )}
            {isExpanded && category.subCategories.length == 0 && (
                <FlatList
                    removeClippedSubviews={false}
                    style={noteStyles.noteContainer}
                    data={notes.filter((note) => {
                        return note.categories.includes(category.id);
                    })}
                    renderItem={renderNote}
                    keyExtractor={(note) => note.id}
                />
            )}
        </>
    );
};

export default CategoryTile;
