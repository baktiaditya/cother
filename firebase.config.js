// Firebase configuration settings
const firebaseConfig = {
  projectID: 'cother-64238',
  apiKey: 'AIzaSyA6QnLIiaiu-G4spBraTfvm-vgxh7iY8PA',
  messagingSenderId: '802181438883'
};
firebaseConfig.authDomain = `${firebaseConfig.projectID}.firebaseapp.com`;
firebaseConfig.databaseURL = `https://${firebaseConfig.projectID}.firebaseio.com`;
firebaseConfig.storageBucket = `${firebaseConfig.projectID}.appspot.com`;

module.exports = firebaseConfig;
