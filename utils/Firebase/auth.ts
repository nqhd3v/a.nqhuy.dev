import { FirebaseError } from "firebase/app";
import { ActionCodeInfo, applyActionCode, checkActionCode, confirmPasswordReset, FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, NextOrObserver, onAuthStateChanged as onFsAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, User, verifyPasswordResetCode } from "firebase/auth"
import { firebaseAuth } from ".";

// TYPE & INTERFACE

export type FIREBASE_EMAIL_ACTION_MODE = "resetPassword" | "recoveryEmail" | "verifyEmail";

// MAPPING
export const FIREBASE_EMAIL_ACTION_MODES: FIREBASE_EMAIL_ACTION_MODE[] = ["recoveryEmail", "resetPassword", "verifyEmail"];
export const FIREBASE_EMAIL_ACTION_MODE_MAPPING: { [key: string]: FIREBASE_EMAIL_ACTION_MODE } = {
  RESET_PASSWORD: 'resetPassword',
  RECOVERY_EMAIL: 'recoveryEmail',
  VERIFY_EMAIL: 'verifyEmail',
}
export const ERROR_MSG_MAPPING: { [key: string]: string } = {
  'auth/operation-not-allowed': 'This action is not supported!',
  'auth/popup-closed-by-user': 'This action can\'t handle because user rejected it!',
  'auth/invalid-email': 'Invalid email',
  'auth/user-not-found': 'Wrong email',
  'auth/wrong-password': 'Wrong password',
  'auth/internal-error': 'Somethings went wrong!',
}

// FUNCS

export const loginWithEmail = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(firebaseAuth, email, password);
  } catch (err: any) {
    if (err instanceof FirebaseError) {
      if (typeof err.code === "string") {
        throw new Error(ERROR_MSG_MAPPING[err.code]);
      }
      throw new Error(err.message);
    }
    throw err;
  }
}
export const forgotPassword = async (email: string) => {
  try {
    return await sendPasswordResetEmail(firebaseAuth, email);
  } catch (err: any) {
    if (err instanceof FirebaseError) {
      throw new Error(ERROR_MSG_MAPPING[err.code]);
    }
    throw err;
  }
}
export const loginWithFacebook = async () => {
  try {
    const facebookAuthProvider = new FacebookAuthProvider()
    await signInWithPopup(firebaseAuth, facebookAuthProvider)
  } catch (err: any) {
    if (err instanceof FirebaseError) {
      throw new Error(ERROR_MSG_MAPPING[err.code]);
    }
    throw err;
  }
}
export const loginWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider()
    await signInWithPopup(firebaseAuth, googleProvider)
  } catch (err: any) {
    if (err instanceof FirebaseError) {
      throw new Error(ERROR_MSG_MAPPING[err.code]);
    }
    throw err;
  }
}
export const loginWithGithub = async () => {
  try {
    const githubAuthProvider = new GithubAuthProvider()
    await signInWithPopup(firebaseAuth, githubAuthProvider)
  } catch (err: any) {
    if (err instanceof FirebaseError) {
      throw new Error(ERROR_MSG_MAPPING[err.code]);
    }
    throw err;
  }
}
export const logout = async () => {
  try {
    return await signOut(firebaseAuth);
  } catch (err) {
    throw err;
  }
}

export const onAuthStateChanged = (cb: NextOrObserver<User>) => onFsAuthStateChanged(firebaseAuth, cb)

export const applyCode = async (code: string): Promise<void> => applyActionCode(firebaseAuth, code);
export const checkCode = async (code: string): Promise<ActionCodeInfo> => checkActionCode(firebaseAuth, code);
export const verifyPwdResetCode = async (code: string): Promise<string> => verifyPasswordResetCode(firebaseAuth, code);
export const confirmPwdReset = async (code: string, password: string): Promise<void> => confirmPasswordReset(firebaseAuth, code, password);
export const sendMail2VerifyEmail = async () => {
  if (firebaseAuth.currentUser && !firebaseAuth.currentUser.emailVerified) {
    return await sendEmailVerification(firebaseAuth.currentUser);
  }
  return false;
} 