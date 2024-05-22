export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,

  game: {
    id: process.env.GAME_ID,
    delayMoves: parseInt(process.env.DELAY_MOVES, 10) || 5,
  }
});