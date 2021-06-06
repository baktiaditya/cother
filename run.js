/* eslint-disable no-console */
const firebase = require('firebase-tools');

const tasks = new Map(); // The collection of automation tasks ('build', 'publish', etc.)
function run(task) {
  const start = new Date();
  console.log(`${'\x1b[32m'}Starting "${task}"...${'\x1b[0m'}`);
  return Promise.resolve()
    .then(() => tasks.get(task)())
    .then(
      () => {
        console.log(
          `${'\x1b[32m'}Finished "${task}" after ${
            new Date().getTime() - start.getTime()
          }ms${'\x1b[0m'}`,
        );
      },
      err => console.error(err.stack),
    );
}

tasks.set('deploy', async () => {
  return Promise.resolve()
    .then(() => firebase.login({ nonInteractive: false }))
    .then(() => firebase.deploy())
    .then(() => console.log('Deployed to Firebase'));
});

// Execute the specified task. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') && process.argv[2]);
