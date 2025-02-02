import { getDatabase, ref, set, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import { app, storage } from "./firebaseConfig.js";
import _ from "lodash";

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

  static async makeReport(reportTicket) {
    const madeURLs = await this.makeImages(reportTicket.images);

    if (!madeURLs) {
      return false; // if there was an issue processing images
    }

    // Here you can save the report with the image URLs to the database
    const reportData = {
      ...reportTicket,
      images: madeURLs, // attach the image URLs to the report
    };

    const mainPath = `reports/${reportTicket.county}/${reportTicket.category}`;
    const reportRef = ref(this.db, mainPath);
    const reportEntry = push(reportRef);
    const reportKey = reportEntry.key;
    set(reportEntry, reportData);

    // Optionally, also link the report to the user's report list
    const userPath = `users/${reportTicket.userId}/reports`;
    const userReportsRef = ref(this.db, userPath);
    const userReportsEntry = push(userReportsRef);
    set(userReportsEntry, `${mainPath}/${reportKey}`);

    console.log("Report uploaded successfully!");
    return true;
  }

  static async makeImages(images) {
    if (!images || images.length === 0) {
      console.log("No images provided.");
      return [];
    }
  
    const uploadPromises = images.map(async (uri) => {
      try {
        // Step 1: Get the file info (size, type) and convert the URI into a Blob
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists) {
          const { uri: fileUri } = fileInfo;
  
          // Step 2: Convert the image file to a Blob
          const response = await fetch(fileUri);
          const blob = await response.blob();
  
          // Step 3: Upload the Blob to Firebase Storage
          const storage = getStorage();
          const storagePath = `report_images/${new Date().toISOString()}_${Math.random().toString(36).substr(2, 9)}.jpg`; // Unique file name
          const imageRef = storageRef(storage, storagePath);
          await uploadBytes(imageRef, blob);
  
          // Step 4: Get the download URL from Firebase Storage
          const downloadURL = await getDownloadURL(imageRef);
  
          return downloadURL; // Return the image URL
        } else {
          throw new Error("File does not exist at URI");
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
        return null;
      }
    });
  
    // Wait for all image uploads to complete and return the URLs
    const imageURLs = await Promise.all(uploadPromises);
  
    // Filter out any null values (failed uploads)
    return imageURLs.filter((url) => url !== null);
  }
}
