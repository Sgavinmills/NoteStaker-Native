import { Memory } from "./types";

export const memory: Memory = {
    notes: [
        {
            id: "1682188137607ngw9drt",
            note: "This is a fart",
            categories: ["randomcatid1", "randomcatid2"],
            subCategories: ["randomsubcatid21", "randomsubcatid1", "randomsubcatid2"],
            additionalInfo: "",
            dateAdded: "",
            dateUpdated: "",
            priority: "normal",
            completed: true,
        },
        {
            id: "16821881dfsdg37607ngw9drtxxxxxxxx",
            note: "This is a second note",
            categories: ["randomcatid1", "randomcatid2"],
            subCategories: ["randomsubcatid21", "randomsubcatid1", "randomsubcatid2"],
            additionalInfo: "",
            dateAdded: "",
            dateUpdated: "",
            priority: "normal",
            completed: false,
        },
    ],
    categories: [
        {
            id: "randomcatid1",
            name: "test cat 1",
            subCategories: ["randomsubcatid1", "randomsubcatid2"],
            dateAdded: "",
            dateUpdated: "",
        },
        {
            id: "randomcatid2",
            name: "test cat 2",
            subCategories: ["randomsubcatid21", "randomsubcatid22"],
            dateAdded: "",
            dateUpdated: "",
        },
    ],
    subCategories: [
        {
            id: "randomsubcatid1",
            name: "sub cat 1",
            dateAdded: "",
            dateUpdated: "",
            parentCategory: "randomcatid1",
        },
        {
            id: "randomsubcatid2",
            name: "sub cat 2",
            dateAdded: "",
            dateUpdated: "",
            parentCategory: "randomcatid1",
        },
        {
            id: "randomsubcatid21",
            name: "sub cat 21",
            dateAdded: "",
            dateUpdated: "",
            parentCategory: "randomcatid2",
        },
        {
            id: "randomsubcatid22",
            name: "sub cat 22",
            dateAdded: "",
            dateUpdated: "",
            parentCategory: "randomcatid2",
        },
    ],
};
