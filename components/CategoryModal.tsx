import {
    Button,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import modalStyles from "../styles/modalStyles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewCategory } from "../memoryfunctions/memoryfunctions";

interface TileProps {
    setNewCatModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    newCatModalVisible: boolean;
}

const CategoryModal: React.FC<TileProps> = ({
    setNewCatModalVisible,
    newCatModalVisible,
}) => {
    const [newCategoryName, setNewCategoryName] = useState("");
    const dispatch = useDispatch();

    const handleAddCategory = () => {
        // TODO: Check category name is unique and not empty
        addNewCategory(dispatch, newCategoryName);
        setNewCatModalVisible(false);
        setNewCategoryName("");
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={newCatModalVisible}
            onRequestClose={() => {
                setNewCatModalVisible(false);
                setNewCategoryName("");
            }}
        >
            <View style={modalStyles.modalContainer}>
                <TouchableOpacity
                    style={modalStyles.modalCloseCategoryIconContainer}
                    onPress={() => {
                        setNewCatModalVisible(false);
                        setNewCategoryName("");
                    }}
                >
                    <Text style={modalStyles.newCategoryModalIconText}>
                        &minus;
                    </Text>
                </TouchableOpacity>
                <View style={modalStyles.modalTextInputContainer}>
                    <TextInput
                        style={modalStyles.modalInput}
                        placeholder="Enter category name"
                        onChangeText={(text) => setNewCategoryName(text)}
                        value={newCategoryName}
                    />
                </View>
                <View style={modalStyles.modalButtonContainer}>
                    <Button title="Submit" onPress={handleAddCategory} />
                </View>
            </View>
        </Modal>
    );
};

export default CategoryModal;
