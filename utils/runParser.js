module.exports = async function runParser(parser, browser, pathName) {
  try {
    console.log(pathName + '2');
    const result = await parser(browser,1, pathName);
    return result;
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
