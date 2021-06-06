import { FIREBASE_CONFIG } from './contants';
import { isBrowser } from './utils';

export const firebaseApp = isBrowser
  ? (window as any).firebase.initializeApp(FIREBASE_CONFIG)
  : undefined;
export const firebaseDb = isBrowser ? firebaseApp.database() : undefined;
