import { getDatabase, ref, set, update, push, remove, onValue } from "firebase/database";
import getFirebaseApp from "./firebaseConfig.js";

const db = getDatabase(getFirebaseApp());
const ref1 = ref(db, "Alamance/Clothing");
const clothingRef = push(ref1);
update(clothingRef, { item: "Shirt", color: "Blue", size: "Large" });
remove(ref(db, "Alamance/Clothing/3"));
onValue(ref(db, "Alamance/Clothing"), (snapshot) => {
    console.log(snapshot.val());
});