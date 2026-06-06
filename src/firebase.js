import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, where, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAz1HHrSQvqsUH9CPgKDnkCY4D73brxo5U",
  authDomain: "flowly-app-weld.firebaseapp.com",
  projectId: "flowly-app-weld",
  storageBucket: "flowly-app-weld.firebasestorage.app",
  messagingSenderId: "554722402521",
  appId: "1:554722402521:web:a91e74b42b43c4e0e85ec8",
  measurementId: "G-QJ5S310WEX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ===== FIRESTORE HELPERS =====

export const usersRef = collection(db, "users");

export async function createUserInDB(userData) {
  const userDoc = doc(db, "users", userData.id);
  await setDoc(userDoc, {
    ...userData,
    lastSeen: serverTimestamp(),
    online: true,
  }, { merge: true });
}

export async function updateUserInDB(userId, data) {
  const userDoc = doc(db, "users", userId);
  await setDoc(userDoc, { ...data, lastSeen: serverTimestamp() }, { merge: true });
}

export async function getUserFromDB(userId) {
  const userDoc = doc(db, "users", userId);
  const snap = await getDoc(userDoc);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAllUsersFromDB() {
  const snap = await getDocs(usersRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function onUsersChange(callback) {
  return onSnapshot(usersRef, (snapshot) => {
    const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(users);
  });
}

export async function setUserOnline(userId, isOnline) {
  const userDoc = doc(db, "users", userId);
  await setDoc(userDoc, { online: isOnline, lastSeen: serverTimestamp() }, { merge: true });
}

export async function updateUserLocation(userId, lat, lng) {
  const userDoc = doc(db, "users", userId);
  await setDoc(userDoc, { 
    location: { lat, lng, updatedAt: new Date().toISOString() },
    lastSeen: serverTimestamp()
  }, { merge: true });
}

export async function findUserByReferralCode(code) {
  const q = query(usersRef, where("referralCode", "==", code));
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

// Auth helpers
export async function firebaseSignUp(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function firebaseSignIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function firebaseSignOut() {
  await signOut(auth);
}

export { onAuthStateChanged };

// ===== DEVICE SESSIONS =====
// Stored in: users/{userId}/sessions/{sessionId}

export function getSessionsRef(userId) {
  return collection(db, "users", userId, "sessions");
}

export async function addDeviceSession(userId, sessionData) {
  const sessionDoc = doc(db, "users", userId, "sessions", sessionData.id);
  await setDoc(sessionDoc, {
    ...sessionData,
    lastActive: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateDeviceSession(userId, sessionId) {
  const sessionDoc = doc(db, "users", userId, "sessions", sessionId);
  await setDoc(sessionDoc, { lastActive: serverTimestamp() }, { merge: true });
}

export async function removeDeviceSession(userId, sessionId) {
  const sessionDoc = doc(db, "users", userId, "sessions", sessionId);
  await deleteDoc(sessionDoc);
}

export async function removeAllDeviceSessions(userId, exceptSessionId) {
  const ref = getSessionsRef(userId);
  const snap = await getDocs(ref);
  const promises = [];
  snap.docs.forEach(d => {
    if (d.id !== exceptSessionId) {
      promises.push(deleteDoc(doc(db, "users", userId, "sessions", d.id)));
    }
  });
  await Promise.all(promises);
}

export function onSessionsChange(userId, callback) {
  const ref = getSessionsRef(userId);
  return onSnapshot(ref, (snapshot) => {
    const sessions = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(sessions);
  });
}
