## Setup

Requires node.

```
npm install
```

Create a folder hashes to save each day's draw hashlist files there.

## Usage

Download latest hash list and keep the previous one.
Before starting a new date pull, delete the `cache.json` file, so the resulting list does not include previous date's cached tickets.

```
node cli [currentHashPath] [previousHashPath] [outputPath]
```

Replace:

- [currentHashPath] path to current hash list file (expects a json file with an array)
- [previousHashPath] path to previous draw hash list file (expects a json file with an array)
- [outputPath] where to store the tickets that were purchased for this draw. It's a csv file of `pos, number, ticket, hash` with position (for the draw), parsed number, HSL ticket's name and hash (from the input).
  - Supported [outputPath] file extension are `.csv`, `.json` and `.table` (for easy reading with monospace)

Examples:

```
node cli hashes/2022-01-17.json hashes/2022-01-15.json output.table
node cli hashes/2022-01-17.json hashes/2022-01-15.json output.csv
node cli hashes/2022-01-17.json hashes/2022-01-15.json output.json
```

## Troubleshooting

The process holds a cache.json file to allow resuming when we hit solscan api rate limit. Just wait 30 secs before running the same process again, and it'll pick up where it left.
