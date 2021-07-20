module.exports = async function runParser(parser, browser) {
  try {
    const result = await parser(browser);
    return result;
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
