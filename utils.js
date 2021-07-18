const runParser = async function (parser) {
  try {
    const result = await parser();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  runParser,
};
