import { MenuOverlay, Memory, Category, SubCategory } from "../types";

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
        },
    };

    return overlay;
};

// checkNoteExistenceInOtherCategories checks all categories and subcategories to see if a note exists, returns true if found.
// takes optional categoryID and array of subcategoryID and skips those categories.
export const noteExistsInOtherCategories = (
    categories: { [id: string]: Category },
    subCategories: { [id: string]: SubCategory },
    noteId: string,
    categoryId: string | null,
    subCategoryIds: string[]
): boolean => {
    for (const categoryKey in categories) {
        if (categoryId && categoryKey === categoryId) continue; // Skip the provided category
        const category = categories[categoryKey];
        if (category.notes.includes(noteId)) {
            return true;
        }
    }

    for (const subCategoryKey in subCategories) {
        if (subCategoryIds.length > 0 && subCategoryIds.includes(subCategoryKey)) continue; // Skip the provided category
        const subCategory = subCategories[subCategoryKey];
        if (subCategory.notes.includes(noteId)) {
            return true;
        }
    }

    return false;
};
