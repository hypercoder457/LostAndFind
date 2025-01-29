import { getDatabase, ref, set, update, push, remove, onValue } from "firebase/database";
import getFirebaseApp from "./firebaseConfig.js";
import _ from "lodash";

export default class DatabaseManager {
    static db = getDatabase(getFirebaseApp());
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

    static makeReport(reportTicket) {
        const mainPath = `reports/${reportTicket.county}/${reportTicket.category}`;
        const reportRef = ref(this.db, mainPath);
        const reportEntry = push(reportRef);
        const reportKey = reportEntry.key;
        set(reportEntry, reportTicket);

        console.log(reportTicket);

        const userPath = `users/${reportTicket.userId}/reports`;
        const userReportsRef = ref(this.db, userPath);
        const userReportsEntry = push(userReportsRef );
        set(userReportsEntry, mainPath+`/${reportKey}`);
    }
};

// when user logs in function to push the user to the database. needs to get the key and store it in the local DB manager class above. - Login.js file
// need to go in and make it so that when an item is reported it compiles the report into an object, pushes it to the DB, gets the key of the reported item, and store the key as a path under that user.
// be able to just read the data.
