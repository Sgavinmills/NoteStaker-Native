import { Text, View, FlatList, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import SubCategoryTile from "./SubCategoryTile";
import { Category, SubCategory } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";

interface TileProps {
    category: Category;
    index: number;
}

const CategoryTile: React.FC<TileProps> = ({ category, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const renderSubCategory = ({ item }: { item: SubCategory }) => <SubCategoryTile subCategory={item} />;

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
                    data={subCategories.filter((subCategory) => {
                        return subCategory.parentCategory === category.id;
                    })}
                    renderItem={renderSubCategory}
                    keyExtractor={(cat) => cat.id}
                />
            )}
        </>
    );
};

export default CategoryTile;
