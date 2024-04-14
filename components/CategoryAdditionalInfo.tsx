import React from "react";
import { View, Text } from "react-native";
import additionalInfo from "../styles/additionalInfo";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { Category, SubCategory } from "../types";

interface TileProps {}

const CategoryAdditionalInfo: React.FC<TileProps> = ({}) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const category = useSelector((state: RootState) => state.memory.categories[overlay.menuData.categoryID]);
    const subCategory = useSelector((state: RootState) => state.memory.subCategories[overlay.menuData.subCategoryID]);
    let thisCategory: Category | SubCategory;
    thisCategory = subCategory ? subCategory : category;

    const getSecureNotes = (): number => {
        const secureNotes = thisCategory.notes.filter((noteRef) => noteRef.isSecure);
        return secureNotes.length;
    };

    const getSecureSubCats = () => {
        if (category) {
            const secureSubCats = category.subCategories.filter((subCatRef) => subCatRef.isSecure);
            return secureSubCats.length;
        }
        return 0;
    };

    return (
        <View style={additionalInfo.container}>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>ID: </Text>
                <Text style={additionalInfo.text}>{thisCategory.id}</Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Name: </Text>
                <Text style={additionalInfo.text}>{thisCategory.name}</Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Num of notes: </Text>
                <Text style={additionalInfo.text}>{thisCategory.notes.length}</Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Num of secure notes: </Text>
                <Text style={additionalInfo.text}>{getSecureNotes()}</Text>
            </View>
            {!subCategory && (
                <View style={additionalInfo.row}>
                    <Text style={additionalInfo.text}>Num of subcategories: </Text>
                    <Text style={additionalInfo.text}>{category.subCategories.length}</Text>
                </View>
            )}
            {!subCategory && category.subCategories.length > 0 && (
                <View style={additionalInfo.row}>
                    <Text style={additionalInfo.text}>Num of secure subcategories: </Text>
                    <Text style={additionalInfo.text}>{getSecureSubCats()}</Text>
                </View>
            )}
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Created: </Text>
                <Text style={additionalInfo.text}>
                    {thisCategory.dateAdded && new Date(thisCategory.dateAdded).toLocaleString()}
                </Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Last updated: </Text>
                <Text style={additionalInfo.text}>
                    {thisCategory.dateUpdated && new Date(thisCategory.dateUpdated).toLocaleString()}
                </Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Created by: </Text>
                <Text style={additionalInfo.text}>{thisCategory.createdBy}</Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Last updated by: </Text>
                <Text style={additionalInfo.text}>{thisCategory.lastUpdatedBy}</Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Is secure: </Text>
                <Text style={additionalInfo.text}>{thisCategory.isSecure ? "Yes" : "No"}</Text>
            </View>
        </View>
    );
};

export default CategoryAdditionalInfo;
