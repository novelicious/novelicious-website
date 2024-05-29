# novelicious.

novelicious is a web application Point-of-Sale (POS) system with recommender functionalities for novels and a question-answering system for their synopses.

## Features

- Point-of-sale
- Question Answering (based on the novel synopsis)
- Novel Recommender System
- Cross platform // Responsive 😋

## Requirements

- Laragon

- NPM

- Python >3.9

## Installation

To run this project:

Install dependencies

```bash
  npm install
```

Uvicorn is needed to run the [api.](https://github.com/novelicious/novelicious-api)

Set up your api on your local server change the env files based on your database configuration.

Install the requirement for python and run this:

```bash
uvicorn main:app --reload
```

Start the server

```bash
  npm run dev
```

## Tech Stack

**Client:** ReactJS, TailwindCSS

**Machine Learning:** PyTorch, etc

**Server:** FastAPI

## Authors

- [@nulitas](https://www.github.com/nulitas)
- [@rianfrhn](https://www.github.com/rianfrhn)
- [@zachisoni](https://www.github.com/zachisoni)
- [@ThugPou](https://www.github.com/ThugPou)
