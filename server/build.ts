/**
 * Remove old files, copy front-end ones.
 */

import fs from "fs-extra";
import childProcess from "child_process";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from "path";

/**
 * Remove file
 */
function remove(loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.remove(loc, (err) => {
      return (err ? rej(err) : res());
    });
  });
}

/**
 * Copy file.
 */

/**
 * Do command line command.
 */
function exec(cmd: string, loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (stdout) {
        console.info(stdout);
      }
      if (stderr) {
        console.warn(stderr);
      }
      return (err ? rej(err) : res());
    });
  });
}

/**
 * Start
 */
try {
  // Remove current build
  const __filename = fileURLToPath(import.meta.url);
  const currentFolder = dirname(__filename);
  await remove(path.join(currentFolder, "./.express/"));
  // Copy back-end files
  await fs.copy(path.join(currentFolder, "../ui/.env"), path.join(currentFolder, "./.express/.env"));
  await exec("tsc", path.join(currentFolder, "./"));
} catch (err) {
  console.error(err);
}