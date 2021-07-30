module.exports = async function runParser(parser, browser, pathName, parserName,index) {
  try {
    const result = await parser(browser, 1, pathName, index);
    return result;
  } catch (error) {
    console.error(`Parser ${parserName} failed:`, error);
  }
};
