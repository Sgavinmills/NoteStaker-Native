import { FlatList, TouchableOpacity, Text, View, StatusBar, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/styles";
import categoryStyles from "../styles/categoryStyles";
import { RootState } from "../redux/store/store";
import CategoryTile from "./CategoryTile";
import { useEffect, useRef, useState } from "react";
import CategoryModal from "./CategoryModal";
import MenuDisplay from "./MenuDisplay";
import { AppDispatch } from "../redux/store/store";
import { updateMenuOverlay } from "../redux/slice";
import { getEmptyOverlay, printCategories, printNotes, printSubCategories } from "../utilFuncs/utilFuncs";
import { FontAwesome } from "@expo/vector-icons";
import { MenuOverlay } from "../types";

const HomeScreen: React.FC = () => {
    const categoryList = useSelector((state: RootState) => state.memory.categoryList);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const dispatch = useDispatch<AppDispatch>();

    const [newCatModalVisible, setNewCatModalVisible] = useState(false);
    const [scrollTo, setScrollTo] = useState<null | number>(null);
    const [closeAllCategories, setCloseAllCategories] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    const handleOpenMenuPress = () => {
        if (overlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        const newOverlay: MenuOverlay = {
            isShowing: true,
            menuType: "homeScreen",
            menuData: {
                noteID: "",
                categoryID: "",
                subCategoryID: "",
                categoryIndex: null,
                subCategoryIndex: null,
                noteIndex: null,
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
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
        // console.log("-------------------------------");
        // printCategories(categories);
        // printSubCategories(subCategories);
        // printNotes(notes);

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
                <View style={styles.homeScreenTopBarContainer}>
                    <TouchableOpacity style={styles.searchContainer}>
                        <Text style={styles.searchText}>Search...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleOpenMenuPress}>
                        <FontAwesome
                            name="ellipsis-v"
                            style={[categoryStyles.ellipsisIconText, categoryStyles.icons]}
                        />
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
                {overlay.isShowing && (
                    <MenuDisplay
                        setScrollTo={setScrollTo}
                        overlay={overlay}
                        setCloseAllCategories={setCloseAllCategories}
                    />
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default HomeScreen;
