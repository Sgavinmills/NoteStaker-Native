import { Button, Modal, Text, TouchableOpacity, View } from "react-native";
import modalStyles from "../styles/modalStyles";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import {
    deleteCategory,
    deleteNote,
    deleteSubCategory,
    removeAllNotesFromCategory,
    removeAllNotesFromSubCategory,
    updateMemoryFromBackup,
    updateMenuOverlay,
    updateNote,
} from "../redux/slice";
import { DeleteInfo, Memory, Note } from "../types";
import { AppDispatch } from "../redux/store/store";
import { getEmptyOverlay, printCategories, printNotes, printSubCategories } from "../utilFuncs/utilFuncs";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

interface TileProps {
    setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    deleteModalVisible: boolean;
    deleteInfo: DeleteInfo;
    note?: Note; // need this cos dleteing photos doesnt have menuOverlay
    setCallingComponentVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO  repurpose this as ConfirmModal ? See if can reuse for 'rmove all notes from categoris' first.
// Defo, we're even confirming backup data now.
// BUt also, wanna find way to extract some methods... this modal file shouldnt be responsible for housing all these functions
const DeleteModal: React.FC<TileProps> = ({
    setDeleteModalVisible,
    deleteModalVisible,
    deleteInfo,
    note,
    setCallingComponentVisible,
}) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);

    // IMPORTANT TODO. MOVE BACKUP DATA INTO SEPARATE FILE SO DONT NEED FULL MEMORY ACCESS IN HERE EVERYTIME!
    // WOuld also like to trial what happens if its declared/called inside a calling function instead of here... would it still need to rerender constantly?!
    // this could potentially solve some other overlay issues... like dont need to know overlays state at all times, but when click a button THEN check overlay???
    const memory = useSelector((state: RootState) => state.memory);
    const dispatch = useDispatch<AppDispatch>();

    const deleteCat = () => {
        if (overlay.menuType === "category") {
            dispatch(deleteCategory(overlay.menuData.categoryID));
        }

        if (overlay.menuType === "subCategory") {
            const deleteInfo = {
                subCategoryID: overlay.menuData.subCategoryID,
                parentCategoryID: overlay.menuData.categoryID,
            };
            dispatch(deleteSubCategory(deleteInfo));
        }
        dispatch(updateMenuOverlay(getEmptyOverlay()));
    };

    const removeAllNotes = () => {
        if (overlay.menuType === "category") {
            dispatch(removeAllNotesFromCategory(overlay.menuData.categoryID));
        }

        if (overlay.menuType === "subCategory") {
            dispatch(removeAllNotesFromSubCategory(overlay.menuData.subCategoryID));
        }
        dispatch(updateMenuOverlay(getEmptyOverlay()));
    };

    const deleteImage = () => {
        if (note) {
            if (setCallingComponentVisible) {
                setCallingComponentVisible(false);
            }
            if (note.note === "") {
                dispatch(deleteNote(note.id));
                return;
            }

            const noteCopy = { ...note };
            dispatch(updateNote({ ...noteCopy, imageURI: "" }));
        }
    };

    const backupData = async () => {
        const { StorageAccessFramework } = FileSystem;

        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        // Check if permission granted
        if (permissions.granted) {
            // Get the directory uri that was approved
            let directoryUri = permissions.directoryUri;

            const data: Memory = {
                categories: memory.categories,
                subCategories: memory.subCategories,
                notes: memory.notes,
                categoryList: memory.categoryList,
            };

            const backup = JSON.stringify(data);
            // Create file and pass it's SAF URI

            const date = formatDate(new Date());
            const fileName = `noteStakerBackup-${date}`;
            console.log("Attempting to save backup data to: " + fileName);
            await StorageAccessFramework.createFileAsync(directoryUri, fileName, "application/json")
                .then(async (fileUri) => {
                    // Save data to newly created file
                    await FileSystem.writeAsStringAsync(fileUri, backup, { encoding: FileSystem.EncodingType.UTF8 });
                    console.log("Saved successfully");
                    dispatch(updateMenuOverlay(getEmptyOverlay()));
                    setDeleteModalVisible(false);

                    // TODO GET AN ONSCREEN ALERT. SUBTLE MSG?! - prob, but cant put it on this modal cos wanna close it.
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            alert("You must allow permission to save.");
        }
    };

    // TODO make a type for imported/exported data
    const importData = () => {
        pickDocument();
    };

    // this is by no means fool proof but at least provides some protection against importing junk data.
    const validateImportedData = (data: any): boolean => {
        const newData: Memory = data;
        if (!newData.notes || !newData.categories || !newData.subCategories || !newData.categoryList) {
            console.error("missing properties on data");
            return false;
        }

        printCategories(newData.categories);
        printSubCategories(newData.subCategories);
        printNotes(newData.notes);
        for (const [id, note] of Object.entries(newData.notes)) {
            if (!note.id || !note.locations || !note.locations[0]) {
                console.error("Issue validating notes");
                console.error(note.note);
                return false;
            }

            if (note.additionalInfo == undefined) {
                note.additionalInfo = "";
            }
            if (note.dateAdded == undefined) {
                note.dateAdded = "";
            }
            if (note.dateUpdated == undefined) {
                note.dateUpdated = "";
            }
            if (note.priority == undefined) {
                note.priority = "";
            }
            if (note.completed == undefined) {
                note.completed = false;
            }
            if (note.imageURI == undefined) {
                note.imageURI = "";
            }
            if (note.isNewNote == undefined) {
                note.isNewNote = false;
            }
            if (note.createdBy == undefined) {
                note.createdBy = "";
            }
            if (note.lastUpdatedBy == undefined) {
                note.lastUpdatedBy = "";
            }
            if (note.isSecureNote == undefined) {
                note.isSecureNote = false;
            }
        }

        for (const [id, subCategory] of Object.entries(newData.subCategories)) {
            if (
                !subCategory.id ||
                !subCategory.name ||
                !subCategory.notes ||
                !subCategory.location ||
                !subCategory.parentCategory
            ) {
                console.error("Issue validating subCategories");
                console.error(subCategory.name);
                return false;
            }

            if (subCategory.dateAdded == undefined) {
                subCategory.dateAdded = "";
            }
            if (subCategory.dateUpdated == undefined) {
                subCategory.dateUpdated = "";
            }

            if (subCategory.createdBy == undefined) {
                subCategory.createdBy = "";
            }
            if (subCategory.lastUpdatedBy == undefined) {
                subCategory.lastUpdatedBy = "";
            }
        }

        for (const [id, category] of Object.entries(newData.categories)) {
            if (!category.id || !category.name || !category.notes) {
                console.error("Issue validating categories");

                return false;
            }

            if (category.dateAdded == undefined) {
                category.dateAdded = "";
            }
            if (category.dateUpdated == undefined) {
                category.dateUpdated = "";
            }

            if (category.createdBy == undefined) {
                category.createdBy = "";
            }
            if (category.lastUpdatedBy == undefined) {
                category.lastUpdatedBy = "";
            }
        }

        printCategories(newData.categories);
        printSubCategories(newData.subCategories);
        printNotes(newData.notes);

        console.log(typeof newData);

        return true;
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: "application/json" });
            if (result) {
                if (result.assets) {
                    const pickedFile = result.assets[0];
                    // Read the file content
                    const fileContents = await FileSystem.readAsStringAsync(pickedFile.uri);
                    const newData: any = JSON.parse(fileContents);
                    const isValid = validateImportedData(newData);
                    if (isValid) {
                        dispatch(updateMemoryFromBackup(newData));
                        console.log("successfully restored");
                    } else {
                        console.error("Imported data is not valid format");
                    }
                    dispatch(updateMenuOverlay(getEmptyOverlay()));
                    setDeleteModalVisible(false);
                    // TODO - need some error handing if format is wrong.

                    // setFileContent(fileContents);
                    // TODO : This does work. But its a bit jerky. At lesat have a subtle msg if not a loading wheel.
                    // TODO GET AN ONSCREEN ALERT. SUBTLE MSG?! - prob, but cant put it on this modal cos wanna close it.
                }
            } else {
                console.error("result not found");
            }
        } catch (error) {
            console.error("Error picking document:", error);
        }
    };

    function formatDate(date: Date) {
        // Get date components
        let day = date.getDate().toString().padStart(2, "0");
        let month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
        let year = date.getFullYear().toString().slice(-2); // Last two digits of the year
        let hours = date.getHours().toString().padStart(2, "0");
        let minutes = date.getMinutes().toString().padStart(2, "0");

        // Concatenate the components
        let formattedDate = day + month + year + "-" + hours + minutes;

        return formattedDate;
    }

    const handleDelete = () => {
        switch (deleteInfo.deleteType) {
            case "deleteNote": {
                dispatch(deleteNote(overlay.menuData.noteID));
                dispatch(updateMenuOverlay(getEmptyOverlay()));
                break;
            }
            case "deleteCategory": {
                deleteCat();
                break;
            }
            case "removeAll": {
                removeAllNotes();
                break;
            }
            case "deleteImage": {
                deleteImage();
                break;
            }
            case "backupData": {
                backupData();
                break;
            }
            case "importData": {
                importData();
                break;
            }
        }
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={deleteModalVisible}
            onRequestClose={() => {
                setDeleteModalVisible(false);
            }}
        >
            <View style={modalStyles.modalContainer}>
                <TouchableOpacity
                    style={modalStyles.modalCloseCategoryIconContainer}
                    onPress={() => {
                        setDeleteModalVisible(false);
                    }}
                >
                    <Text style={modalStyles.newCategoryModalIconText}>&minus;</Text>
                </TouchableOpacity>
                <View style={modalStyles.modalTextInputContainer}>
                    <Text style={modalStyles.text}>{deleteInfo.deleteMessage}</Text>
                    <View style={modalStyles.deleteButtonContainer}>
                        <View style={modalStyles.deleteButton}>
                            <Button title="Confirm" onPress={handleDelete} />
                        </View>
                        <View style={modalStyles.deleteButton}>
                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setDeleteModalVisible(false);
                                }}
                            />
                        </View>
                    </View>
                    <Text style={modalStyles.additionalMessageText}>{deleteInfo.additionalMessage}</Text>
                </View>
            </View>
        </Modal>
    );
};

export default DeleteModal;
