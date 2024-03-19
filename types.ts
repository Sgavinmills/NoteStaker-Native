export interface Category {
    name: string;
    subCategories: string[];
  }
  
  export interface Note {
    note: string;
    categories: Category[];
    additionalInfo: string;
    dateAdded: string;
    dateUpdated: string;
    id: string;
    priority: string;
    completed: boolean;
  }

export interface Memory {
    notes: Note[];
    categories: Category[];
  }
  