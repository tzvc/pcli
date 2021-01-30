import { program } from 'commander';
// commands
import { renameCmd } from './commands/rename';

export const cli = async args => {
  program
    .command('rename <input-csv-path> <input-folder-path>')
    .option(
      '-l, --limit <number>',
      'Maximum number of records to export.',
      (v, t) => parseInt(v),
      10,
    )

    .description('Rename photos according to the CSV')
    .action(
      async (inputCsvPath, inputFolderPath, cmdOpt) =>
        await renameCmd(program.opts(), {
          ...cmdOpt.opts(),
          inputCsvPath,
          inputFolderPath,
        }),
    );

  await program.parseAsync(args);
};
