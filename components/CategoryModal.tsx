import { Button, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../styles/styles'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewCategory } from '../memoryfunctions/memoryfunctions';

interface TileProps {
  setNewCatModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  newCatModalVisible: boolean
}

const CategoryModal: React.FC<TileProps>= ({setNewCatModalVisible, newCatModalVisible}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const dispatch = useDispatch();

  const handleAddCategory = () => {
    // TODO: Check category name is unique and not empty
    addNewCategory(dispatch, newCategoryName)
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
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.modalCloseCategoryIconContainer}
        onPress={() => {
          setNewCatModalVisible(false);
          setNewCategoryName("");
        }}
      >
        <Text style={styles.newCategoryModalIconText}>&minus;</Text>
      </TouchableOpacity>
      <View style={styles.modalTextInputContainer}>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter category name"
          onChangeText={(text) => setNewCategoryName(text)}
          value={newCategoryName}
        />
      </View>
      <View style={styles.modalButtonContainer}>
        <Button title="Submit" onPress={handleAddCategory} />
      </View>
    </View>
  </Modal>
        
  );
}


export default CategoryModal;