# Introduction

This is the integration tests package, it runs against both DEV and PROD environments, in order to toggle which environment to hit modify the environment variable STAGE within the .env file.

Tests can also run agasint your local environment by changing the STAGE variable to `LOCAL`.

# How to run tests

You can run the tests locally with `pnpm run e2e` or `pnpm run e2e:ui` if you prefer the interactive UI mode.
