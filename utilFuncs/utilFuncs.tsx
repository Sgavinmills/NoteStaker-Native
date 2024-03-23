import { Category, Note, SubCategory } from "../types";

export const isEmptyCategory = (category: Category, notes: Note[]) => {
    if (category.subCategories.length !== 0) {
        return false;
    }

    return !notes.some((note) => note.categories.includes(category.id));
};

export const isEmptySubCategory = (category: SubCategory, notes: Note[]) => {
    return !notes.some((note) => note.subCategories.includes(category.id));
};
