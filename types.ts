export interface Memory {
    categoryList: string[];
    notes: { [id: string]: Note };
    categories: { [id: string]: Category };
    subCategories: { [id: string]: SubCategory };
}

export interface Note {
    id: string;
    note: string;
    additionalInfo: string;
    dateAdded: string;
    dateUpdated: string;
    priority: string;
    completed: boolean;
    imageURI: string;
}

export interface Category {
    id: string;
    name: string;
    notes: string[];
    subCategories: string[];
    dateAdded: string;
    dateUpdated: string;
}

export interface SubCategory {
    id: string;
    name: string;
    notes: string[];
    parentCategory: string;
    dateAdded: string;
    dateUpdated: string;
}
