module.exports = async function runParser(parser) {
  try {
    const result = await parser();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
