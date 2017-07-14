import firebaseConfig from '../firebase.config';

export const firebaseApp = window.firebase.initializeApp(firebaseConfig);
export const firebaseDb = firebaseApp.database();
