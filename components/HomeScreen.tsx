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
import * as Device from "expo-device";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const HomeScreen: React.FC = () => {
    const dontForgetMeList = useSelector((state: RootState) => state.memory.dontForgetMe);
    const categoryList = useSelector((state: RootState) => state.memory.categoryList);
    const scrollToOffset = useSelector((state: RootState) => state.memory.scrollToOffset);

    const [expoPushToken, setExpoPushToken] = useState("");
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        // so when app loads this is the first thing that happens, useEffect registers for push notifications which does the following:
        // -- it checks if were android and if so sets up a notificationchannel with id "default"
        // -- then checks were a physucal device and gets permissions for notifications
        // -- then gets the expo push token based on our projects id
        // -- once complete it sets the expo push token into the expoPushTOken state
        registerForPushNotificationsAsync().then((token) => token && setExpoPushToken(token));

        if (Platform.OS === "android") {
            // a promise which resolves to an array of channels.
            // which appears to be 2 built in expo channels and then the third one that we made in the register function
            Notifications.getNotificationChannelsAsync().then((value) => setChannels(value ?? []));
        }
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            // listners registered by this method will be called whenever a notification is receivded while the app is running
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            // listners regisrted by this method will be called wheneber a user interacts with a notifcation (eg taps on it)
            console.log("tapped on");
        });

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

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

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }

        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                throw new Error("Project ID not found");
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId: Constants?.expoConfig?.extra?.eas.projectId,
                })
            ).data;
            console.log(token);
        } catch (e) {
            token = `${e}`;
        }
    } else {
        alert("Must use physical device for Push Notifications");
    }

    return token;
}

export default HomeScreen;
