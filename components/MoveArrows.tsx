import React from "react";
import { View, TouchableOpacity } from "react-native";
import arrowStyles from "../styles/arrowStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { AppDispatch } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setArrows, updateCategory, updateCategoryList, updateMenuOverlay, updateSubCategory } from "../redux/slice";
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
                const temp = newList[currentIndex + 1];
                newList[currentIndex + 1] = newList[currentIndex];
                newList[currentIndex] = temp;
                dispatch(updateCategoryList(newList));
            }
        }
    };

    const handleUpPress = () => {
        if (memory.menuOverlay.menuType === "category") {
            const newList = [...memory.categoryList];
            const currentIndex = newList.indexOf(memory.menuOverlay.menuData.categoryID);
            if (currentIndex > 0) {
                const temp = newList[currentIndex - 1];
                newList[currentIndex - 1] = newList[currentIndex];
                newList[currentIndex] = temp;
                dispatch(updateCategoryList(newList));
            }
        }
    };

    return (
        // <View style={arrowStyles.modalContainer}>
        <View style={arrowStyles.arrowsContainer}>
            <TouchableOpacity onPress={handleUpPress}>
                <Entypo name="arrow-bold-up" style={arrowStyles.arrowUp} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDownPress}>
                <Entypo name="arrow-bold-down" style={arrowStyles.arrowUp} />
            </TouchableOpacity>
        </View>
        // </View>
    );
};

export default MoveArrows;
