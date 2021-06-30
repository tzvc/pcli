// dependencies
const parse = require('csv-parse/lib/sync');
var fs = require('fs');
const chalk = require('chalk');

var isWin = process.platform === 'win32';

// helpers
import { fileExistsWithExtOptions } from '../../helpers/fs_helper';
/** dscli export command */
export const renameCmd = async (opts, cmdOpts) => {
  let csv;
  try {
    csv = fs.readFileSync(cmdOpts.inputCsvPath, 'utf8');
  } catch (e) {
    console.log(
      chalk.red(`Could not open input CSV file ${cmdOpts.inputCsvPath}.`),
    );
    return;
  }
  let records;
  try {
    records = parse(csv, {
      delimiter: ';',
      columns: ['lotnb', 'seller_folder_nb', 'seller_file_nb'],
      skip_empty_lines: true,
    });
    console.log(records);
  } catch (e) {
    console.log(
      chalk.red(
        `Could parse CSV file ${cmdOpts.inputCsvPath}. Verify format and try again.`,
      ),
    );
    return;
  }
  console.log(chalk.green(`Found ${records.length} records. Starting...`));

  let copyList = [];
  records.forEach(record => {
    const pathBase = `${cmdOpts.inputFolderPath}${isWin ? '\\' : `/`}${
      record.seller_folder_nb
    }-${record.seller_file_nb}`;
    const path = fileExistsWithExtOptions(pathBase, ['.jpg']);
    if (path)
      copyList.push({
        src: path,
        dest: `${cmdOpts.outputFolderPath}${isWin ? '\\' : `/`}${
          record.lotnb
        }.jpg`,
      });

    for (let i = 1; i < 10; i++) {
      const path = fileExistsWithExtOptions(pathBase, [
        `_${i}.jpg`,
        ` (${i}).jpg`,
      ]);
      if (path)
        copyList.push({
          src: path,
          dest: `${cmdOpts.outputFolderPath}${isWin ? '\\' : `/`}${
            record.lotnb
          }_${i}.jpg`,
        });
    }
  });
  console.log(chalk.green(`Found ${copyList.length} matches. Copying...`));

  copyList.forEach(copyEntry => {
    fs.copyFileSync(copyEntry.src, copyEntry.dest);
    console.log(chalk.green(`Wrote ${copyEntry.src} -> ${copyEntry.dest}`));
  });
};
