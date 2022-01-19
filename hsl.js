const {
  getCachedTickets,
  saveCachedTickets,
  getHashes,
  saveOutput,
} = require("./fs");
const { fetch } = require("./utils/fetch");
const { throttle } = require("./utils/throttle");

const throttledSolscanFetch = throttle(4);
function solscanFetch(path, query) {
  return throttledSolscanFetch(fetch, `https://public-api.solscan.io/${path}`, {
    query,
  });
}

function getTicketsToProcess({ currentPath, previousPath }) {
  const current = getHashes(currentPath);
  const previous = getHashes(previousPath);

  return current.filter((c) => !previous.includes(c));
}

async function getTickets({ currentPath, previousPath, outputPath }) {
  let cached = getCachedTickets();

  let toProcess = getTicketsToProcess({
    currentPath,
    previousPath,
  }).filter((t) => !cached.some((c) => c.hash === t));
  console.info(
    "tickets cached:",
    cached.length,
    "of",
    toProcess.length + cached.length
  );
  console.info("tickets to process:", toProcess.length);

  const batchSize = 4;
  while (toProcess.length > 0) {
    const batch = toProcess.slice(0, batchSize);
    toProcess = toProcess.slice(batchSize);

    const accounts = await Promise.all(
      batch.map((t) => solscanFetch(`account/${t}`))
    );

    const tickets = accounts.reduce((res, acc, ix) => {
      if (acc.tokenInfo) {
        const {
          tokenInfo: { name },
        } = acc;
        const hash = batch[ix];
        const number = parseInt(name.replace("HSL Ticket #", ""));
        return [
          ...res,
          {
            number,
            name,
            hash,
          },
        ];
      } else {
        console.info("invalid ticket:", batch[ix]);
      }
      return res;
    }, []);
    cached = [...cached, ...tickets];
    console.info(
      "processed:",
      cached.length,
      "of",
      cached.length + toProcess.length
    );

    saveCachedTickets(cached);
  }

  console.info("**************");
  console.info("FINISHED");
  console.info("**************");
  console.info("valid tickets:", cached.length);

  const list = cached.map(({ number, name, hash }, ix) => ({
    pos: ix + 1,
    number,
    ticket: name,
    hash,
  }));

  saveOutput(outputPath, list);
}

module.exports = {
  getTickets,
};
