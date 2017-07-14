// Firebase configuration settings
const firebaseConfig = {
  projectID: 'tvlk-ui-dev-rtte',
  apiKey: 'AIzaSyBOAMZhoBnmhV6wMWCK9mX2nIvUh7rH38A',
  messagingSenderId: '625113732027'
};
firebaseConfig.authDomain = `${firebaseConfig.projectID}.firebaseapp.com`;
firebaseConfig.databaseURL = `https://${firebaseConfig.projectID}.firebaseio.com`;
firebaseConfig.storageBucket = `${firebaseConfig.projectID}.appspot.com`;

module.exports = firebaseConfig;
