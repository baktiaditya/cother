import qs from 'qs';

export const PROJECT_NAME = 'Cother';
export const GITHUB_BTN_URL = `https://ghbtns.com/github-btn.html?${qs.stringify({
  user: 'baktiaditya',
  repo: 'cother',
  type: 'fork',
  count: 'false',
})}`;
export const GA_TRACKING_ID = 'UA-26982489-22';

// Firebase configuration settings
export const FIREBASE_PROJECT_ID = 'cother-8e4f9';
export const FIREBASE_CONFIG = {
  projectID: FIREBASE_PROJECT_ID,
  apiKey: 'AIzaSyAqp0MlBYG9Y5lpq8td96CCRtjYvHDzoMc',
  messagingSenderId: '825385445546',
  authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
  storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
};
