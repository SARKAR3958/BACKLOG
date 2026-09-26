import express from 'express';
import path from 'path';
import { backendApp } from './src/server/app';

const app = express();
const PORT = process.env.PORT || 3000;

// Mount API routes
app.use('/api', backendApp);

// In production, serve static files from dist
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// For SPA routing, send index.html on any unknown route
app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BACKLOG SAVER production server running on port ${PORT}`);
});
