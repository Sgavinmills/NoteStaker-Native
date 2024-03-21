import { Dispatch } from "react";
import { addCategory } from "../redux/slice";
import { Category } from "../types";

export function addNewCategory(dispatch: Dispatch<any>, categoryName: string) {
    const newCategory: Category = {
        name: categoryName,
        subCategories: [],
    };

    dispatch(addCategory(newCategory));
}
