import {
    FlatList,
    TouchableOpacity,
    Text,
    View,
    StatusBar,
    TouchableWithoutFeedback,
    TextInput,
    BackHandler,
    Keyboard,
} from "react-native";
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
import SearchCategoryTile from "./SearchTile";

const HomeScreen: React.FC = () => {
    const categoryList = useSelector((state: RootState) => state.memory.categoryList);
    const dispatch = useDispatch<AppDispatch>();

    const [newCatModalVisible, setNewCatModalVisible] = useState(false);
    const [scrollTo, setScrollTo] = useState<null | number>(null);
    const [searchText, setSearchText] = useState("");
    const [closeAllCategories, setCloseAllCategories] = useState(false);
    const [isSearch, setIsSearch] = useState(false);

    const flatListRef = useRef<FlatList>(null);
    const searchInputRef = useRef<TextInput>(null);

    const [moving, setMoving] = useState<string>("");

    const showingSecureCategories = useSelector((state: RootState) => state.memory.canShowSecure.homeScreen);
    const catsForHomeScreen: string[] = [];
    categoryList.forEach((catRef) => {
        if (showingSecureCategories || !catRef.isSecure) {
            catsForHomeScreen.push(catRef.id);
        }
    });

    // console.log("Homescreen re-render");
    // back button closes overlay rather than normal behaviour
    useEffect(() => {
        const backAction = () => {
            if (moving) {
                setMoving("");
                return true;
            }
            setCloseAllCategories(true);
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove(); // Cleanup the event listener
    }, [moving]);

    const handleOpenMenuPress = () => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
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
                isSearchTile: false,
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
            isLastCategory={index === catsForHomeScreen.length - 1 ? true : false}
            closeAllCategories={closeAllCategories}
            setCloseAllCategories={setCloseAllCategories}
            moving={moving}
            setMoving={setMoving}
        />
    );

    const focusInput = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleOutsideMenuPress = () => {
        console.log("-------------------------------");
        // printCategories(categories);
        // printSubCategories(subCategories);
        // printNotes(notes);
    };

    const handleSearchPress = () => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
        }

        dispatch(updateMenuOverlay(getEmptyOverlay()));
        setIsSearch(true);
    };

    const handleSearchTextChange = (text: string) => {
        setSearchText(text);
    };

    const handleSearchBlur = () => {};

    return (
        <TouchableWithoutFeedback onPress={handleOutsideMenuPress}>
            <>
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
                        <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
                            {!isSearch ? (
                                <Text style={styles.searchText}>Search...</Text>
                            ) : (
                                <TextInput
                                    style={styles.searchText}
                                    onChangeText={handleSearchTextChange}
                                    onBlur={handleSearchBlur}
                                    value={searchText}
                                    autoFocus
                                    ref={searchInputRef}
                                    placeholder={"Enter search text..."}
                                ></TextInput>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleOpenMenuPress}>
                            <FontAwesome
                                name="ellipsis-v"
                                style={[categoryStyles.ellipsisIconText, categoryStyles.icons]}
                            />
                        </TouchableOpacity>
                    </View>
                    {isSearch ? (
                        <SearchCategoryTile searchText={searchText} setIsSearch={setIsSearch} focusInput={focusInput} />
                    ) : (
                        <FlatList
                            keyboardShouldPersistTaps={"handled"}
                            ref={flatListRef}
                            removeClippedSubviews={false}
                            style={categoryStyles.categoryListContainer}
                            data={catsForHomeScreen}
                            renderItem={renderCategory}
                            keyExtractor={(cat) => cat}
                        />
                    )}
                </View>
                <MenuDisplay setScrollTo={setScrollTo} setCloseAllCategories={setCloseAllCategories} />
            </>
        </TouchableWithoutFeedback>
    );
};

export default HomeScreen;
