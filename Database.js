import { getDatabase, ref, set, update, push, remove, onValue } from "firebase/database";
import getFirebaseApp from "./firebaseConfig.js";

const db = getDatabase(getFirebaseApp());
const counties = [
    "alamance",
    "alexander",
    "alleghany",
    "anson",
    "ashe",
    "avery",
    "beaufort",
    "beaufort",
    "bertie",
    "bladen",
    "brunswick",
    "buncombe",
    "burke",
    "cabarrus",
    "caldwell",
    "camden",
    "carteret",
    "caswell",
    "catawba",
    "chatham",
    "cherokee",
    "chowan",
    "clay",
    "cleveland",
    "columbus",
    "craven",
    "cumberland",
    "currituck",
    "dare",
    "davidson",
    "davie",
    "duplin",
    "durham",
    "edgecombe",
    "forsyth",
    "franklin",
    "gaston",
    "gates",
    "graham",
    "granville",
    "greene",
    "guilford",
    "halifax",
    "harnett",
    "haywood",
    "henderson",
    "hertford",
    "hoke",
    "hyde",
    "iredell",
    "jackson",
    "johnston",
    "jones",
    "lee",
    "lenoir",
    "lincoln",
    "macon",
    "madison",
    "martin",
    "mcdowell",
    "mecklenburg",
    "mitchell",
    "montgomery",
    "moore",
    "nash",
    "new hanover",
    "northampton",
    "onslow",
    "orange",
    "pamlico",
    "pasquotank",
    "pender",
    "perquimans",
    "person",
    "pitt",
    "polk",
    "randolph",
    "richmond",
    "robeson",
    "rockingham",
    "rowan",
    "sampson",
    "scotland",
    "stanly",
    "stokes",
    "surry",
    "swain",
    "transylvania",
    "tyrrell",
    "union",
    "vance",
    "wake",
    "warren",
    "washington",
    "watauga",
    "wayne",
    "wilkes",
    "wilson",
    "yadkin",
    "yancey",
  ];
  const categories = [
    "clothing", "bag", "electronic", "key", "wallet", "jewelry", "bottle", "book", "important documentation", "other"
  ];
const totalCounties = counties.length;
const totalCategories = categories.length;
const mainPath = "reports/";
for (let i = 0; i < totalCounties; i++) {
    const currentCounty = counties[i];
    for (let j = 0; j < totalCategories; j++) {
        const currentCategory = categories[j];
        const usePath = mainPath + currentCounty + "/" + currentCategory; 
        const newRef = ref(db, usePath);
        set(newRef, "");
    }
}
console.log("Finished Creating Database Structure!");
/*
const ref1 = ref(db, "Alamance/Clothing");
const clothingRef = push(ref1);
update(clothingRef, { item: "Shirt", color: "Blue", size: "Large" });
remove(ref(db, "Alamance/Clothing/3"));
onValue(ref(db, "Alamance/Clothing"), (snapshot) => {
    console.log(snapshot.val());
});
*/