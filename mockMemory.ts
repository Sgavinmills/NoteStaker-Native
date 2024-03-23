import { Memory } from "./types";

export const memory: Memory = {
    notes: [
        {
            id: "1682188137607ngw9drt",
            note: "This is a fart. A really long fart that will have to go across several lines, hopefully. ",
            categories: ["randomcatid1", "randomcatid2", "randefewgryhrtjhomcatid3"],
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
        {
            id: "1682188rgerghre1dfsdg37607ngw9drtxxxxxxxx",
            note: "This is a thirdnote",
            categories: ["randomcatid1", "randomcatid2", "randomcatid3"],
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
        {
            id: "randomcatid3",
            name: "test cat 3 - no subs",
            subCategories: [],
            dateAdded: "",
            dateUpdated: "",
        },
        {
            id: "randomcatidgsgagergre3",
            name: "test cat 3 - no sugregefegfbs",
            subCategories: [],
            dateAdded: "",
            dateUpdated: "",
        },
        {
            id: "randogefewfmcatid3",
            name: "test wefgewfgwecat 3 - no subs",
            subCategories: [],
            dateAdded: "",
            dateUpdated: "",
        },
        {
            id: "randomcwefwdatid3",
            name: "testedfweftjrt cat 3 - no subs",
            subCategories: [],
            dateAdded: "",
            dateUpdated: "",
        },
        {
            id: "randtwertgwfomcatid3",
            name: "test cat 3 - no fewfwegergsubs",
            subCategories: [],
            dateAdded: "",
            dateUpdated: "",
        },
        {
            id: "randomcfsegsaxcsafgerhratid3",
            name: "test cadrsfg j fedfwef wefewdf kk kk kk kk kk kk",
            subCategories: [],
            dateAdded: "",
            dateUpdated: "",
        },
        {
            id: "randefewgryhrtjhomcatid3",
            name: "test cat 3 - no gsdfgsdfgsdsubs",
            subCategories: [],
            dateAdded: "",
            dateUpdated: "",
        },
        {
            id: "randomcatidgggggggggg3",
            name: "test cat 3 - no subeeeeeees",
            subCategories: ["randomsubcatidyello"],
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
            id: "randomsubcatidyello",
            name: "sub cat 1",
            dateAdded: "",
            dateUpdated: "",
            parentCategory: "randomcatidgggggggggg3",
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
