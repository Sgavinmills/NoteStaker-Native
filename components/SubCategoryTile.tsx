import { Text, View, TouchableWithoutFeedback, FlatList } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { RootState } from "../redux/reducers/reducers";
import { useSelector } from "react-redux";
import NoteTile from "./NoteTile";
import { Note, SubCategory } from "../types";

interface TileProps {
    subCategory: SubCategory;
}

const SubCategoryTile: React.FC<TileProps> = ({ subCategory }) => {
    const notes = useSelector((state: RootState) => state.memory.notes);

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const renderNote = ({ item }: { item: Note }) => <NoteTile note={item} />;

    return (
        <>
            <TouchableWithoutFeedback onPress={toggleExpansion}>
                <View style={categoryStyles.subCategoryTile}>
                    <Text style={categoryStyles.subCategoryText}>↳ {subCategory.name}</Text>
                    <View style={categoryStyles.tileIconsContainer}>
                        <FontAwesome name="plus" style={[categoryStyles.categoryText, categoryStyles.icons]} />
                        <FontAwesome name="caret-down" style={[categoryStyles.categoryText, categoryStyles.icons]} />
                        <FontAwesome name="ellipsis-v" style={[categoryStyles.categoryText, categoryStyles.icons]} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
