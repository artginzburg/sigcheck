module.exports = async function runParser(parser, browser, pathName) {
  try {
    const result = await parser(browser, 1, pathName);
    return result;
  } catch (error) {
    console.error(error);
  }
};
