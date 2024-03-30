import { FlatList, TouchableOpacity, Text, View, StatusBar, TouchableWithoutFeedback, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/styles";
import categoryStyles from "../styles/categoryStyles";
import { RootState } from "../redux/reducers/reducers";
import CategoryTile from "./CategoryTile";
import { Category } from "../types";
import { useState } from "react";
import CategoryModal from "./CategoryModal";
import MenuDisplay from "./MenuDisplay";
import { AppDispatch } from "../redux/store/store";
import { updateMenuOverlay } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";

// A good refactor will extract all the memory stuff and in components just ask for "notesToRender" type stuff, so then if we change
// the underlying data to a databse or whatever its simple enough, essentially accessing through an api.
const HomeScreen: React.FC = () => {
    const memory = useSelector((state: RootState) => state.memory);
    const [newCatModalVisible, setNewCatModalVisible] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const catsForHomeScreen: Category[] = [];
    memory.categoryList.forEach((cat) => {
        if (memory.categories[cat]) {
            catsForHomeScreen.push(memory.categories[cat]);
        }
    });

    const renderCategory = ({ item, index }: { item: Category; index: number }) => (
        <CategoryTile
            category={item}
            index={index}
            isLastCategory={index === catsForHomeScreen.length - 1 ? true : false}
        />
    );

    const handleOutsideMenuPress = () => {
        if (memory.menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsideMenuPress}>
            <View style={styles.mainContainer}>
                <StatusBar translucent={true} />
                <CategoryModal
                    setNewCatModalVisible={setNewCatModalVisible}
                    newCatModalVisible={newCatModalVisible}
                    catInfo={{ currentName: "", parentCat: "" }}
                ></CategoryModal>
                <TouchableOpacity onPress={() => setNewCatModalVisible(true)}>
                    <Text style={categoryStyles.newCategoryText}>+</Text>
                </TouchableOpacity>

                <FlatList
                    removeClippedSubviews={false}
                    style={categoryStyles.categoryListContainer}
                    data={catsForHomeScreen}
                    renderItem={renderCategory}
                    keyExtractor={(cat) => cat.id}
                />
                {memory.menuOverlay.isShowing && <MenuDisplay overlay={memory.menuOverlay} />}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default HomeScreen;
