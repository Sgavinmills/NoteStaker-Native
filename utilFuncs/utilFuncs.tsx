import { MenuOverlay, Category, SubCategory, Note } from "../types";

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
        },
    };

    return overlay;
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

export const printCategories = (categories: { [id: string]: Category }) => {
    console.log("--PRINTING CATEGORIES--");
    for (const categoryId in categories) {
        if (categories.hasOwnProperty(categoryId)) {
            const category = categories[categoryId];
            console.log(`Category ID: ${category.id}`);
            console.log(`Name: ${category.name}`);
            console.log(`Notes:`);
            category.notes.forEach((note) => console.log(`- Note ID: ${note.id}`)); // Adjust as per NoteRef structure
            console.log(`Subcategories: ${category.subCategories.join(", ")}`);
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
    for (const categoryId in notes) {
        if (notes.hasOwnProperty(categoryId)) {
            const category = notes[categoryId];
            console.log(`Note ID: ${category.id}`);
            console.log(`Note: ${category.note}`);
            console.log(`Locations: [${category.locations}]`);
            console.log("\n");
        }
    }
};
