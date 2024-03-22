import { Button, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import modalStyles from "../styles/modalStyles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewCategory } from "../memoryfunctions/memoryfunctions";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";

interface TileProps {
    setNewCatModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    newCatModalVisible: boolean;
}

const CategoryModal: React.FC<TileProps> = ({ setNewCatModalVisible, newCatModalVisible }) => {
    const categories = useSelector((state: RootState) => state.memory.categories);

    const [newCategoryName, setNewCategoryName] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();

    const handleChange = (text: string) => {
        if (error) {
            setError(false);
        }
        setNewCategoryName(text);
    };

    const handleAddCategory = () => {
        if (!newCategoryName) {
            setError(true);
            setErrorMessage("");
            return;
        }

        if (
            !categories.some((cat) => {
                return cat.name === newCategoryName;
            })
        ) {
            addNewCategory(dispatch, newCategoryName);
            setNewCatModalVisible(false);
            setNewCategoryName("");
        } else {
            setError(true);
            setErrorMessage("Category name must be unique");
        }
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={newCatModalVisible}
            onRequestClose={() => {
                setNewCatModalVisible(false);
                setNewCategoryName("");
                setError(false);
            }}
        >
            <View style={modalStyles.modalContainer}>
                <TouchableOpacity
                    style={modalStyles.modalCloseCategoryIconContainer}
                    onPress={() => {
                        setNewCatModalVisible(false);
                        setNewCategoryName("");
                        setError(false);
                    }}
                >
                    <Text style={modalStyles.newCategoryModalIconText}>&minus;</Text>
                </TouchableOpacity>
                <View style={modalStyles.modalTextInputContainer}>
                    <TextInput
                        style={[modalStyles.modalInput, error && modalStyles.modalInputError]}
                        placeholder="Enter category name"
                        onChangeText={(text) => handleChange(text)}
                        value={newCategoryName}
                    />
                </View>
                <View style={modalStyles.modalButtonContainer}>
                    <Button title="Submit" onPress={handleAddCategory} />
                </View>
                {error && (
                    <View style={modalStyles.errorTextContainer}>
                        <Text style={modalStyles.errorText}>{errorMessage}</Text>
                    </View>
                )}
            </View>
        </Modal>
    );
};

export default CategoryModal;
