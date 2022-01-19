const fs = require("fs");
const path = require("path");

const encoding = "utf-8";

const cachePath = path.join(__dirname, "cache.json");
function getCachedTickets() {
  let result = [];
  if (fs.existsSync(cachePath)) {
    result = JSON.parse(fs.readFileSync(cachePath, { encoding }));
  }
  return result;
}

function saveCachedTickets(tickets) {
  fs.writeFileSync(cachePath, JSON.stringify(tickets, null, "\t"), {
    encoding,
  });
}

function getHashes(file) {
  return JSON.parse(fs.readFileSync(file, { encoding }));
}

function toJSON(columns, data) {
  return JSON.stringify(data, null, "\t");
}

function toCSV(columns, data) {
  const lines = [columns, ...data.map((d) => columns.map((c) => d[c]))];
  return lines.map((l) => l.join(",")).join("\n");
}

function toTable(columns, data) {
  const widths = columns.map((c) =>
    data.reduce((res, d) => {
      const length = d[c].toString().length;
      return length > res ? length : res;
    }, c.length)
  );
  const colSeparator = " | ";
  const lines = [
    columns.map((c, ix) => c.padEnd(widths[ix])).join(colSeparator),
    columns
      .map((_, ix) => new Array(widths[ix]).fill("-").join(""))
      .join("-+-"),
    ...data.map((d) =>
      columns
        .map((c, ix) => d[c].toString().padEnd(widths[ix]))
        .join(colSeparator)
    ),
  ];

  return lines.join("\n");
}

const mapFn = {
  csv: toCSV,
  json: toJSON,
  table: toTable,
};

function saveOutput(outputPath, data) {
  const ext = Object.keys(mapFn).find((ext) => outputPath.endsWith(`.${ext}`));
  if (!ext) {
    throw new Error("File extension not supported");
  }
  const fn = mapFn[ext];
  const columns = Object.keys(data[0]);
  const content = fn(columns, data);

  fs.writeFileSync(outputPath, content, { encoding });
}

module.exports = {
  getCachedTickets,
  saveCachedTickets,
  getHashes,
  saveOutput,
};
