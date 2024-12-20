export interface Memory {
    categoryList: Ref[];
    notes: { [id: string]: Note };
    categories: { [id: string]: Category };
    subCategories: { [id: string]: SubCategory };
}

// todo change interfaces to types?
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
    isSelected: boolean;
    notificationID: string;
    notificationTime: string;
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
    isSelected: boolean;
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
    isSelected: boolean;
}

export type DontForgetMeRef = {
    date: string;
    noteID: string;
};

export type Ref = {
    id: string;
    isSecure: boolean;
};

export type SubtleMessage = {
    message: string;
    timeOut: number;
};

export type Location = [string, string];

// TODO - check if we actually use menuType ever.
export interface MenuOverlay {
    isShowing: boolean;
    menuType: "category" | "subCategory" | "note" | "homeScreen" | "";
    menuData: MenuData;
}

export interface MenuData {
    noteID: string;
    categoryID: string;
    subCategoryID: string;
    categoryIndex: number | null; // check if still need these, if it was just for scrollto then maybe not
    subCategoryIndex: number | null;
    noteIndex: number | null;
    isSearchTile: boolean;
    subMenu: "nameofmenutoopendirectly - unused atm" | "";
}

export interface DeleteInfo {
    deleteType?: "removeAll" | "deleteCategory" | "deleteNote" | "deleteImage" | "backupData" | "importData" | "";
    deleteMessage: string;
    additionalMessage: string;
    deleteFunction?: () => void;
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

export type dontForgetMeRef = {
    location: Location;
    date: string;
};

export type reminderConfig = {
    reminderTime: Date;
    note: Note;
    reminderText: string;
};

export interface DontForgetMeConfig extends IDs {
    date: string;
}

export interface LongPressedConfig extends IDs {
    isActive: boolean;
    multiSelectedNotes: string[];
}

export const reminderID = "reminderCatID";
