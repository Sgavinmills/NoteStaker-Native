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

// once done testing delete this comment and push up, the pull request can then be ignored
// but hopefyully branch withd raggable working will be tehr so hould keep that pr for later.

const CategoryTile: React.FC<TileProps> = ({ category, index, isLastCategory }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const notes = useSelector((state: RootState) => state.memory.notes);
    const [isAddingNewNote, setAddingNewNote] = useState(false);

    const renderNote = ({ item, index }: { item: Note; index: Number }) => (
        <NoteTile
            note={item}
            isLastCategory={isLastCategory}
            isLastNote={index === notesForThisCat.length - 1}
            isInSubCategory={false}
        />
    );

    // when doing moving categories.
    // if we change this to be a map over tje parentcat.subcats and the returned array
    // is then in the order of cats, then reordering gets much simpler.

    // longer process. instead of looping over subcats once and prducing an array O(1)
    // we have to loop over notes for each subcat, so O(n).
    // also, bu then... would notes/subcats even need yto be an array? could be a map and just
    // check the map for note existence and return when/if found...

    // the main problem ithis solves is allowing reordering in individual categories... which is fairly
    // important tbj
    // defo worth exploring, unfortunately.
    const subCatsForThisCat = subCategories.filter((subCategory) => {
        return subCategory.parentCategory === category.id;
    });

    const notesForThisCat = notes.filter((note) => {
        return note.categories.includes(category.id);
    });

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const renderSubCategory = ({ item, index }: { item: SubCategory; index: number }) => (
        <SubCategoryTile
            isLastCategory={isLastCategory}
            subCategory={item}
            isLastSubCategory={index === subCatsForThisCat.length - 1}
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
                    data={subCatsForThisCat}
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
                    data={notesForThisCat}
                    renderItem={renderNote}
                    keyExtractor={(note) => note.id}
                />
            )}
        </>
    );
};

export default CategoryTile;
