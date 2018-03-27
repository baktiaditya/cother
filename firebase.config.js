// Firebase configuration settings
const firebaseConfig = {
  projectID: 'cother-8e4f9',
  apiKey: 'AIzaSyAqp0MlBYG9Y5lpq8td96CCRtjYvHDzoMc',
  messagingSenderId: '825385445546',
};
firebaseConfig.authDomain = `${firebaseConfig.projectID}.firebaseapp.com`;
firebaseConfig.databaseURL = `https://${firebaseConfig.projectID}.firebaseio.com`;
firebaseConfig.storageBucket = `${firebaseConfig.projectID}.appspot.com`;

module.exports = firebaseConfig;
