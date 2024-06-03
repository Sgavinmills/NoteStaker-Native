import { Button, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import modalStyles from "../styles/modalStyles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { addCategory, addSubCategory, updateMenuOverlay, updateSubCategory } from "../redux/slice";
import { AppDispatch } from "../redux/store/store";
import { updateCategory } from "../redux/slice";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
interface TileProps {
    setNewCatModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    newCatModalVisible: boolean;
    catInfo: {
        currentName: string;
        parentCat: string;
    };
}

// TODO - See if can remove some state from here. At the moment does need all category acces to compare names, but could we pass it a
// static list since they cant change until after modal is closed? - no, where would we even get said list.

const CategoryModal: React.FC<TileProps> = ({ setNewCatModalVisible, newCatModalVisible, catInfo }) => {
    const categories = useSelector((state: RootState) => state.memory.categories);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const parentCatHasNotes = catInfo.parentCat ? categories[catInfo.parentCat].notes.length > 0 : false;
    const dispatch = useDispatch<AppDispatch>();

    const [newCategoryName, setNewCategoryName] = useState(catInfo.currentName);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (text: string) => {
        if (error) {
            setError(false);
        }
        setNewCategoryName(text);
    };

    const closeMenuOverlay = () => {
        dispatch(updateMenuOverlay(getEmptyOverlay()));
    };

    const updateCurrentCategory = () => {
        if (catInfo.parentCat) {
            dispatch(updateSubCategory({ ...subCategories[overlay.menuData.subCategoryID], name: newCategoryName }));
            return;
        }

        dispatch(updateCategory({ ...categories[overlay.menuData.categoryID], name: newCategoryName }));
    };

    const addNewCategory = () => {
        if (catInfo.parentCat) {
            dispatch(addSubCategory({ name: newCategoryName, parentCategoryID: overlay.menuData.categoryID }));
            return;
        }

        dispatch(addCategory(newCategoryName));
    };

    const validCatName = () => {
        if (overlay.menuType === "category") {
            const currentSubCats = categories[overlay.menuData.categoryID].subCategories;
            return !currentSubCats.some((subCatRef) => {
                return subCategories[subCatRef.id].name === newCategoryName;
            });
        }

        return !Object.values(categories).some((cat) => {
            return cat.name === newCategoryName;
        });
    };

    const handleSubmit = () => {
        if (!newCategoryName) {
            setError(true);
            setErrorMessage("");
            return;
        }

        if (validCatName()) {
            if (catInfo.currentName) {
                updateCurrentCategory();
            } else {
                addNewCategory();
            }

            setNewCatModalVisible(false);
            setNewCategoryName("");
            closeMenuOverlay();
        } else {
            setError(true);
            if (newCategoryName === "Reminders") {
                setErrorMessage("Category name must be unique. Reminders is a protected category name");
            } else {
                setErrorMessage("Category name must be unique.");
            }
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
                        autoFocus
                    />
                    <View style={modalStyles.modalButtonContainer}>
                        <Button title="Submit" onPress={handleSubmit} />
                    </View>
                    {parentCatHasNotes && (
                        <View style={modalStyles.errorTextContainer}>
                            <Text style={modalStyles.errorText}>
                                This category already contains notes. If you create a sub-category they will all be
                                moved inside the new sub-category.
                            </Text>
                        </View>
                    )}
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
