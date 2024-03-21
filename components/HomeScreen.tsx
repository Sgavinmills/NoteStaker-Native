import { FlatList, TouchableOpacity, Text, View, StatusBar } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/styles";
import categoryStyles from "../styles/categoryStyles";
import { RootState } from "../redux/reducers/reducers";
import CategoryTile from "./CategoryTile";
import { Category } from "../types";
import { useState } from "react";
import CategoryModal from "./CategoryModal";

const HomeScreen: React.FC = () => {
    const memory = useSelector((state: RootState) => state.memory);

    const [newCatModalVisible, setNewCatModalVisible] = useState(false);

    const renderCategory = ({ item, index }: { item: Category; index: number }) => (
        <CategoryTile category={item} index={index} />
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

            <FlatList
                style={categoryStyles.categoryListContainer}
                data={memory.categories}
                renderItem={renderCategory}
                keyExtractor={(cat) => cat.name}
            />
        </View>
    );
};

export default HomeScreen;
