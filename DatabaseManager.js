import { getDatabase, ref, set, update, push, remove, onValue } from "firebase/database";
import getFirebaseApp from "./firebaseConfig.js";
import _ from "lodash";

export default class DatabaseManager {
    static db = getDatabase(getFirebaseApp());
    static reportsUpdatedByUser = 0;
    static async generateUserKey(LocalDataManager) {
        console.log(LocalDataManager.userData.userId);
        if (LocalDataManager.userData.userId === "") {
            const usersRef = ref(this.db, "users");
            const userEntry = push(usersRef);
            const userKey = userEntry.key;
            set(userEntry, { firstName: LocalDataManager.userData.firstName, lastName: LocalDataManager.userData.lastName, reports: "", });
            await LocalDataManager.updateUserData("userId", userKey);
            await LocalDataManager.saveUserData();
        }
    }

    static updateReports(LocalDataManager, itemName, itemDesc, itemColor, areaDesc, category, county) {
        this.reportsUpdatedByUser++;
        const properCounty = _.startCase(county);
        const properCategory = _.startCase(category);
        const categoryRef = ref(this.db, `reports/${properCounty}/${properCategory}`);
        const reportEntry = push(categoryRef);
        const reportKey = reportEntry.key;
        set(reportEntry, { itemName: itemName, itemDesc: itemDesc, itemColor: itemColor, areaDesc: areaDesc, category: category, county: county, });
        const reportsRef = ref(this.db, `users/${LocalDataManager.userData.userId}/reports`);
        update(reportsRef, { [this.reportsUpdatedByUser]: reportKey });
    }

    static getReports() { }
};

// when user logs in function to push the user to the database. needs to get the key and store it in the local DB manager class above. - Login.js file
// need to go in and make it so that when an item is reported it compiles the report into an object, pushes it to the DB, gets the key of the reported item, and store the key as a path under that user.
// be able to just read the data.
