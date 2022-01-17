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
- [outputPath] where to store the tickets that were purchased for this draw. It's a json file with an array of `{ name, hash, holder }` with HSL ticket's name (including number), hash (from the input), and who's the holder of that ticket at this moment.

Example:

```
node cli hashes/2022-01-17.json hashes/2022-01-15.json output.json
```

## Troubleshooting

The process holds a cache.json file to allow resuming when we hit solscan api rate limit. Just wait 30 secs before running the same process again, and it'll pick up where it left.
