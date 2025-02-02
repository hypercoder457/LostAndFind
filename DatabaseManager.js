import { getDatabase, ref, set, push, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import { app, storage } from "./firebaseConfig.js";
import _, { reduce } from "lodash";

export default class DatabaseManager {
  static db = getDatabase(app);

  static async generateUserKey(LocalDataManager) {
    console.log(LocalDataManager.userData.userId);
    if (LocalDataManager.userData.userId === "") {
      const usersRef = ref(this.db, "users");
      const userEntry = push(usersRef);
      const userKey = userEntry.key;
      set(userEntry, { firstName: LocalDataManager.userData.firstName, lastName: LocalDataManager.userData.lastName, reports: "" });
      await LocalDataManager.updateUserData("userId", userKey);
      await LocalDataManager.saveUserData();
    }
  }

  static async getDataSection(sectionPath) {
    try {
      const sectionRef = ref(this.db, sectionPath);
      const snapShot = await get(sectionRef);
      return(snapShot.val());
    } catch (err) {
      return(null);
    }
  }

  static async makeReport(reportTicket) {
    const madeURLs = await this.makeImages(reportTicket.images);

    if (!madeURLs) {
      return(false);
    }

    const reportData = {
      ...reportTicket,
      images: madeURLs,
    };

    const mainPath = `reports/${reportTicket.county}/${reportTicket.category}`;
    const reportRef = ref(this.db, mainPath);
    const reportEntry = push(reportRef);
    const reportKey = reportEntry.key;
    set(reportEntry, reportData);

    const userPath = `users/${reportTicket.userId}/reports`;
    const userReportsRef = ref(this.db, userPath);
    const userReportsEntry = push(userReportsRef);
    set(userReportsEntry, `${mainPath}/${reportKey}`);

    console.log("Report uploaded successfully!");
    return(true);
  }

  static async makeImages(images) {
    if (!images || images.length <= 0) {
      return(false);
    }
  
    const uploadPromises = images.map(async (uri) => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists) {
          const { uri: fileUri } = fileInfo;

          const response = await fetch(fileUri);
          const blob = await response.blob();

          const storage = getStorage();
          const storagePath = `report_images/${new Date().toISOString()}_${Math.random().toString(36).substr(2, 9)}.jpg`; // Unique file name
          const imageRef = storageRef(storage, storagePath);
          await uploadBytes(imageRef, blob);
  
          const downloadURL = await getDownloadURL(imageRef);
  
          return(downloadURL);
        } else {
          console.warn("File does not exist at URI");
        }
      } catch (err) {
        console.log("Error uploading image!: ", err);
        return(null);
      }
    });

    const imageURLs = await Promise.all(uploadPromises);

    return imageURLs.filter((url) => url != null);
  }
}
