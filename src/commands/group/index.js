// dependencies

var fs = require("fs");
const chalk = require("chalk");
let Jimp = require("jimp");

var isWin = process.platform === "win32";

const OUTDIM = {
  width: 2000,
  height: 1500,
};

/** dscli export command */
export const groupCmd = async (opts, cmdOpts) => {
  let files;

  try {
    files = fs.readdirSync(cmdOpts.inputFolderPath);
  } catch (e) {
    console.log(
      chalk.red(
        `Could not open input folder ${cmdOpts.inputFolderPath}. Reason: ${e.message}`
      )
    );
    return;
  }

  console.log(files);

  const groups = new Map();

  // regexp that match two groups

  for (const file of files) {
    const match = file.match(/^([0-9]+)(?:_?([0-9]+))?.jpg$/);

    if (!match) {
      console.log(chalk.yellow(`Skipping file ${file}`));
      continue;
    }
    const objnb = match[1];
    if (groups.has(objnb)) groups.set(objnb, [...groups.get(objnb), file]);
    else groups.set(objnb, [file]);
  }
  console.log(chalk.green(`Found ${groups.size} image groups. Starting...`));

  console.log(groups);

  for (const [objnb, files] of groups) {
    let background = new Jimp(OUTDIM.width, OUTDIM.height, "white");
    console.log(
      chalk.green(`Processing group ${objnb} [${files.join(", ")}]...`)
    );
    if (files.length == 1) {
      const image1 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[0]}`);
      image1.scaleToFit(OUTDIM.width, OUTDIM.height);
      background.blit(image1, OUTDIM.width / 2 - image1.getWidth() / 2, 0);
    }
    if (files.length == 2) {
      const image1 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[0]}`);
      const image2 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[1]}`);
      image1.scaleToFit(OUTDIM.width, OUTDIM.height);
      image2.scaleToFit(OUTDIM.width, OUTDIM.height);

      let imgGroup = {
        height: image1.getHeight() + image2.getHeight(),
        width: image1.getWidth() + image2.getWidth(),
      };

      const xScale = OUTDIM.width / imgGroup.width;
      const yScale = OUTDIM.height / imgGroup.height;
      const masterScale = Math.max(xScale, yScale);

      image1.scale(masterScale);
      image2.scale(masterScale);

      imgGroup = {
        height: image1.getHeight() + image2.getHeight(),
        width: image1.getWidth() + image2.getWidth(),
      };
      background.blit(image1, 0, OUTDIM.height / 2 - image1.getHeight() / 2);
      background.blit(
        image2,
        image1.getWidth(),
        OUTDIM.height / 2 - image2.getHeight() / 2
      );
    }

    if (files.length == 3) {
      const image1 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[0]}`);
      const image2 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[1]}`);
      const image3 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[2]}`);

      image1.scaleToFit(OUTDIM.width, OUTDIM.height);
      image2.scaleToFit(OUTDIM.width, OUTDIM.height);
      image3.scaleToFit(OUTDIM.width, OUTDIM.height);

      let imgGroup = {
        height: image1.getHeight() + image2.getHeight() + image3.getHeight(),
        width: image1.getWidth() + image2.getWidth() + image3.getWidth(),
      };

      const xScale = OUTDIM.width / imgGroup.width;
      const yScale = OUTDIM.height / imgGroup.height;
      const masterScale = Math.max(xScale, yScale);

      image1.scale(masterScale);
      image2.scale(masterScale);
      image3.scale(masterScale);

      imgGroup = {
        height: image1.getHeight() + image2.getHeight() + image3.getHeight(),
        width: image1.getWidth() + image2.getWidth() + image3.getWidth(),
      };
      background.blit(image1, 0, OUTDIM.height / 2 - image1.getHeight() / 2);
      background.blit(
        image2,
        image1.getWidth(),
        OUTDIM.height / 2 - image2.getHeight() / 2
      );
      background.blit(
        image3,
        image1.getWidth() + image2.getWidth(),
        OUTDIM.height / 2 - image3.getHeight() / 2
      );
    }

    if (files.length >= 4) {
      const image1 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[0]}`);
      const image2 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[1]}`);
      const image3 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[2]}`);
      const image4 = await Jimp.read(`${cmdOpts.inputFolderPath}/${files[3]}`);

      image1.scaleToFit(OUTDIM.width, OUTDIM.height / 2);
      image2.scaleToFit(OUTDIM.width, OUTDIM.height / 2);
      image3.scaleToFit(OUTDIM.width, OUTDIM.height / 2);
      image4.scaleToFit(OUTDIM.width, OUTDIM.height / 2);

      let imgGroup = {
        height:
          image1.getHeight() +
          image2.getHeight() +
          image3.getHeight() +
          image4.getHeight(),
        width:
          image1.getWidth() +
          image2.getWidth() +
          image3.getWidth() +
          image4.getWidth(),
      };

      const xScale = OUTDIM.width / imgGroup.width;
      const yScale = OUTDIM.height / imgGroup.height;
      const masterScale = Math.max(xScale, yScale);

      image1.scale(masterScale);
      image2.scale(masterScale);
      image3.scale(masterScale);
      image4.scale(masterScale);

      imgGroup = {
        height:
          image1.getHeight() +
          image2.getHeight() +
          image3.getHeight() +
          image4.getHeight(),
        width:
          image1.getWidth() +
          image2.getWidth() +
          image3.getWidth() +
          image4.getWidth(),
      };
      //   FIRST COL
      background.blit(
        image1,
        OUTDIM.width / 2 - (image1.getWidth() / 2 + image2.getWidth() / 2),
        OUTDIM.height / 4 - image1.getHeight() / 2
      );
      background.blit(
        image2,
        OUTDIM.width / 2 -
          (image1.getWidth() / 2 + image2.getWidth() / 2) +
          image1.getWidth(),
        OUTDIM.height / 4 - image2.getHeight() / 2
      );
      // SECOND COL
      background.blit(
        image3,
        OUTDIM.width / 2 - (image3.getWidth() / 2 + image4.getWidth() / 2),
        OUTDIM.height / 2 + (OUTDIM.height / 2 - image3.getHeight()) / 2
      );
      background.blit(
        image4,
        OUTDIM.width / 2 -
          (image3.getWidth() / 2 + image4.getWidth() / 2) +
          image3.getWidth(),
        OUTDIM.height / 2 + (OUTDIM.height / 2 - image4.getHeight()) / 2
      );
    }

    await background.writeAsync(`${cmdOpts.outputFolderPath}/${objnb}.jpg`);
    console.log(
      chalk.green(
        `Processing done. Wrote ${cmdOpts.outputFolderPath}/${objnb}.jpg`
      )
    );
  }
};
