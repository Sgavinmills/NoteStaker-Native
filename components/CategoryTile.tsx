import { Text, View, TouchableWithoutFeedback, TouchableOpacity, GestureResponderEvent, Keyboard } from "react-native";
import { useEffect, useState } from "react";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import SubCategoryTile from "./SubCategoryTile";
import { MenuOverlay, HeightUpdateInfo, NewNoteData, Note, IDs } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import NoteTile from "./NoteTile";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import {
    createNewNote,
    removeFromShowSecureNote,
    updateCategoryHeight,
    updateCategoryList,
    updateCategorySilently,
    updateMenuOverlay,
} from "../redux/slice";
import { getEmptyOverlay, moveDownList, moveToEnd, moveToStart, moveUpList } from "../utilFuncs/utilFuncs";
import * as ImagePicker from "expo-image-picker";
interface TileProps {
    categoryID: string;
    index: number;
    isLastCategory: boolean;
    setCloseAllCategories: React.Dispatch<React.SetStateAction<boolean>>;
    closeAllCategories: boolean;
    moving: string;
    setMoving: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryTile: React.FC<TileProps> = ({
    categoryID,
    index,
    isLastCategory,
    closeAllCategories,
    setCloseAllCategories,
    moving,
    setMoving,
}) => {
    const category = useSelector((state: RootState) => state.memory.categories[categoryID]);
    const showSecure = useSelector((state: RootState) => state.memory.canShowSecure);

    const [securePlaceholderTile, setSecurePlaceholderTile] = useState(false);
    const isSelected = category.isSelected;
    const showingSecure = showSecure.homeScreen || showSecure.categories.includes(categoryID);
    console.log("--re render category: " + category.name);
    const notesForCat: string[] = [];
    category.notes.forEach((noteRef) => {
        if (showingSecure || !noteRef.isSecure) {
            notesForCat.push(noteRef.id);
        }
    });

    const dontForgetMeList = useSelector((state: RootState) => state.memory.dontForgetMe);
    const checkDontForgetMe = () => {
        if (category.notes.length > 0) {
            return category.notes.some((ref) => {
                const dontForgetMeRef = dontForgetMeList[ref.id];
                if (dontForgetMeRef) {
                    if (dontForgetMeRef.location[0] === categoryID) {
                        const currentTime = new Date();
                        const reminderTime = new Date(dontForgetMeRef.date);
                        return reminderTime.getTime() < currentTime.getTime();
                    }
                }

                return false;
            });
        } else {
            return Object.values(dontForgetMeList).some((dontForgetMeRef) => {
                return dontForgetMeRef.location[0] === categoryID;
            });
        }
    };
    const dontForgetMe = checkDontForgetMe();

    useEffect(() => {
        if (category.isSelected) {
            const categoryCopy = { ...category };
            categoryCopy.isSelected = false;
            dispatch(updateCategorySilently(categoryCopy));
        }
    }, []);

    const subCatsForCat: string[] = [];
    category.subCategories.forEach((subCatRef) => {
        if (showingSecure || !subCatRef.isSecure) {
            subCatsForCat.push(subCatRef.id);
        }
    });

    useEffect(() => {
        // needed for when a solitary note is deleted so the border radius is added properly
        if (subCatsForCat.length === 0 && notesForCat.length === 0) {
            setIsExpanded(false);
        }
    }, [notesForCat]);

    const dispatch = useDispatch<AppDispatch>();

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (closeAllCategories && isExpanded) {
            setIsExpanded(false);
            setCloseAllCategories(false);
        }
    }, [closeAllCategories]);

    const toggleExpansion = () => {
        if (isExpanded) {
            if (showingSecure) {
                // TODO  - NEED TO CHECK ANY SUB CATS ALSO HAVE THEIR IDS REMOVED FROM THE SECURENOTE LIST

                dispatch(removeFromShowSecureNote(categoryID));
            }
        }
        setIsExpanded(!isExpanded);
    };

    const handleTilePress = () => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
        }

        const isEmpty = notesForCat.length === 0 && category.subCategories.length === 0;
        if (isEmpty) {
            addNewNote();
            if (!isExpanded) {
                toggleExpansion();
            }
            return;
        }

        // if has subcats but all are secure then display a temp warning
        if (
            !showingSecure &&
            category.subCategories.length > 0 &&
            category.subCategories.every((subCatRef) => subCatRef.isSecure)
        ) {
            setSecurePlaceholderTile(true);
            setTimeout(() => {
                setSecurePlaceholderTile(false);
            }, 500);
        }
        toggleExpansion();
    };
    const addNewNote = () => {
        dispatch(updateMenuOverlay(getEmptyOverlay()));

        const newNoteData: NewNoteData = {
            categoryID: categoryID,
            subCategoryID: "",
            imageURI: "",
            noteInsertIndex: 0,
        };
        dispatch(createNewNote(newNoteData));
    };

    const handleAddNotePress = () => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
        }

        if (moving) {
            setMoving("");
            return true;
        }

        addNewNote();
        if (!isExpanded) {
            toggleExpansion();
        }
    };

    const handleLongPressAddNote = (event: GestureResponderEvent) => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
        }

        pickImage();
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const imageURI = result.assets[0].uri;

            const newNoteData: NewNoteData = {
                categoryID: categoryID,
                subCategoryID: "",
                imageURI: imageURI,
                noteInsertIndex: 0,
            };
            dispatch(createNewNote(newNoteData));
        }
        setIsExpanded(true);
    };

    const handleMenuPress = () => {
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
            menuType: "category",
            menuData: {
                noteID: "",
                categoryID: category.id,
                subCategoryID: "",
                categoryIndex: index,
                subCategoryIndex: null,
                noteIndex: null,
                isSearchTile: false,
                subMenu: "",
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
    };

    const handleCategoryLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        const update: HeightUpdateInfo = {
            newHeight: height,
            categoryIndex: index,
            subCategoryIndex: -1,
            noteIndex: -1,
        };
        dispatch(updateCategoryHeight(update));
    };

    const handleLongPress = () => {
        setCloseAllCategories(true);
        setMoving(categoryID);
    };

    const categoryList = useSelector((state: RootState) => state.memory.categoryList);

    const handleUpPress = () => {
        const categoryListCopy = [...categoryList];

        const currentIndex = categoryListCopy.findIndex((ref) => ref.id === categoryID);
        if (currentIndex > 0) {
            const newList = moveUpList(categoryListCopy, currentIndex);
            dispatch(updateCategoryList(newList));
        }
        return;
    };

    const handleUpToTopPress = () => {
        const categoryListCopy = [...categoryList];

        const currentIndex = categoryListCopy.findIndex((ref) => ref.id === categoryID);
        if (currentIndex > 0) {
            const newList = moveToStart(categoryListCopy, currentIndex);
            dispatch(updateCategoryList(newList));
        }
        return;
    };

    const handleDownPress = () => {
        const categoryListCopy = [...categoryList];

        const currentIndex = categoryListCopy.findIndex((ref) => ref.id === categoryID);
        if (currentIndex < categoryListCopy.length - 1) {
            const newList = moveDownList(categoryListCopy, currentIndex);
            dispatch(updateCategoryList(categoryListCopy));
        }
        return;
    };

    const handleDownToBottomPress = () => {
        const categoryListCopy = [...categoryList];

        const currentIndex = categoryListCopy.findIndex((ref) => ref.id === categoryID);
        if (currentIndex < categoryListCopy.length - 1) {
            const newList = moveToEnd(categoryListCopy, currentIndex);
            dispatch(updateCategoryList(categoryListCopy));
        }
        return;
    };

    return (
        <View onLayout={handleCategoryLayout} style={isLastCategory && categoryStyles.lastMargin}>
            <TouchableWithoutFeedback onPress={handleTilePress} onLongPress={handleLongPress}>
                <View
                    style={[
                        categoryStyles.categoryTile,
                        index === 0 && categoryStyles.categoryTileFirst,
                        categoryStyles.topRadius,
                        !isExpanded && categoryStyles.bottomRadius,
                        moving === categoryID && categoryStyles.categoryTileSelected,
                        isSelected && categoryStyles.categoryTileSelected,
                    ]}
                >
                    {dontForgetMe && !isExpanded && (
                        <View style={categoryStyles.dontForgetMeContainer}>
                            <Ionicons name="notifications-outline" style={categoryStyles.dontForgetMeBell} />
                        </View>
                    )}
                    <View style={categoryStyles.categoryTextContainer}>
                        <Text style={categoryStyles.categoryText} adjustsFontSizeToFit={true} numberOfLines={1}>
                            {category.isSecure && (
                                <FontAwesome name="lock" style={categoryStyles.padlock}></FontAwesome>
                            )}
                            {category.isSecure && "  "} {category.name}
                        </Text>
                    </View>
                    <View style={categoryStyles.tileIconsContainer}>
                        {moving === categoryID ? (
                            <>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={handleUpToTopPress}>
                                        <MaterialIcons
                                            name="keyboard-double-arrow-up"
                                            style={[categoryStyles.categoryText, categoryStyles.moveArrowsSmall]}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleUpPress}>
                                        <Entypo
                                            name="arrow-bold-up"
                                            style={[categoryStyles.categoryText, categoryStyles.moveArrows]}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleDownPress}>
                                        <Entypo
                                            name="arrow-bold-down"
                                            style={[categoryStyles.categoryText, categoryStyles.moveArrows]}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleDownToBottomPress}>
                                        <MaterialIcons
                                            name="keyboard-double-arrow-down"
                                            style={[categoryStyles.categoryText, categoryStyles.moveArrowsSmall]}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                {category.subCategories.length === 0 && (
                                    <TouchableOpacity onPress={handleAddNotePress} onLongPress={handleLongPressAddNote}>
                                        <FontAwesome
                                            name="plus"
                                            style={[categoryStyles.plusIconText, categoryStyles.icons]}
                                        />
                                    </TouchableOpacity>
                                )}
                                <FontAwesome
                                    name={isExpanded ? "caret-up" : "caret-down"}
                                    style={[categoryStyles.caretIconText, categoryStyles.icons]}
                                />
                                <TouchableOpacity onPress={handleMenuPress}>
                                    <FontAwesome
                                        name="ellipsis-v"
                                        style={[categoryStyles.ellipsisIconText, categoryStyles.icons]}
                                    />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {securePlaceholderTile && <PlaceholderTile />}
            {isExpanded &&
                subCatsForCat.length > 0 &&
                subCatsForCat.map((subCatID, subCatIndex) => {
                    return (
                        <SubCategoryTile
                            parentCategoryID={category.id}
                            isLastCategory={isLastCategory}
                            subCategoryID={subCatID}
                            isLastSubCategory={subCatIndex === subCatsForCat.length - 1}
                            key={subCatID}
                            index={subCatIndex}
                            parentCategoryIndex={index}
                            moving={moving}
                            setMoving={setMoving}
                        />
                    );
                })}
            {isExpanded &&
                category.subCategories.length == 0 &&
                notesForCat.map((noteID, noteIndex) => {
                    return (
                        <NoteTile
                            index={Number(noteIndex)}
                            parentCategoryIndex={index}
                            noteID={noteID}
                            categoryID={categoryID}
                            subCategoryID={""}
                            isLastCategory={isLastCategory}
                            isLastNote={noteIndex === notesForCat.length - 1}
                            key={noteID}
                            subCategoryIndex={-1}
                            isSearchTile={false}
                            moving={moving}
                            setMoving={setMoving}
                        />
                    );
                })}
        </View>
    );
};

export default CategoryTile;

const PlaceholderTile: React.FC = () => {
    return (
        <View
            style={[
                categoryStyles.subCategoryTile,
                // addBottomTileMargin() && categoryStyles.lastMargin,
                categoryStyles.bottomRadius,
            ]}
        >
            <View style={[categoryStyles.categoryTextContainer, { flexDirection: "row", alignItems: "center" }]}>
                <Text style={categoryStyles.subCategoryText} adjustsFontSizeToFit={true} numberOfLines={1}>
                    <FontAwesome name="lock" style={categoryStyles.padlock}></FontAwesome>
                    {"  "}
                    Subcategories are secured
                    {"  "}
                    <FontAwesome name="lock" style={categoryStyles.padlock}></FontAwesome>
                </Text>
            </View>
        </View>
    );
};
