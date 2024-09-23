"use strict";

import { color as co } from "./utils.js";
import { readFileSync } from "fs";

const { stdout } = process;

const terminal = {
  verbose: 2,
  levels: {
    info: "%H100  info:%H",
    fail: "%H41  fail:%H",
    pass: "%H42  pass:%H",
  },
};

terminal.projectInfo = (() => {
  try {
    const { name, version } = JSON.parse(readFileSync("./package.json"));

    return { name, version };
  } catch (error) {
    return { name: "unknown", version: "unknown" };
  }
})();

/**
 *  display the project info and the port
 *
 * @param {number} port - The port number to display
 */
terminal.start = function start(port) {
  const projectInfo = terminal.projectInfo;

  const headLines = [
    `\n%H46  name:%H%H44  ${projectInfo.name} `,
    `%H47  version:%H%H41  ${projectInfo.version} %H\n`,
    `%H43  host:%H95  http://localhost:${port || "****"}\n`,
    port ? `%H45  port:%H94  ${port}\n` : "",
  ];

  for (const line of headLines) {
    stdout.write(co(line));
  }
}

/**
 *  display the online message
 *
 * @param {string} data
 */
terminal.pass = function pass(data) {
  stdout.write(co(`${terminal.levels.pass} ${data}\n`));
}

/**
 *  display logs messages
 *
 * @param {string} data
 */
terminal.log = function log(data) {
  const { verbose, levels } = terminal;

  let level = levels.info;

  if (Number(verbose) === 0) return;

  if (terminal.isError(data)) {
    level = levels.fail;
  }

  if (Number(verbose) === 1 && stdout.isTTY) {
    terminal.clear();

    stdout.write(co(`\r${level} ${data}`));
  } else {
    stdout.write(co(`${level} `));

    if (level === terminal.levels.info) {
      if (typeof data === "object") {
        console.log(data);
      } else {
        stdout.write(`${co(data)}\n`);
      }
    } else {
      console.backup(data);
    }
  }
}

/**
 * Get a list of common error names
 *
 * @returns {string[]}
 */
const getErrorNames = () => {
  return Object.getOwnPropertyNames(global).filter(name => {
    try {
      return typeof global[name] === 'function' && global[name].prototype instanceof Error;
    } catch (e) {
      return false;
    }
  });
};

/**
 * Check if the data is an error
 *
 * @param {any} data
 * @returns {boolean}
 */
terminal.isError = (data) => {
  if (data instanceof Error) {
    return true;
  }

  if (typeof data === "string") {
    const errorKeywords = getErrorNames().map(name => `Error: ${name}`);
    errorKeywords.push("Error:");

    return errorKeywords.some(keyword => data.includes(keyword));
  }

  return false;
};

/**
 * Setup the console.error to use the terminal.log function
 */
terminal.setup = function setup() {
  // backup the original console.error
  console.backup = console.error;
  /**
   * Custom error logging function
   *
   * @param  {...any} args
   */
  console.error = function(...args) {
    terminal.log(...args);
  };
}

terminal.clear = function clear() {
  if (stdout.isTTY) {
    stdout.clearLine();
  }
}

/**
 * Set the verbose level
 *
 * @param {number} verbose - The verbose level
 */
terminal.setVerbose = function setVerbose(verbose) {
  terminal.verbose = verbose;
}

export default terminal;
