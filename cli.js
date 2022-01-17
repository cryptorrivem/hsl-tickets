const { getTickets } = require("./hsl");

const [_1, _2, account, firstTx, lastTx] = process.argv;

(async function () {
  const tickets = await getTickets({
    account,
    firstTx,
    lastTx,
  });

  console.info(JSON.stringify(tickets, null, "  "));
})();
