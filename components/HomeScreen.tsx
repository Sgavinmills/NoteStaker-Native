import { FlatList, TouchableOpacity, Text, View, StatusBar, TouchableWithoutFeedback, AppState } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/styles";
import categoryStyles from "../styles/categoryStyles";
import { RootState } from "../redux/store/store";
import CategoryTile from "./CategoryTile";
import { useEffect, useRef, useState } from "react";
import CategoryModal from "./CategoryModal";
import MenuDisplay from "./MenuDisplay";
import { AppDispatch } from "../redux/store/store";
import { resetMemory, updateMenuOverlay } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { Category } from "../types";

const HomeScreen: React.FC = () => {
    const categoryList = useSelector((state: RootState) => state.memory.categoryList);
    // const categories = useSelector((state: RootState) => state.memory.categories);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    // const categories = useSelector((state: RootState) => state.memory.categories);
    const dispatch = useDispatch<AppDispatch>();

    const [newCatModalVisible, setNewCatModalVisible] = useState(false);
    const [scrollTo, setScrollTo] = useState<null | number>(null);
    const [closeAllCategories, setCloseAllCategories] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    // const catsToShow: Category[] = [];
    // // categoryList.forEach((catID) => {
    // //     const cat = categories[catID];
    // //     catsToShow.push(cat);
    // // });
    const handleNewCategoryPress = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        setNewCatModalVisible(true);
    };

    // Used this to purge memory. BUt we might be better off just uninstalling app....
    // initial state might even load kindly then.
    // we'll prob just reinstall to get a blank state
    // and implement a button that will load json data.

    // console.log("dispatching");
    // dispatch(resetMemory());

    console.log("----Homescreen render----");
    const handleCloseAllCategoriesPress = () => {
        setCloseAllCategories(true);
    };

    useEffect(() => {
        if (scrollTo) {
            flatListRef.current?.scrollToOffset({ offset: scrollTo, animated: true });
            setScrollTo(null);
        }
    }, [scrollTo]);

    const renderCategory = ({ item, index }: { item: string; index: number }) => (
        <CategoryTile
            categoryID={item}
            index={index}
            isLastCategory={index === categoryList.length - 1 ? true : false}
            closeAllCategories={closeAllCategories}
            setCloseAllCategories={setCloseAllCategories}
        />
    );

    const handleOutsideMenuPress = () => {
        console.log("---------------");
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsideMenuPress}>
            <View style={styles.mainContainer}>
                <StatusBar translucent={true} />
                {newCatModalVisible && (
                    <CategoryModal
                        setNewCatModalVisible={setNewCatModalVisible}
                        newCatModalVisible={newCatModalVisible}
                        catInfo={{ currentName: "", parentCat: "" }}
                    ></CategoryModal>
                )}
                <View style={styles.homeScreenButtonContainer}>
                    <TouchableOpacity onPress={handleCloseAllCategoriesPress}>
                        <Text style={categoryStyles.newCategoryText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNewCategoryPress}>
                        <Text style={categoryStyles.newCategoryText}>+</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    ref={flatListRef}
                    removeClippedSubviews={false}
                    style={categoryStyles.categoryListContainer}
                    data={categoryList}
                    renderItem={renderCategory}
                    keyExtractor={(cat) => cat}
                />
                {overlay.isShowing && <MenuDisplay setScrollTo={setScrollTo} overlay={overlay} />}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default HomeScreen;
