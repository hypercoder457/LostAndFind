import { getDatabase, ref, set, update, push, remove, onValue } from "firebase/database";
import getFirebaseApp from "./firebaseConfig.js";

export default class DatabaseManager {
    static db = getDatabase(getFirebaseApp());

    static async generateUserKey(LocalDataManager) {
        console.log(LocalDataManager.userData.userId);
        if (LocalDataManager.userData.userId === "") {
            const usersRef = ref(this.db, "users");
            const userEntry = push(usersRef);
            const userKey = userEntry.key;
            set(userEntry, {fName: LocalDataManager.userData.firstName, lName: LocalDataManager.userData.lastName, reports: "",});
            LocalDataManager.updateUserData("userId", userKey);
            LocalDataManager.saveUserData();
        }
    }
};