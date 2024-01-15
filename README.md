## Introduction

Hello this is the challenge project for esusu recruiting!

My goal with this project was to try and build something that is as production ready as possible taking into account the time constraints, the project is structured as a monorepo, this is overkill for this assignment but wanted to reuse as much as possible from previous projects that I have to save time.

### Infrastructure

Infrastructure as code is used by leveraging SST, you can find more information about it [here](https://sst.dev/chapters/what-is-sst.html).

All the infrastructure needed for this project is actually contained within `/stacks/Default.ts` which deploys the next js site to AWS.

### Frontend

The fronted lives within `/packages/web` and it is a next.js app that uses the new [app router](https://nextjs.org/docs/app).

In terms of UI components I decided to go with [shadcn ui](https://ui.shadcn.com/) which uses [radix ui](https://www.radix-ui.com/) under the hood. Shadcn ui behaves a bit differently from other UI Libraries, instead of having its own npm package, it encourages to _copy and paste_ components. If you navigate to the `/components/ui` folder you will notice there are some components that were copy pasted from shadcn ui, again, this is because they actually encourage you to do this.

### Core

The code withing `/packages/core` is meant to hold the `business logic` of this challenge/project.

### Tests

Integration tests were setup using playwright, more info can be found in its own README.md

## Getting Started & Development

> A pre-requisite to have the backend working locally is to setup your own [IAM Credentials](https://docs.sst.dev/advanced/iam-credentials). (You will need to have an AWS Account setup for this)

First, run the development command on the root of the project:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Second, you need to start up the web application, to do that navigate to `/packages/web` and run:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This must be done on a separate terminal, after doing this you can open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environments

I have setup two environments (Dev and Prod) in order to test this application both are available here:

Dev - https://esusu-dev.sbaidon.dev/four-connect

Prod - https://esusu.sbaidon.dev/four-connect

Everything is deployed using a pipeline created in [seed.run](https://seed.run/)

## Screenshots

I would encourage you to just go to the different environments to test the application, but here are some screenshots of the project!

![Initial Setup](/screenshots/game-setup.png?raw=true 'Initial Setup')

![Game Board](/screenshots/game-board.png?raw=true 'Game Board')

## Still Missing

This project is still far from being production ready, some of the things that are missing are:

- Unit Tests
- Translations
- Metrics & Observability
- Canaries
- Feature Flags
- Load Tests
