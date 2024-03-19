import { Note } from '../types';

// defo extract this, will be reused plenty i expect. 
export const hasCategory = (note: Note, mainCategoryName: string, subCategoryName: string): boolean => {
  const parentCategory = note.categories.find(category => category.name === mainCategoryName);

  if (parentCategory) {
    return parentCategory.subCategories.includes(subCategoryName);
  }

  return false;

};
