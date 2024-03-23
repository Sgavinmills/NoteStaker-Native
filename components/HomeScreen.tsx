import { TouchableOpacity, Text, View, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import styles from "../styles/styles";
import categoryStyles from "../styles/categoryStyles";
import { RootState } from "../redux/reducers/reducers";
import CategoryTile from "./CategoryTile";
import { Category } from "../types";
import { useState } from "react";
import CategoryModal from "./CategoryModal";
import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist";
import { useDispatch } from "react-redux";
import { updateCategories } from "../redux/slice";
import { ScaleDecorator } from "react-native-draggable-flatlist";
const HomeScreen: React.FC = () => {
    const memory = useSelector((state: RootState) => state.memory);
    const [newCatModalVisible, setNewCatModalVisible] = useState(false);
    const dispatch = useDispatch();
    const onDragEnd = ({ data: newData }: { data: Category[] }) => {
        dispatch(updateCategories(newData));
    };

    const renderCategory = ({
        item,
        getIndex,
        drag,
        isActive,
    }: {
        item: Category;
        getIndex: () => number | undefined;
        drag: () => void;
        isActive: boolean;
    }) => (
        <ScaleDecorator>
            <CategoryTile
                category={item}
                index={getIndex()}
                isLastCategory={getIndex() === memory.categories.length - 1 ? true : false}
                drag={drag}
                isActive={isActive}
            />
        </ScaleDecorator>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent={true} />
            <CategoryModal
                setNewCatModalVisible={setNewCatModalVisible}
                newCatModalVisible={newCatModalVisible}
            ></CategoryModal>
            <TouchableOpacity onPress={() => setNewCatModalVisible(true)}>
                <Text style={categoryStyles.newCategoryText}>+</Text>
            </TouchableOpacity>
            <NestableScrollContainer>
                <NestableDraggableFlatList
                    removeClippedSubviews={false}
                    style={categoryStyles.categoryListContainer}
                    data={memory.categories}
                    onDragEnd={onDragEnd}
                    renderItem={renderCategory}
                    keyExtractor={(cat) => cat.id}
                />
            </NestableScrollContainer>
        </View>
    );
};

export default HomeScreen;
