/* =========================================
   REVIEW SYSTEM — FIREBASE VERSION
   Saves reviews to Firestore (global storage)
========================================= */

// Import Firestore from firebaseConfig.js
import { db } from "../../firebase/firebaseConfig.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("review-text");
  const charHint = document.getElementById("charHint");
  const submitBtn = document.querySelector(".submit-btn");

  let maxChars = 1200;
  let rating = 1; // if you add your star rating later

  /* ---------------------------------
     LIVE CHARACTER COUNT
  --------------------------------- */
  textarea.addEventListener("input", () => {
    const remaining = maxChars - textarea.value.length;
    charHint.textContent = `${remaining} left`;

    if (remaining <= 20) charHint.style.color = "#ff6b6b";
    else if (remaining <= 100) charHint.style.color = "#ffb347";
    else charHint.style.color = "#000";
  });

  /* ---------------------------------
     SUBMIT REVIEW (Firebase)
  --------------------------------- */
  submitBtn.addEventListener("click", async () => {
    const reviewText = textarea.value.trim();

    if (reviewText.length === 0) {
      alert("Please write something before submitting.");
      return;
    }

    // UI lock
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      // Save to Firestore
      await addDoc(collection(db, "reviews"), {
        text: reviewText,
        rating: rating,
        visibility: "public",
        createdAt: serverTimestamp(),
        meta: {
          moderated: true,
          secure: true,
          includesPhotos: false,
        },
      });

      // Reset UI
      textarea.value = "";
      charHint.textContent = `${maxChars} max`;

      alert("Thanks for your review!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Could not submit your review. Please try again.");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit review";
  });
});
