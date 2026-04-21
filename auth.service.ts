/**
 * EcoResolve — Authentication Service
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  PhoneAuthProvider,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';
import { User, UserRole } from '../constants/types';

// ── Auth State Observer ───────────────────────────────────────────────────────

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ── Email / Password ──────────────────────────────────────────────────────────

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<FirebaseUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await sendEmailVerification(credential.user);
  await createUserDocument(credential.user, name);
  return credential.user;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ── Google Sign-In ────────────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  const result = await signInWithPopup(auth, provider);
  const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
  if (isNew) {
    await createUserDocument(result.user, result.user.displayName ?? 'User');
  }
  return result.user;
}

// ── Phone / OTP ───────────────────────────────────────────────────────────────

let confirmationResult: ConfirmationResult | null = null;

export async function sendOTP(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<void> {
  confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export async function verifyOTP(otp: string): Promise<FirebaseUser> {
  if (!confirmationResult) throw new Error('No OTP session. Please request OTP first.');
  const result = await confirmationResult.confirm(otp);
  const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
  if (isNew) {
    await createUserDocument(result.user, result.user.displayName ?? 'User');
  }
  return result.user;
}

// ── Sign Out ──────────────────────────────────────────────────────────────────

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// ── Firestore User Document ───────────────────────────────────────────────────

export async function createUserDocument(
  firebaseUser: FirebaseUser,
  name: string
): Promise<void> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const existing = await getDoc(userRef);
  if (existing.exists()) return;

  const newUser: Omit<User, 'uid'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    name,
    email: firebaseUser.email ?? '',
    phone: firebaseUser.phoneNumber ?? undefined,
    photoURL: firebaseUser.photoURL ?? undefined,
    coverURL: undefined,
    roles: [],
    activeRole: 'volunteer',
    tokens: 0,
    releasedTokens: 0,
    rank: 0,
    badges: [],
    createdAt: serverTimestamp() as any,
  };

  await setDoc(userRef, newUser);
}

export async function getUserDocument(uid: string): Promise<User | null> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as User;
}

export async function updateUserRoles(uid: string, roles: UserRole[]): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    roles,
    activeRole: roles[0] ?? 'volunteer',
  });
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<User, 'name' | 'photoURL' | 'coverURL'>>
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
  if (auth.currentUser && data.name) {
    await updateProfile(auth.currentUser, { displayName: data.name });
  }
}

// ── Profile Photo Upload ──────────────────────────────────────────────────────

export async function uploadProfilePhoto(
  uid: string,
  uri: string
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `users/${uid}/profile.jpg`);
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  const downloadURL = await getDownloadURL(storageRef);
  await updateDoc(doc(db, 'users', uid), { photoURL: downloadURL });
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { photoURL: downloadURL });
  }
  return downloadURL;
}
