export interface Memory {
    categoryList: string[];
    categories: { [id: string]: Category };
    // notes: { [id: string]: Note };
    // subCategories: { [id: string]: SubCategory };
}

// export type Memory = Category[];

export interface Category {
    id: string;
    name: string;
    noteList: string[];
    notes: { [id: string]: Note };
    subCategoryList: string[];
    subCategories: { [id: string]: SubCategory };
    dateAdded: string;
    dateUpdated: string;
    createdBy: string;
    lastUpdatedBy: string;
}

export interface SubCategory {
    id: string;
    name: string;
    noteList: string[];
    notes: { [id: string]: Note };
    dateAdded: string;
    dateUpdated: string;
    createdBy: string;
    lastUpdatedBy: string;
    parents: Parents;
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
    isNewNote: boolean;
    createdBy: string;
    lastUpdatedBy: string;
    isSecureNote: boolean;
    parents: Parents;
    otherLocations: Parents[];
}

export type Parents = [string, string];

export interface MenuOverlay {
    isShowing: boolean;
    menuType: "category" | "subCategory" | "note" | ""; // might be able to restrict this to specific menu types later?
    menuData: MenuData;
}

export interface MenuData {
    noteID: string;
    categoryID: string;
    subCategoryID: string;
    categoryIndex: number | null;
    subCategoryIndex: number | null;
    noteIndex: number | null;
}

export interface DeleteInfo {
    deleteType: "removeAll" | "deleteCategory" | "deleteNote" | "deleteImage" | "";
    deleteMessage: string;
}

export interface SubHeight {
    subHeight: number;
    noteHeights: number[];
}

export interface CatHeight {
    catHeight: number;
    subHeights: SubHeight[];
    noteHeights: number[];
}

export interface HeightUpdateInfo {
    newHeight: number;
    categoryIndex: number;
    subCategoryIndex: number;
    noteIndex: number;
}

export interface NewNoteData {
    subCategoryID: string;
    categoryID: string;
    imageURI: string;
    noteInsertIndex: number;
}
