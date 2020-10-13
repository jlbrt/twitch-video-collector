import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as suggestionController from './controllers/suggestionController';
import * as errorHandlers from './errorHandlers';

export const app = express();

app.use(helmet.hidePoweredBy());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/suggestions', suggestionController.handleGetSuggestions);
app.all('*', (req, res, next) => res.sendStatus(404));

app.use(errorHandlers.handleValidationError);
app.use(errorHandlers.handleUnhandledError);
