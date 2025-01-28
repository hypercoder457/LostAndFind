import { getDatabase, ref, set, update, push, remove, onValue } from "firebase/database";
import getFirebaseApp from "./firebaseConfig.js";

const db = getDatabase(getFirebaseApp());
const counties = [
  "Alamance",
  "Alexander",
  "Alleghany",
  "Anson",
  "Ashe",
  "Avery",
  "Beaufort",
  "Beaufort",
  "Bertie",
  "Bladen",
  "Brunswick",
  "Buncombe",
  "Burke",
  "Cabarrus",
  "Caldwell",
  "Camden",
  "Carteret",
  "Caswell",
  "Catawba",
  "Chatham",
  "Cherokee",
  "Chowan",
  "Clay",
  "Cleveland",
  "Columbus",
  "Craven",
  "Cumberland",
  "Currituck",
  "Dare",
  "Davidson",
  "Davie",
  "Duplin",
  "Durham",
  "Edgecombe",
  "Forsyth",
  "Franklin",
  "Gaston",
  "Gates",
  "Graham",
  "Granville",
  "Greene",
  "Guilford",
  "Halifax",
  "Harnett",
  "Haywood",
  "Henderson",
  "Hertford",
  "Hoke",
  "Hyde",
  "Iredell",
  "Jackson",
  "Johnston",
  "Jones",
  "Lee",
  "Lenoir",
  "Lincoln",
  "Macon",
  "Madison",
  "Martin",
  "McDowell",
  "Mecklenburg",
  "Mitchell",
  "Montgomery",
  "Moore",
  "Nash",
  "New Hanover",
  "Northampton",
  "Onslow",
  "Orange",
  "Pamlico",
  "Pasquotank",
  "Pender",
  "Perquimans",
  "Person",
  "Pitt",
  "Polk",
  "Randolph",
  "Richmond",
  "Robeson",
  "Rockingham",
  "Rowan",
  "Sampson",
  "Scotland",
  "Stanly",
  "Stokes",
  "Surry",
  "Swain",
  "Transylvania",
  "Tyrrell",
  "Union",
  "Vance",
  "Wake",
  "Warren",
  "Washington",
  "Watauga",
  "Wayne",
  "Wilkes",
  "Wilson",
  "Yadkin",
  "Yancey",
];
  const categories = ["Clothing", "Bag", "Electronic", "Key", "Wallet", "Jewelry", "Bottle", "Book", "Important Documentation", "Other"];
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