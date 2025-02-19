# Redpanda Schema Repository Reproduction

This repository provides a minimal example to reproduce issues related to using Redpanda with a schema repository.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Recommended: latest LTS version)
- [npm](https://www.npmjs.com/) (Comes with Node.js)

## Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/Havret/redpanda-schema-repository-repro.git
cd redpanda-schema-repository-repro
npm install
```

## Building the Project

Before running the application, generate TypeScript types from protobuf definitions and compile the project:

```sh
npm run build
```

This will execute:
- `generate:types`: Uses `buf` to generate TypeScript types from protobuf definitions.
- `compile:ts`: Compiles TypeScript files using `tsc`.

## Running in Development Mode

To run the application in development mode, use:

```sh
npm run dev
```

This command executes `src/index.ts` using `ts-node`.

## Using Kafka Schema Registry

To switch to Kafka's schema registry, update the `clientConfig` in `src/index.ts`:

```ts
const clientConfig: ClientConfig = {
    baseURLs: ["http://localhost:8081"], // Kafka schema registry
    createAxiosDefaults: createAxiosDefaults,
    cacheCapacity: 512,
    cacheLatestTtlSecs: 60,
};
```