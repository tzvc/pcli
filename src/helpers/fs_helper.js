const fs = require('fs');

export const fileExistsWithExtOptions = (basePath, extOptions) => {
  // console.log(extOptions);
  for (let ext of extOptions) {
    const fullpath = `${basePath}${ext}`;
    // console.log(fullpath);

    if (fs.existsSync(fullpath)) return fullpath;
  }
  return null;
};
