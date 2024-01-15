import { test, expect, type Page } from '@playwright/test'
import { TestIds } from '@esusu/core/testing/ids'
import { GameSchema } from '@esusu/core/models'
import { JSONToBase64 } from '@esusu/core/utils/base64'

test.describe('Four Connect Player Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/four-connect')
  })

  const FIRST_NAME = 'Sergio'
  const SECOND_NAME = 'Natalia'

  async function fillInForm(page: Page) {
    const playerOne = page.getByTestId(TestIds.ConnectFourPlayerOne)
    const playerTwo = page.getByTestId(TestIds.ConnectFourPlayerTwo)

    const playerOneName = playerOne.getByTestId(TestIds.ConnectFourPlayerName)
    const playerTwoName = playerTwo.getByTestId(TestIds.ConnectFourPlayerName)

    await playerOneName.fill(FIRST_NAME)
    await playerTwoName.fill(SECOND_NAME)
  }

  async function enableBothAIs(page: Page) {
    const playerOne = page.getByTestId(TestIds.ConnectFourPlayerOne)
    const playerTwo = page.getByTestId(TestIds.ConnectFourPlayerTwo)

    const playerOneAI = playerOne.getByTestId(TestIds.ConnectFourPlayerIsAi)
    const playerTwoAI = playerTwo.getByTestId(TestIds.ConnectFourPlayerIsAi)

    await playerOneAI.check()
    await playerTwoAI.check()
  }

  async function submitForm(page: Page) {
    await page.getByTestId(TestIds.ConnectFourPlayerSubmit).click()
  }

  test('(Happy Path) - All info submited redirects to play page', async ({ page }) => {
    await fillInForm(page)
    await submitForm(page)

    await expect(page).toHaveTitle('Four Connect | Playing')

    const labelPlayerOne = page.getByTestId(TestIds.ConnectFourPlayerOneNameDisplay)
    const labelPlayerTwo = page.getByTestId(TestIds.ConnectFourPlayerTwoNameDisplay)

    await expect(await labelPlayerOne.textContent()).toEqual(FIRST_NAME)
    await expect(await labelPlayerTwo.textContent()).toEqual(SECOND_NAME)
  })

  test('When submiting form without names and both AIs enabled, should show errors', async ({ page }) => {
    await submitForm(page)

    const nameErrors = page.getByTestId(TestIds.ConnectFourPlayerNameError)

    await expect(nameErrors).toHaveCount(2)

    await fillInForm(page)
    await enableBothAIs(page)

    const aiError = page.getByTestId(TestIds.ConnectFourPlayerAIError)
    await submitForm(page)

    expect(await aiError.textContent()).toEqual("How boring! Don't let two AIs play!")
  })
})

test.describe('Play Four Connect', () => {
  const FIRST_NAME = 'Sergio'
  const SECOND_NAME = 'Natalia'

  const gameSchema: GameSchema = {
    firstPlayer: {
      name: FIRST_NAME,
      isAI: false,
      avatarId: 'avatar-one.svg'
    },
    secondPlayer: {
      name: SECOND_NAME,
      isAI: false,
      avatarId: 'avatar-two.svg'
    }
  }

  async function play(page: Page, columnIndex: number) {
    const column = page.getByTestId(TestIds.ConnectFourColumns(columnIndex))
    await column.hover()
    await column.click()
  }

  async function playCompleteGame(page: Page) {
    for (let i = 0; i < 3; i++) {
      await play(page, 0)
      await play(page, 1)
    }

    // Final move
    await play(page, 0)
  }

  async function resetGame(page: Page) {
    await page.getByTestId(TestIds.ConnectFourReset).click()
  }

  test('(Happy Path) - When playing four connect winner is shown correctly', async ({ page }) => {
    await page.goto(`four-connect/${JSONToBase64(gameSchema)}`)

    const labelPlayerOne = page.getByTestId(TestIds.ConnectFourPlayerOneNameDisplay)
    const labelPlayerTwo = page.getByTestId(TestIds.ConnectFourPlayerTwoNameDisplay)

    await expect(await labelPlayerOne.textContent()).toEqual(FIRST_NAME)
    await expect(await labelPlayerTwo.textContent()).toEqual(SECOND_NAME)

    await playCompleteGame(page)

    await expect(await page.getByTestId(TestIds.ConnectFourPlayerOneWinner).textContent()).toEqual('Winner 🎉')
  })

  test('Game can be reset', async ({ page }) => {
    await page.goto(`four-connect/${JSONToBase64(gameSchema)}`)

    const labelPlayerOne = page.getByTestId(TestIds.ConnectFourPlayerOneNameDisplay)
    const labelPlayerTwo = page.getByTestId(TestIds.ConnectFourPlayerTwoNameDisplay)

    await expect(await labelPlayerOne.textContent()).toEqual(FIRST_NAME)
    await expect(await labelPlayerTwo.textContent()).toEqual(SECOND_NAME)

    await playCompleteGame(page)

    await resetGame(page)

    await expect(await page.getByTestId(TestIds.ConnectFourPlayerOneWinner)).toBeHidden()
  })

  test('Should show error when gameSchema is invalid', async ({ page }) => {
    // both players can't be an AI
    gameSchema.firstPlayer.isAI = true
    gameSchema.secondPlayer.isAI = true

    await page.goto(`four-connect/${JSONToBase64(gameSchema)}`)

    await expect(await page.getByTestId(TestIds.ConnectFourParseSchemaError).textContent()).toEqual(
      "Validation error, please go back to game setup: How boring! Don't let two AIs play!"
    )
  })
})
