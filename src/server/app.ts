import express from 'express';
import { apiRouter } from './api';

export const backendApp = express();

backendApp.use(express.json());
backendApp.use(express.urlencoded({ extended: true }));

// Mount the API router
backendApp.use('/', apiRouter);
