const { fetch } = require("./utils/fetch");
const { throttle } = require("./utils/throttle");

const throttledSolscanFetch = throttle(4);
function solscanFetch(path, query) {
  return throttledSolscanFetch(fetch, `https://public-api.solscan.io/${path}`, {
    query,
  });
}

async function getTransactions({ account, lastTx, firstTx }) {
  let beforeHash = lastTx;
  let result = [];
  while (beforeHash !== firstTx) {
    const transactions = await solscanFetch("account/transactions", {
      account,
      beforeHash,
      limit: 100,
    });
    let validTransactions = transactions.filter((t) => t.status === "Success");
    const firstTxIx = validTransactions.findIndex((t) => t.txHash === firstTx);
    if (transactions.length === 0 || firstTxIx >= 0) {
      validTransactions = validTransactions.slice(0, firstTxIx);
      beforeHash = firstTx;
    } else {
      beforeHash = transactions[transactions.length - 1].txHash;
    }
    result = [...result, ...validTransactions];
  }

  return result;
}

async function getTickets({ account, firstTx, lastTx }) {
  const transactions = await getTransactions({
    account,
    firstTx,
    lastTx,
  });

  const tokenAddress = transactions.map((t) => t.signer[1]);

  const accounts = await Promise.all(
    tokenAddress.map((t) => solscanFetch(`account/${t}`))
  );
  const holders = await Promise.all(
    tokenAddress.map((t) => solscanFetch("token/holders", { tokenAddress: t }))
  );

  const tickets = accounts.map(({ tokenInfo: { name } }, ix) => ({
    name,
    holder: holders[ix].data[0].owner,
  }));

  return tickets;
}

module.exports = {
  getTickets,
};
