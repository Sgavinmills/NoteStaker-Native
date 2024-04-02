import { FlatList, TouchableOpacity, Text, View, StatusBar, TouchableWithoutFeedback, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/styles";
import categoryStyles from "../styles/categoryStyles";
import { RootState } from "../redux/reducers/reducers";
import CategoryTile from "./CategoryTile";
import { Category, CatHeight } from "../types";
import { useEffect, useRef, useState } from "react";
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
    const flatListRef = useRef<FlatList>(null);
    const catsForHomeScreen: Category[] = [];
    memory.categoryList.forEach((cat) => {
        if (memory.categories[cat]) {
            catsForHomeScreen.push(memory.categories[cat]);
        }
    });

    const [heightData, setHeightData] = useState<CatHeight[]>([]);
    const [scrollTo, setScrollTo] = useState("");
    const handleNewCategoryPress = () => {
        if (memory.menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        setNewCatModalVisible(true);
    };

    useEffect(() => {
        if (scrollTo === "category") {
            let offset = 0;
            const categoryIndex = memory.menuOverlay.menuData.categoryIndex;
            if (categoryIndex != null && categoryIndex >= 0) {
                for (let i = 0; i < categoryIndex; i++) {
                    offset += heightData[i].catHeight;
                }
                flatListRef.current?.scrollToOffset({ offset: offset, animated: true });
            }

            setScrollTo("");
        }

        if (scrollTo === "subCategory") {
            let offset = 0;
            // actually what we need to do is scroll to offset for all cats INC this one
            // and then subtract the height of the subcats after this one.
            // othewise we miss the main cat header.
            const categoryIndex = memory.menuOverlay.menuData.categoryIndex;
            if (categoryIndex != undefined && categoryIndex >= 0) {
                for (let i = 0; i <= categoryIndex; i++) {
                    offset += heightData[i].catHeight;
                }
                const subCategoryIndex = memory.menuOverlay.menuData.subCategoryIndex;
                if (subCategoryIndex != undefined && subCategoryIndex >= 0) {
                    const numOfSubs = memory.categories[memory.menuOverlay.menuData.categoryID].subCategories.length;
                    for (let j = subCategoryIndex; j < numOfSubs; j++) {
                        offset -= heightData[categoryIndex].subHeights[j].subHeight;
                    }
                }
                flatListRef.current?.scrollToOffset({ offset: offset, animated: true });
            }

            setScrollTo("");
        }

        if (scrollTo === "note") {
            let offset = 0;
            // to scroll to offset for all cats up to and inc this one
            // if there are subcats
            // then subtract the subcts below and any notes in the sub cat we're in below... (done)

            // if there are not subcats then just subtract the notes below...
            const categoryIndex = memory.menuOverlay.menuData.categoryIndex;
            if (categoryIndex != null && categoryIndex >= 0) {
                for (let i = 0; i <= categoryIndex; i++) {
                    offset += heightData[i].catHeight;
                }
                const subCategoryIndex = memory.menuOverlay.menuData.subCategoryIndex;
                if (subCategoryIndex != null && subCategoryIndex >= 0) {
                    const numOfSubs = memory.categories[memory.menuOverlay.menuData.categoryID].subCategories.length;
                    for (let j = subCategoryIndex + 1; j < numOfSubs; j++) {
                        offset -= heightData[categoryIndex].subHeights[j].subHeight;
                    }
                    const noteIndex = memory.menuOverlay.menuData.noteIndex;
                    if (noteIndex != null && noteIndex >= 0) {
                        const numOfNotes = memory.subCategories[memory.menuOverlay.menuData.subCategoryID].notes.length;
                        for (let k = noteIndex; k < numOfNotes; k++) {
                            offset -= heightData[categoryIndex].subHeights[subCategoryIndex].noteHeights[noteIndex];
                        }
                    }
                } else {
                    const noteIndex = memory.menuOverlay.menuData.noteIndex;
                    if (noteIndex != null && noteIndex >= 0) {
                        const numOfNotes = memory.categories[memory.menuOverlay.menuData.categoryID].notes.length;
                        for (let k = noteIndex; k < numOfNotes; k++) {
                            offset -= heightData[categoryIndex].noteHeights[noteIndex];
                        }
                    }
                }

                flatListRef.current?.scrollToOffset({ offset: offset, animated: true });
            }

            setScrollTo("");
        }
    }, [scrollTo]);

    const renderCategory = ({ item, index }: { item: Category; index: number }) => (
        <CategoryTile
            setHeightData={setHeightData}
            heightData={heightData}
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
                {newCatModalVisible && (
                    <CategoryModal
                        setNewCatModalVisible={setNewCatModalVisible}
                        newCatModalVisible={newCatModalVisible}
                        catInfo={{ currentName: "", parentCat: "" }}
                    ></CategoryModal>
                )}
                <TouchableOpacity onPress={handleNewCategoryPress}>
                    <Text style={categoryStyles.newCategoryText}>+</Text>
                </TouchableOpacity>

                <FlatList
                    ref={flatListRef}
                    removeClippedSubviews={false}
                    style={categoryStyles.categoryListContainer}
                    data={catsForHomeScreen}
                    renderItem={renderCategory}
                    keyExtractor={(cat) => cat.id}
                />
                {memory.menuOverlay.isShowing && <MenuDisplay setScrollTo={setScrollTo} overlay={memory.menuOverlay} />}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default HomeScreen;
