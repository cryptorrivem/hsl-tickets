## Setup

Requires node.

```
npm install
```

## Usage

```
node cli [address] [firstTx] [lastTx] > [output-file.json]
```

Replace:

- [address] with account that performs the HSL tickets sale
- [firstTx] latest HSL draw ticket TX used (will scan for newer TX)
- [lastTx] _optional_, to set a finish date and be able to run the process later
- [output-file.json] where to store the tickets that were purchased for this draw. It's a list of `{ name, holder }` with HSL ticket's name (including number) and who's the holder of that ticket at this moment.
