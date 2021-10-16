// this is a small script to install latest deps
// after running this, don't forget to install vue@next@latest vue-router@next@latest pinia@next@latest

const execSync = require('child_process').execSync;

const { dependencies, devDependencies, syncIgnore } = require('./package.json');

Object.keys(dependencies)
  .filter((el) => !syncIgnore.includes(el))
  .forEach((key) => {
    console.info(`Sync ${key}`);

    try {
      execSync(`pnpm remove ${key} --filter app`, { encoding: 'utf-8' });
      execSync(`pnpm add ${key} --filter app`, { encoding: 'utf-8' });
    } catch (error) {
      console.log(error);
    }
  });

Object.keys(devDependencies).forEach((key) => {
  console.info(`Sync ${key}`);

  try {
    execSync(`pnpm remove ${key} --filter app`, { encoding: 'utf-8' });
    execSync(`pnpm add ${key} -D --filter app`, { encoding: 'utf-8' });
  } catch (error) {
    console.log(error);
  }
});

syncIgnore.forEach((el) => {
  console.info(`Sync ${el}`);

  execSync(`pnpm remove ${el} --filter app`, { encoding: 'utf-8' });
  execSync(`pnpm add ${el}@next --filter app`, { encoding: 'utf-8' });
});
