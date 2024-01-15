import { randomIntFromInterval } from './utils/random'

type GameState =
  | {
      state: 'WINNER'
      winner: number
    }
  | {
      state: 'DRAW'
    }
  | {
      state: 'ONGOING'
    }
  | {
      state: 'NOT_STARTED'
    }

export interface Move {
  column: number
  row: number
  player: number
}

export class FourConnect {
  private _board: number[][]
  private _history: Move[]
  private players: number[]

  private static MOVES_TO_WIN = 4
  private static TOKENS_TO_CHECK = FourConnect.MOVES_TO_WIN - 1

  static mark = -1

  currentPlayer: number

  private constructor(players: number, rows = 6, columns = 7) {
    this._board = FourConnect.createBoard(rows, columns)
    this.players = FourConnect.createPlayers(players)
    this.currentPlayer = 0
    this._history = []
  }

  static start(players: number) {
    const game = new FourConnect(players)
    return game
  }

  play(column: number) {
    this.setMove(column, this.currentPlayer)
    this.nextPlayer()
  }

  get board(): readonly number[][] {
    return this._board
  }

  get history(): readonly Move[] {
    return this._history
  }

  undo() {
    if (this.lastMove) {
      this.board[this.lastMove.row][this.lastMove.column] = FourConnect.mark
      this._history.pop()
      this.previousPlayer()
    }
  }

  reset() {
    this._board = FourConnect.createBoard()
    this.players = FourConnect.createPlayers(this.players.length)
    this.currentPlayer = 0
    this._history = []
  }

  isEmpty(row: number, column: number) {
    return this.board[row][column] === FourConnect.mark
  }

  randomMove() {
    if (!this.isSpaceLeft) return

    let column, row
    do {
      column = randomIntFromInterval(0, this.board[this.board.length - 1].length - 1)
      row = this.getLastRowForMove(column)
    } while (row && !this.isEmpty(row, column))
    this.play(column)
  }

  private isInBoard(row: number, column: number) {
    return row >= 0 && column >= 0 && row < this.board.length && column <= this.board[this.board.length - 1].length
  }

  private get lastMove(): Move | null {
    return this.history[this.history.length - 1]
  }

  get gameState(): GameState {
    if (this.lastMove) {
      return this.check(this.lastMove)
    }

    return {
      state: 'NOT_STARTED'
    }
  }

  private previousPlayer() {
    if (this.currentPlayer - 1 < 0) {
      this.currentPlayer = this.players.length - 1
    }
    this.currentPlayer = this.currentPlayer - 1
  }

  private nextPlayer() {
    const nextPlayerIndex = (this.currentPlayer + 1) % this.players.length
    this.currentPlayer = this.players[nextPlayerIndex]
  }

  private setMove(column: number, player: number) {
    const row = this.getLastRowForMove(column)
    if (row !== null) {
      this.board[row][column] = player
      this._history.push({
        column,
        row,
        player
      })
    }
  }

  getLastRowForMove(column: number): number | null {
    // Go through the rows from bottom to top on the column the player selected, set piece on first one found;
    for (let row = this.board.length - 1; row >= 0; row--) {
      if (this.board[row][column] === FourConnect.mark) {
        return row
      }
    }
    return null
  }

  private check(move: Move): GameState {
    if (!this.lastMove) {
      return {
        state: 'NOT_STARTED'
      }
    }

    // Check if player has won
    const hasWon = this.hasWon(move)

    if (hasWon) {
      return {
        state: 'WINNER',
        winner: move.player
      }
    }

    // Check if there are spaces left (DRAW)
    if (!this.isSpaceLeft) {
      return {
        state: 'DRAW'
      }
    }

    // ONGOING
    return {
      state: 'ONGOING'
    }
  }

  get isSpaceLeft(): boolean {
    return this.board.some(row => row.some(item => item === FourConnect.mark))
  }

  private hasWon(move: Move): boolean {
    return this.checkRow(move) || this.checkColumn(move) || this.checkDiagonals(move)
  }

  private checkDiagonals({ row, column, player }: Move): boolean {
    // Bottom right
    if (
      this.isInBoard(row + FourConnect.TOKENS_TO_CHECK, column + FourConnect.TOKENS_TO_CHECK) &&
      this.board[row + 1][column + 1] === player &&
      this.board[row + 2][column + 2] === player &&
      this.board[row + 3][column + 3] === player
    ) {
      return true
    }

    // Bottom left
    if (
      this.isInBoard(row + FourConnect.TOKENS_TO_CHECK, column - FourConnect.TOKENS_TO_CHECK) &&
      this.board[row + 1][column - 1] === player &&
      this.board[row + 2][column - 2] === player &&
      this.board[row + 3][column - 3] === player
    ) {
      return true
    }

    // Top left
    if (
      this.isInBoard(row - FourConnect.TOKENS_TO_CHECK, column - FourConnect.TOKENS_TO_CHECK) &&
      this.board[row - 1][column - 1] === player &&
      this.board[row - 2][column - 2] === player &&
      this.board[row - 3][column - 3] === player
    ) {
      return true
    }

    // Top right
    if (
      this.isInBoard(row - FourConnect.TOKENS_TO_CHECK, column + FourConnect.TOKENS_TO_CHECK) &&
      this.board[row - 1][column + 1] === player &&
      this.board[row - 2][column + 2] === player &&
      this.board[row - 3][column + 3] === player
    ) {
      return true
    }

    return false
  }

  private checkRow({ row, column, player }: Move): boolean {
    if (this.isInBoard(row, column + FourConnect.TOKENS_TO_CHECK)) {
      return (
        this.board[row][column + 1] === player &&
        this.board[row][column + 2] === player &&
        this.board[row][column + 3] === player
      )
    }

    if (this.isInBoard(row, column - FourConnect.TOKENS_TO_CHECK)) {
      return (
        this.board[row][column - 1] === player &&
        this.board[row][column - 2] === player &&
        this.board[row][column - 3] === player
      )
    }
    return false
  }

  private checkColumn({ row, column, player }: Move): boolean {
    if (this.isInBoard(row + FourConnect.TOKENS_TO_CHECK, column)) {
      return (
        this.board[row + 1][column] === player &&
        this.board[row + 2][column] === player &&
        this.board[row + 3][column] === player
      )
    }

    if (this.isInBoard(row - FourConnect.TOKENS_TO_CHECK, column)) {
      return (
        this.board[row - 1][column] === player &&
        this.board[row - 2][column] === player &&
        this.board[row - 3][column] === player
      )
    }

    return false
  }

  private static createBoard(rows = 6, columns = 7): number[][] {
    return Array.from({ length: rows }, (): number[] => Array.from({ length: columns }, () => -1))
  }

  private static createPlayers(_players: number): number[] {
    return Array.from({ length: _players }, (_, key: number) => key)
  }
}
