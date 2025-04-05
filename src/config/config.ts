import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT,
  ballDontLieApiKey: process.env.BALL_DONT_LIE_API_KEY,
}

export default config;
