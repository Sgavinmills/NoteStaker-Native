import { MenuOverlay, Category, SubCategory, Note, LongPressedConfig } from "../types";

export const getEmptyOverlay = () => {
    const overlay: MenuOverlay = {
        isShowing: false,
        menuType: "",
        menuData: {
            noteID: "",
            categoryID: "",
            subCategoryID: "",
            noteIndex: null,
            categoryIndex: null,
            subCategoryIndex: null,
            isSearchTile: false,
            subMenu: "",
        },
    };

    return overlay;
};

export const getEmptyLongPressedConfig = () => {
    const isMoving: LongPressedConfig = {
        isActive: false,
        noteID: "",
        subCategoryID: "",
        categoryID: "",
        multiSelectedNotes: [],
    };

    return isMoving;
};

export const moveDownList = (newList: any[], index: number) => {
    const temp = newList[index + 1];
    newList[index + 1] = newList[index];
    newList[index] = temp;
    return [...newList];
};

export const moveUpList = (newList: any[], index: number) => {
    const temp = newList[index - 1];
    newList[index - 1] = newList[index];
    newList[index] = temp;
    return [...newList];
};

export const moveToStart = (newList: any[], index: number) => {
    const temp = newList[index];
    newList.splice(index, 1);
    newList.unshift(temp);
    return [...newList];
};

export const moveToEnd = (newList: any[], index: number) => {
    const temp = newList[index];
    newList.splice(index, 1);
    newList.push(temp);
    return [...newList];
};

export const printCategories = (categories: { [id: string]: Category }) => {
    console.log("--PRINTING CATEGORIES--");
    for (const categoryId in categories) {
        if (categories.hasOwnProperty(categoryId)) {
            const category = categories[categoryId];
            console.log(`Category ID: ${category.id}`);
            console.log(`Name: ${category.name}`);
            console.log(`Notes:`);
            category.notes.forEach((note) => console.log(`- Note ID: ${note.id}`));
            console.log(`Subcategories: ${category.subCategories.join(", ")}`);
            console.log(`DOnt forget me: `);

            console.log("\n");
        }
    }
};

export const printSubCategories = (subCategories: { [id: string]: SubCategory }) => {
    console.log("--PRINTING SUB CATS--");
    for (const categoryId in subCategories) {
        if (subCategories.hasOwnProperty(categoryId)) {
            const category = subCategories[categoryId];
            console.log(`SubCategory ID: ${category.id}`);
            console.log(`Name: ${category.name}`);
            console.log(`Location: ${category.location}`);
            console.log(`Notes:`);
            category.notes.forEach((note) => console.log(`- Note ID: ${note.id}`)); // Adjust as per NoteRef structure
            console.log("\n");
        }
    }
};

export const printNotes = (notes: { [id: string]: Note }) => {
    console.log("--PRINTING Notes--");
    for (const noteID in notes) {
        if (notes.hasOwnProperty(noteID)) {
            const note = notes[noteID];
            console.log(`Note ID: ${note.id}`);
            console.log(`Note: ${note.note}`);
            console.log(`Locations: [${note.locations}]`);
            console.log("\n");
        }
    }
};
