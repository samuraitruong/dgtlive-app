export default () => ({
    port: parseInt(process.env.PORT, 10) || 3001,

    game: {
      id: process.env.GAME_ID,
    }
  });