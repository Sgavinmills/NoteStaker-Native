import { MenuOverlay } from "../types";

export const getEmptyOverlay = () => {
    const overlay: MenuOverlay = {
        isShowing: false,
        menuType: "",
        menuData: {
            noteID: "",
            categoryID: "",
            subCategoryID: "",
        },
    };

    return overlay;
};
