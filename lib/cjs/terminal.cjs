'use strict';

var url = require('url');
var fs = require('fs');

/*!
 * Terminal
 * Copyright (c) 2024 @GuriTso
 * @license GPL-3.0
 */


/**
 * This function is used to colorize the text
 * @param {string} txt - The text to colorize
 * @returns {string | any} - The colorized text
 * @example
 * color("Hello %H1 World") // "Hello \x1b[1mWorld\x1b[0m"
 * color("%h1 start here%H nothing here") // "\x1b[1m start here\x1b[0m nothing here"
 */
function color(txt) {
  if (typeof txt !== "string") return txt;

  const arr = txt.split("%H");
  let res = arr.join("");

  for (const a of arr) {
    const [n, ...w] = a.split(" ");

    if (!n || !txt.includes(`%H${n}`) || isNaN(n)) continue;

    const mo = `\x1b[${n}m${w.join(" ")}\x1b[0m`;

    res = res.replace(a, mo);
  }
  return res;
}
/**
 * Get a list of common error names
 *
 * @returns {string[]}
 */
function getErrorNames() {
  return Object.getOwnPropertyNames(global).filter((name) => {
    try {
      return (
        typeof global[name] === "function" &&
        global[name].prototype instanceof Error
      );
    } catch (e) {
      return false;
    }
  });
}
/**
 * Format the URL based on the provided host and port.
 *
 * @param {string} host - The host to format.
 * @param {number} port - The port to format.
 * @returns {string} - The formatted URL.
 */
function formatUrl(host, port) {
  const locals = ["localhost", "127.0.0.1", "0.0.0.0"];

  try {
    if (typeof host !== "string") {
      return new Error("host must be a string");
    }

    const url$1 = new url.URL(host);

    if (port && port !== url$1.port) {
      url$1.port = port;
    }

    if (!url$1.protocol) {
      url$1.protocol = "http:";
    } else if (url$1.protocol !== "https:" && url$1.protocol !== "http:") {
      url$1.protocol = "http:";
    }

    return { url: url$1.toString(), port: url$1.port };
  } catch (error) {
    if (locals.includes(host)) {
      return formatUrl("http://localhost", port);
    } else {
      return error;
    }
  }
}

/*!
 * Terminal
 * Copyright (c) 2024 @GuriTso
 * @license GPL-3.0
 */


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
    info: color("%H100  INFO:%H"),
    fail: color("%H41  FAIL:%H"),
    pass: color("%H42  PASS:%H"),
  },
};

const { stdout } = process;

terminal.projectInfo = (() => {
  try {
    const { name, version } = JSON.parse(
      fs.readFileSync("./package.json", "utf-8")
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
    stdout.write(color(line));
  }
};

/**
 *  display successful messages
 *
 * @param {string} data
 */
terminal.pass = function pass(data) {
  const { verbose, levels } = terminal;

  if (verbose === 0) return;

  if (typeof data === "object") {
    // skipcq: JS-0002
    console.log(color(`\r%H1 ${levels.pass}%H`),data);
  } else {
    terminal.clear();
    stdout.write(color(`\r%H1 ${levels.pass}%H ${String(data)}\n`));
  }
};

/**
 *  display logs messages, error, info, etc.
 *
 * @param {any} data
 */
terminal.log = function log(data) {
  const { verbose, levels } = terminal;

  let level = levels.info;

  if (verbose === 0) return;

  if (terminal.isError(data)) {
    level = levels.fail;
  }

  if (verbose === 1 && stdout.isTTY) {
    terminal.clear();

    stdout.write(color(`\r%H1 ${level}%H ${String(data)}`));
  } else {
    if (level === terminal.levels.info) {
      if (typeof data === "object") {
        // skipcq: JS-0002
        console.log(color(`%H1 ${level}%H `), data);
      } else {
        stdout.write(color(`%H1 ${level}%H ${String(data)}\n`));
      }
    } else {
      // skipcq: JS-0002
      console.log(color(`%H1 ${level}%H `), data);
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
  if (!isNaN(Number(verbose))) {
    const verboseLevel = Number(verbose);

    if (verboseLevel < 0) {
      terminal.verbose = 0;
    } else if (verboseLevel > 2) {
      terminal.verbose = 2;
    } else {
      terminal.verbose = verboseLevel;
    }
  }

};

module.exports = terminal;
