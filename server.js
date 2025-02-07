const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apicache = require('apicache');
const path = require('path');
const Scraper = require('./services/Scraper');
const Checkpoint = require('./services/Checkpoint');

const app = express();
const cache = apicache.middleware;

const scrape = new Scraper();
const checkpoint = new Checkpoint();

app.use(morgan('dev'));
app.use(cors());
app.use(cache('1 hour'));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/cases', async (req, res) => {
  const data = await scrape.getCases();
  return res.json(data);
});

app.get('/cases-outside-ph', async (_, res) => {
  const data = await scrape.getCasesOutsidePh();
  return res.json(data);
});

app.get('/suspected-cases', async (_, res) => {
  const data = await scrape.getSuspectedCases();
  return res.json(data);
});

app.get('/patients-under-investigation', async (_, res) => {
  const data = await scrape.getPatientsUnderInvestigation();
  return res.json(data);
});

app.get('/mm-checkpoints', async (_, res) => {
  const data = checkpoint.getAll();
  return res.json(data);
});

app.get('/mm-checkpoints/:id', async (req, res) => {
  try {
    const data = checkpoint.getOne(req.params.id);
    return res.json(data);
  } catch (e) {
    return res.sendStatus(404);
  }
});

module.exports = app;