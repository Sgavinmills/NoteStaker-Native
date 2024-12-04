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
    Dimensions,
    Platform,
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
import { scrollToCategory, updateMenuOverlay, updateNote } from "../redux/slice";
import { getEmptyOverlay, printCategories, printNotes, printSubCategories } from "../utilFuncs/utilFuncs";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { MenuOverlay, reminderConfig, Location } from "../types";
import SearchCategoryTile from "./SearchTile";
import SubtleMessage from "./SubtleMessage";
import * as Notifications from "expo-notifications";

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// TODO  - sort components into folders
const HomeScreen: React.FC = () => {
    const dontForgetMeList = useSelector((state: RootState) => state.memory.dontForgetMe);
    const categoryList = useSelector((state: RootState) => state.memory.categoryList);
    const scrollToOffset = useSelector((state: RootState) => state.memory.scrollToOffset);

    const dispatch = useDispatch<AppDispatch>();

    const [newCatModalVisible, setNewCatModalVisible] = useState(false);

    const [scrollTo, setScrollTo] = useState<number>(-1);
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

    const dontForgetMe = () => {
        return Object.values(dontForgetMeList).some((dontForgetMeRef) => {
            const currentTime = new Date();
            const reminderTime = new Date(dontForgetMeRef.date);
            return reminderTime.getTime() < currentTime.getTime();
        });
    };

    // console.log("Homescreen re-render");
    // back button closes overlay rather than normal behaviour
    useEffect(() => {
        const backAction = () => {
            if (moving) {
                setMoving("");
                return true;
            }
            setCloseAllCategories(true);
            setScrollTo(0); // todo, prob do this through dispatch like other scrollto?
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
                subMenu: "",
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
    };

    useEffect(() => {
        if (scrollToOffset > -1) {
            const screenHeight = Dimensions.get("window").height;

            const offset = scrollToOffset;
            flatListRef.current?.scrollToOffset({ offset: offset, animated: true });
            dispatch(scrollToCategory(-1));
        }
    }, [scrollToOffset]);

    useEffect(() => {
        if (scrollTo !== null && scrollTo > -1) {
            const screenHeight = Dimensions.get("window").height;
            // const offset = scrollTo - screenHeight / 3;

            const offset = scrollTo;
            flatListRef.current?.scrollToOffset({ offset: offset, animated: true });
            setScrollTo(-1);
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

    const handleDontForgetMePress = () => {};

    return (
        <TouchableWithoutFeedback onPress={handleOutsideMenuPress}>
            <>
                <StatusBar translucent={true} backgroundColor="transparent" />
                {newCatModalVisible && (
                    <CategoryModal
                        setNewCatModalVisible={setNewCatModalVisible}
                        newCatModalVisible={newCatModalVisible}
                        catInfo={{ currentName: "", parentCat: "" }}
                    ></CategoryModal>
                )}
                <View style={styles.mainContainer}>
                    <SubtleMessage />
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
                <MenuDisplay setCloseAllCategories={setCloseAllCategories} />
            </>
        </TouchableWithoutFeedback>
    );
};

export default HomeScreen;
