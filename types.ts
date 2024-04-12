export interface Memory {
    categoryList: Ref[];
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
    isNewNote: boolean;
    createdBy: string;
    lastUpdatedBy: string;
    isSecureNote: boolean;
    locations: Location[];
}

export interface Category {
    id: string;
    name: string;
    notes: Ref[];
    subCategories: Ref[];
    dateAdded: string;
    dateUpdated: string;
    createdBy: string;
    lastUpdatedBy: string;
    isSecure: boolean;
}

export interface SubCategory {
    id: string;
    name: string;
    notes: Ref[];
    parentCategory: string;
    dateAdded: string;
    dateUpdated: string;
    createdBy: string;
    lastUpdatedBy: string;
    location: Location;
    isSecure: boolean;
}

export type Ref = {
    id: string;
    isSecure: boolean;
};

export type Location = [string, string];

export interface MenuOverlay {
    isShowing: boolean;
    menuType: "category" | "subCategory" | "note" | "homeScreen" | "";
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
    deleteType: "removeAll" | "deleteCategory" | "deleteNote" | "deleteImage" | "backupData" | "importData" | "";
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

export interface IDs {
    categoryID: string;
    subCategoryID: string;
    noteID: string;
}
