import { Text, View, FlatList, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import SubCategoryTile from "./SubCategoryTile";
import { Category } from "../types";

interface TileProps {
    category: Category;
    index: number;
}

const CategoryTile: React.FC<TileProps> = ({ category, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const renderSubCategory = ({ item }: { item: string }) => (
        <SubCategoryTile subCategoryName={item} parentCategoryName={category.name} />
    );

    // TODO: - Long category names need to wrap or truncate.
    return (
        <>
            <TouchableWithoutFeedback onPress={toggleExpansion}>
                <View style={[categoryStyles.categoryTile, index === 0 && categoryStyles.categoryTileFirst]}>
                    <Text style={categoryStyles.categoryText}>{category.name}</Text>
                    <View style={categoryStyles.tileIconsContainer}>
                        <FontAwesome name="plus" style={[categoryStyles.categoryText, categoryStyles.icons]} />
                        <FontAwesome
                            name={isExpanded ? "caret-up" : "caret-down"}
                            style={[categoryStyles.categoryText, categoryStyles.icons]}
                        />
                        <FontAwesome name="ellipsis-v" style={[categoryStyles.categoryText, categoryStyles.icons]} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {isExpanded && (
                <FlatList
                    style={categoryStyles.subCategoryContainer}
                    data={category.subCategories}
                    renderItem={renderSubCategory}
                    keyExtractor={(cat) => cat}
                />
            )}
        </>
    );
};

export default CategoryTile;
