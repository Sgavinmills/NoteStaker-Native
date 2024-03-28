import { MenuOverlay } from "../types";

export const emptyOverlay = () => {
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
