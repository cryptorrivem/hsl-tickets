const fs = require("fs");
const path = require("path");
const { fetch } = require("./utils/fetch");
const { throttle } = require("./utils/throttle");

const throttledSolscanFetch = throttle(4);
function solscanFetch(path, query) {
  return throttledSolscanFetch(fetch, `https://public-api.solscan.io/${path}`, {
    query,
  });
}

const cachePath = path.join(__dirname, "cache.json");
function getCachedTickets(file) {
  let result = [];
  if (fs.existsSync(file)) {
    result = JSON.parse(fs.readFileSync(cachePath, { encoding: "utf-8" }));
  }
  return result;
}

function saveTickets(file, tickets) {
  fs.writeFileSync(file, JSON.stringify(tickets, null, "\t"), {
    encoding: "utf-8",
  });
}

function getTicketsToProcess({ currentPath, previousPath }) {
  const current = JSON.parse(
    fs.readFileSync(currentPath, { encoding: "utf-8" })
  );
  const previous = JSON.parse(
    fs.readFileSync(previousPath, { encoding: "utf-8" })
  );

  return current.filter((c) => !previous.includes(c));
}

async function getTickets({ currentPath, previousPath, outputPath }) {
  let cached = getCachedTickets(cachePath);

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

  const batchSize = 10;
  while (toProcess.length > 0) {
    const batch = toProcess.slice(0, batchSize);
    toProcess = toProcess.slice(batchSize);

    const accounts = await Promise.all(
      batch.map((t) => solscanFetch(`account/${t}`))
    );
    const holders = await Promise.all(
      batch.map((t) => solscanFetch("token/holders", { tokenAddress: t }))
    );

    const tickets = accounts.reduce((res, acc, ix) => {
      if (acc.tokenInfo && holders[ix].data[0]) {
        const {
          tokenInfo: { name },
        } = acc;
        const [{ owner: holder }] = holders[ix];
        const hash = batch[ix];
        const number = parseInt(name.replace("HSL Ticket #", ""));
        return [
          ...res,
          {
            name,
            hash,
            holder,
            number,
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

    saveTickets(cachePath, cached);
  }

  console.info("**************");
  console.info("FINISHED");
  console.info("**************");
  console.info("valid tickets:", cached.length);

  saveTickets(outputPath, cached);
}

module.exports = {
  getTickets,
};
