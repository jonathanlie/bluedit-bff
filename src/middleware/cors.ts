import cors from 'cors';
import { config } from '../config/index.js';

export const corsMiddleware = cors(config.server.cors);
