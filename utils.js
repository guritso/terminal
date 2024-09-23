/**
 * This function is used to colorize the text
 * @param {string} txt - The text to colorize
 * @returns {string | any} - The colorized text
 * @example
 * color("Hello %H1 World") // "Hello \x1b[1mWorld\x1b[0m"
 * color("%h1 start here%H nothing here") // "\x1b[1m start here\x1b[0m nothing here"
 */
export const color = (txt) => {
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

