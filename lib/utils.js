/*!
 * Terminal
 * Copyright (c) 2024 @GuriTso
 * @license GPL-3.0
 */

import { URL } from "url";

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
};

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
};

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

    const url = new URL(host);

    if (port && port !== url.port) {
      url.port = port;
    }

    if (!url.protocol) {
      url.protocol = "http:";
    } else if (url.protocol !== "https:" && url.protocol !== "http:") {
      url.protocol = "http:";
    }

    return { url: url.toString(), port: url.port };
  } catch (error) {
    if (locals.includes(host)) {
      return formatUrl("http://localhost", port);
    } else {
      return error;
    }
  }
};

export { color, getErrorNames, formatUrl };
