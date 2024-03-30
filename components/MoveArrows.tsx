import React from "react";
import { View, TouchableOpacity } from "react-native";
import arrowStyles from "../styles/arrowStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { AppDispatch } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory, updateCategoryList, updateMenuOverlay, updateSubCategory } from "../redux/slice";
import { RootState } from "../redux/reducers/reducers";

interface TileProps {}

const MoveArrows: React.FC<TileProps> = ({}) => {
    const dispatch = useDispatch<AppDispatch>();
    const memory = useSelector((state: RootState) => state.memory);

    const handleDownPress = () => {
        if (memory.menuOverlay.menuType === "category") {
            const newList = [...memory.categoryList];
            const currentIndex = newList.indexOf(memory.menuOverlay.menuData.categoryID);
            if (currentIndex < newList.length - 1) {
                const updatedList = moveDownList(newList, currentIndex);
                dispatch(updateCategoryList(updatedList));
            }
            return;
        }

        if (memory.menuOverlay.menuType === "subCategory") {
            const parentCategoryCopy = { ...memory.categories[memory.menuOverlay.menuData.categoryID] };

            const newList = [...parentCategoryCopy.subCategories];
            const currentIndex = newList.indexOf(memory.menuOverlay.menuData.subCategoryID);
            if (currentIndex < newList.length - 1) {
                parentCategoryCopy.subCategories = moveDownList(newList, currentIndex);
                dispatch(updateCategory(parentCategoryCopy));
            }
            return;
        }

        if (memory.menuOverlay.menuType === "note") {
            if (memory.menuOverlay.menuData.subCategoryID) {
                const subCategoryCopy = { ...memory.subCategories[memory.menuOverlay.menuData.subCategoryID] };
                const newList = [...subCategoryCopy.notes];
                const currentIndex = newList.indexOf(memory.menuOverlay.menuData.noteID);
                if (currentIndex < newList.length - 1) {
                    subCategoryCopy.notes = moveDownList(newList, currentIndex);
                    dispatch(updateSubCategory(subCategoryCopy));
                }
                return;
            }

            const categoryCopy = { ...memory.categories[memory.menuOverlay.menuData.categoryID] };
            const newList = [...categoryCopy.notes];
            const currentIndex = newList.indexOf(memory.menuOverlay.menuData.noteID);
            if (currentIndex < newList.length - 1) {
                categoryCopy.notes = moveDownList(newList, currentIndex);
                dispatch(updateCategory(categoryCopy));
            }
        }
    };

    const handleUpPress = () => {
        if (memory.menuOverlay.menuType === "category") {
            const newList = [...memory.categoryList];
            const currentIndex = newList.indexOf(memory.menuOverlay.menuData.categoryID);
            if (currentIndex > 0) {
                const updatedList = moveUpList(newList, currentIndex);
                dispatch(updateCategoryList(updatedList));
            }
            return;
        }

        if (memory.menuOverlay.menuType === "subCategory") {
            const parentCategoryCopy = { ...memory.categories[memory.menuOverlay.menuData.categoryID] };

            const newList = [...parentCategoryCopy.subCategories];
            const currentIndex = newList.indexOf(memory.menuOverlay.menuData.subCategoryID);
            if (currentIndex > 0) {
                parentCategoryCopy.subCategories = moveUpList(newList, currentIndex);
                dispatch(updateCategory(parentCategoryCopy));
            }
            return;
        }

        if (memory.menuOverlay.menuType === "note") {
            if (memory.menuOverlay.menuData.subCategoryID) {
                const subCategoryCopy = { ...memory.subCategories[memory.menuOverlay.menuData.subCategoryID] };
                const newList = [...subCategoryCopy.notes];
                const currentIndex = newList.indexOf(memory.menuOverlay.menuData.noteID);
                if (currentIndex > 0) {
                    subCategoryCopy.notes = moveUpList(newList, currentIndex);
                    dispatch(updateSubCategory(subCategoryCopy));
                }
                return;
            }

            const categoryCopy = { ...memory.categories[memory.menuOverlay.menuData.categoryID] };
            const newList = [...categoryCopy.notes];
            const currentIndex = newList.indexOf(memory.menuOverlay.menuData.noteID);
            if (currentIndex > 0) {
                categoryCopy.notes = moveUpList(newList, currentIndex);
                dispatch(updateCategory(categoryCopy));
            }
        }
    };

    const moveDownList = (newList: string[], index: number) => {
        const temp = newList[index + 1];
        newList[index + 1] = newList[index];
        newList[index] = temp;
        return [...newList];
    };

    const moveUpList = (newList: string[], index: number) => {
        const temp = newList[index - 1];
        newList[index - 1] = newList[index];
        newList[index] = temp;
        return [...newList];
    };

    return (
        <View style={arrowStyles.arrowsContainer}>
            <TouchableOpacity onPress={handleUpPress}>
                <Entypo name="arrow-bold-up" style={arrowStyles.arrowUp} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDownPress}>
                <Entypo name="arrow-bold-down" style={arrowStyles.arrowUp} />
            </TouchableOpacity>
        </View>
    );
};

export default MoveArrows;
