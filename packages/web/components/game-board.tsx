'use client'

import { type GameSchema } from '@esusu/core/models'
import { useEffect, useRef, useState } from 'react'
import { randomUUID } from '@esusu/core/utils/random'
import { TestIds } from '@esusu/core/testing/ids'
import { COLOR_CLASSES_PER_PLAYER, HOVERED_COLOR_CLASSES_PER_PLAYER } from '@esusu/core/styles/colors'
import type { Move } from '@esusu/core/four-connect'
import { FourConnect } from '@esusu/core/four-connect'
import { Button } from '@/components/ui/button'
import { PlayerCard } from '@/components/player-card'

type GameBoardProps = {
  players: number
  gameSchema: GameSchema
}

export function GameBoard({ players, gameSchema }: GameBoardProps) {
  const game = useRef<FourConnect>(FourConnect.start(players))
  const [gameState, setGameState] = useState(game.current.gameState)
  const isGameFinished = gameState.state === 'DRAW' || gameState.state === 'WINNER'
  const winner = gameState.state === 'WINNER' ? gameState.winner : null
  const { currentPlayer } = game.current

  useEffect(() => {
    const fourConnect = game.current
    if (fourConnect.gameState.state === 'ONGOING' || fourConnect.gameState.state === 'NOT_STARTED') {
      if (
        (gameSchema.firstPlayer.isAI && fourConnect.currentPlayer === 0) ||
        (gameSchema.secondPlayer.isAI && fourConnect.currentPlayer === 1)
      ) {
        fourConnect.randomMove()
        setGameState(fourConnect.gameState)
      }
    }
  }, [gameSchema, game.current.currentPlayer, game.current.gameState])

  function move(column: number) {
    game.current.play(column)
    setGameState(game.current.gameState)
  }

  function undo() {
    game.current.undo()
    setGameState(game.current.gameState)
  }

  function reset() {
    game.current.reset()
    setGameState(game.current.gameState)
  }

  return (
    <section className="grid grid-cols-2 lg:gap-4 gap-6">
      <div className="col-span-2 lg:col-span-1 grid">
        <Grid move={move} isGameFinished={isGameFinished} fourConnect={game.current} gameSchema={gameSchema} />
      </div>
      <div className="col-span-2 lg:order-2 order-last lg:col-span-1 flex flex-col gap-2">
        <div className="flex-1 p-4">
          <History
            history={game.current.history}
            firstPlayerName={gameSchema.firstPlayer.name}
            secondPlayerName={gameSchema.secondPlayer.name}
          />
        </div>
        <div className="flex justify-center gap-10">
          <Button
            className="p-4"
            disabled={game.current.gameState.state === 'NOT_STARTED'}
            onClick={undo}
            type="button"
          >
            Undo
          </Button>
          <Button
            className="p-4"
            data-testid={TestIds.ConnectFourReset}
            onClick={reset}
            type="button"
            variant="destructive"
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="col-span-2 order-3 flex align-middle items-center pt-10">
        <PlayerCard player={gameSchema.firstPlayer} playerId={0} winner={winner} currentPlayer={currentPlayer} />
        <PlayerCard player={gameSchema.secondPlayer} playerId={1} winner={winner} currentPlayer={currentPlayer} />
      </div>
    </section>
  )
}

type GridProps = {
  isGameFinished: boolean
  fourConnect: FourConnect
  gameSchema: GameSchema
  // eslint-disable-next-line no-unused-vars -- Rule not working correctly for types
  move: (column: number) => void
}

function Grid({ isGameFinished, fourConnect, move }: GridProps) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)
  const isColumnHovered = (columnIndex: number) => columnIndex === hoveredColumn
  const board = fourConnect.board
  const columns = fourConnect.board[fourConnect.board.length - 1]

  function getColor(row: number, column: number) {
    const position = fourConnect.board[row][column]
    return COLOR_CLASSES_PER_PLAYER[position]
  }

  function onColumnEnter(column: number) {
    setHoveredColumn(column)
  }

  function onColumnLeave() {
    setHoveredColumn(null)
  }

  function getHoverColor(columnIndex: number, rowIndex: number) {
    const row = fourConnect.getLastRowForMove(columnIndex)
    if (isColumnHovered(columnIndex) && rowIndex === row) {
      return HOVERED_COLOR_CLASSES_PER_PLAYER[fourConnect.currentPlayer]
    }
    return ''
  }

  return (
    <div className={`grid grid-rows-${board.length} grid-cols-${board[0].length} lg:gap-1 gap-4`}>
      {columns.map((_, columnIndex) => (
        <button
          className="button rounded-full"
          disabled={isGameFinished}
          data-testid={TestIds.ConnectFourColumns(columnIndex)}
          key={randomUUID()}
          onClick={() => {
            move(columnIndex)
          }}
          onMouseOver={() => {
            onColumnEnter(columnIndex)
          }}
          onFocus={() => {
            onColumnEnter(columnIndex)
          }}
          onBlur={onColumnLeave}
          onMouseLeave={onColumnLeave}
          type="button"
        >
          {columnIndex + 1}
        </button>
      ))}
      {board.map((row, rowIndex) =>
        row.map((_, columnIndex) => (
          <div
            className={`rounded-full ${getColor(rowIndex, columnIndex)} h-6 w-6 lg:h-12 lg:w-12 m-auto ${getHoverColor(
              columnIndex,
              rowIndex
            )}`}
            key={randomUUID()}
          />
        ))
      )}
    </div>
  )
}

type HistoryProps = {
  history: readonly Move[]
  firstPlayerName: string
  secondPlayerName: string
}

function History({ history, firstPlayerName, secondPlayerName }: HistoryProps) {
  const getPlayerName = (value: number) => (value === 1 ? firstPlayerName : secondPlayerName)

  return (
    <>
      <h3>Moves</h3>
      <div className="scroll-smooth max-h-80 overflow-y-scroll">
        {history.map(item => (
          <p className="text-xs pb-0.5" key={`player-${item.player}-${item.column}-${item.row}`}>
            <span className="font-bold">{getPlayerName(item.player)}</span>: column: {item.column + 1}, row:{' '}
            {item.row + 1}
          </p>
        ))}
      </div>
    </>
  )
}
