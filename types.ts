export interface Memory {
    notes: Note[];
    categories: Category[];
    subCategories: SubCategory[];
}

export interface Category {
    id: string;
    name: string;
    subCategories: string[];
    dateAdded: string;
    dateUpdated: string;
}

export interface SubCategory {
    id: string;
    name: string;
    parentCategory: string;
    dateAdded: string;
    dateUpdated: string;
}

export interface Note {
    id: string;
    note: string;
    categories: string[];
    subCategories: string[];
    additionalInfo: string;
    dateAdded: string;
    dateUpdated: string;
    priority: string;
    completed: boolean;
    imageURI: string;
}
