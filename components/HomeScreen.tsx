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

    const logNotes = () => {
        for (const noteId in memory.notes) {
            if (memory.notes.hasOwnProperty(noteId)) {
                const note = memory.notes[noteId];
                console.log(`Note ID: ${note.id}`);
                console.log(`Note: ${note.note}`);
                console.log("\n"); // Adding a new line for readability
            }
        }
    };

    const logCats = () => {
        for (const categoryId in memory.categories) {
            if (memory.categories.hasOwnProperty(categoryId)) {
                const category = memory.categories[categoryId];
                console.log(`Category ID: ${category.id}`);
                console.log(`Name: ${category.name}`);
                console.log(`Subcategories: ${category.subCategories.join(", ")}`);
                console.log(`Notes: ${category.notes.join(", ")}`);
                console.log("\n"); // Adding a new line for readability
            }
        }
    };

    const logSubCats = () => {
        for (const subCategoryId in memory.subCategories) {
            if (memory.subCategories.hasOwnProperty(subCategoryId)) {
                const subCategory = memory.subCategories[subCategoryId];
                console.log(`Subcategory ID: ${subCategory.id}`);
                console.log(`Name: ${subCategory.name}`);
                console.log(`Notes: ${subCategory.notes.join(", ")}`);
                console.log(`Parent Category: ${subCategory.parentCategory}`);
                console.log("\n"); // Adding a new line for readability
            }
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
                <View style={styles.logState}>
                    <Button title="Log notes" onPress={logNotes} />
                    <Button title="Log cats" onPress={logCats} />
                    <Button title="Log subCats" onPress={logSubCats} />

                    <TouchableOpacity onPress={() => setNewCatModalVisible(true)}>
                        <Text style={categoryStyles.newCategoryText}>+</Text>
                    </TouchableOpacity>
                </View>

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
