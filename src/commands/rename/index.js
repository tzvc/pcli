// dependencies
const parse = require('csv-parse/lib/sync');
var fs = require('fs');
const chalk = require('chalk');

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
      columns: [
        'lotnb',
        'order',
        'seller_file_nb',
        'seller_folder_nb',
        'seller_name',
        'lot_desc',
        'low_est',
        'high_est',
      ],
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

  let outputPaths = [];
  records.forEach(record => {
    const pathBase = `${cmdOpts.inputFolderPath}/${record.seller_folder_nb}-${record.seller_file_nb}`;

    if (fileExistsWithExtOptions(pathBase, ['.jpg']))
      outputPaths.push(`${record.lotnb}.jpg`);

    for (let i = 1; i < 10; i++) {
      if (fileExistsWithExtOptions(pathBase, [`_${i}.jpg`, ` (${i}).jpg`]))
        outputPaths.push(`${record.lotnb}_${i}.jpg`);
    }
  });
  console.log(chalk.green(`Found ${outputPaths.length} matches. Copying...`));

  outputPaths.forEach(outputPath => {
    const fullOutputPath = `${cmdOpts.outputFolderPath}/${outputPath}`;
    fs.writeFileSync(`${cmdOpts.outputFolderPath}/${outputPath}`);
    console.log(chalk.green(`Wrote ${fullOutputPath}`));
  });
};
