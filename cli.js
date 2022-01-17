const { getTickets } = require("./hsl");

const [_1, _2, currentPath, previousPath, outputPath] = process.argv;

(async function () {
  await getTickets({
    currentPath,
    previousPath,
    outputPath,
  });
})();
