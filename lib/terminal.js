/*!
 * Terminal
 * Copyright (c) 2024 @GuriTso
 * @license GPL-3.0
 */

"use strict";

const getErrorNames = require("./utils").getErrorNames;
const formatUrl = require("./utils").formatUrl;
const co = require("./utils").color;
const { readFileSync } = require("fs");

/**
 * @typedef {Object} Terminal
 * @property {number} verbose
 * @property {Object} levels
 * @property {string} levels.info
 * @property {string} levels.fail
 * @property {string} levels.pass
 * @property {function(string, number): void} start
 * @property {function(string): void} pass
 * @property {function(string): void} log
 * @property {function(): void} setup
 * @property {function(): void} clear
 * @property {function(number): void} setVerbose
 * @property {function(any): boolean} isError
 * @property {Object} projectInfo
 */

/** @type {Terminal} */
const terminal = {
  verbose: 2,
  levels: {
    info: co("%H100  INFO:%H"),
    fail: co("%H41  FAIL:%H"),
    pass: co("%H42  PASS:%H"),
  },
};

const { stdout } = process;

terminal.projectInfo = (() => {
  try {
    const { name, version } = JSON.parse(
      readFileSync("./package.json", "utf-8")
    );

    return { name, version };
  } catch (error) {
    return { name: "unknown", version: "unknown" };
  }
})();

/**
 *  display the project info and host, port
 *
 * @param {string} host - The host to display
 * @param {number} port - The port number to display
 */
terminal.start = function start(host, port) {
  const projectInfo = terminal.projectInfo;
  const hostInfo = formatUrl(host, port);

  const headLines = [
    `\n%H46  name:%H%H44  ${projectInfo.name} `,
    `%H105  version:%H%H41  ${projectInfo.version} %H\n`,
    hostInfo?.url ? `%H43  host:%H95  ${hostInfo.url}\n` : "",
    hostInfo?.port ? `%H45  port:%H94  ${hostInfo.port}\n` : "",
  ];

  for (const line of headLines) {
    stdout.write(co(line));
  }
};

/**
 *  display successful messages
 *
 * @param {string} data
 */
terminal.pass = function pass(data) {
  terminal.clear();
  stdout.write(co(`\r%H1 ${terminal.levels.pass}%H ${data}\n`));
};

/**
 *  display logs messages, error, info, etc.
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

    stdout.write(co(`\r%H1 ${level}%H ${data}`));
  } else {
    stdout.write(co(`%H1 ${level}%H `));

    if (level === terminal.levels.info) {
      if (typeof data === "object") {
        // skipcq: JS-0002
        console.log(data);
      } else {
        stdout.write(`${co(data)}\n`);
      }
    } else {
      // skipcq: JS-0002
      console.log(data);
    }
  }
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
    const errorKeywords = getErrorNames().map((name) => name);
    errorKeywords.push("Error:");

    return errorKeywords.some((keyword) => data.includes(keyword));
  }

  return false;
};

/**
 * Setup the console.error to use the terminal.log function
 *
 * @returns {boolean} - true if the setup was successful, false otherwise
 */
terminal.setup = () => {
  if (typeof console === "object" && console.error) {
    
    if (typeof console.backup === "function") {
      return false
    }
    
    // backup the original console.error
    console.backup = console.error;
  } else {
    throw new Error("console.error is not found");
  }

  // replace the console.error with the terminal.log
  console.error = terminal.log;

  return true
};

/**
 * Clear the terminal
 */
terminal.clear = () => {
  if (stdout.isTTY) {
    stdout.clearLine();
    return true
  }

  return false
};

/**
 * Set the verbose level
 *
 * @param {number} verbose - The verbose level
 */
terminal.setVerbose = (verbose) => {
  terminal.verbose = verbose;
};

module.exports = terminal;
