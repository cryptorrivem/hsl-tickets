const sleep = require("simple-async-sleep");
const { ConnectionError, getTickets, saveTickets } = require("./hsl");

const [_1, _2, currentPath, previousPath, outputPath] = process.argv;

(async function () {
  let tickets;
  while (true) {
    try {
      tickets = await getTickets({
        currentPath,
        previousPath,
      });
      break;
    } catch (err) {
      if (err instanceof ConnectionError) {
        console.error("Error while getting tickets, retrying in 30 seconds.");
        await sleep(30000);
      } else {
        throw err;
      }
    }
  }

  saveTickets({ tickets, outputPath });
  console.info(`Tickets saved to "${outputPath}" file`);
})();
