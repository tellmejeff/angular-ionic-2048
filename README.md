# 2048 Game - Angular and Ionic

A clone of the popular 2048 game built with Angular and Ionic.
This project demonstrates how to create an interactive game
using modern web technologies.

## Game Description

2048 is a single-player sliding block puzzle game. The game's objective is to slide numbered tiles on a grid to combine them and create a tile with the number 2048.

## How to Play

- Use your **arrow keys** (↑ ↓ ← →) to move all tiles in one direction
- On mobile devices, you can **swipe** up, down, left, or right
- When two tiles with the same number touch, they **merge into one** with their sum
- After each move, a new tile with a value of 2 or 4 appears in a random empty cell
- The game is won when a tile with the value 2048 appears
- The game is over when there are no more empty cells and no more moves possible

## Technologies Used

- **Angular**: Frontend framework for building the application
- **Ionic**: UI components and mobile-friendly features

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1.

## Development server

**Important Note**: This project requires Node.js version v20.19+ or v22.12+. Please ensure you have the correct version installed before running the application.

To check your Node.js version:

```bash
node -v
```

If you need to update Node.js, visit [https://nodejs.org/](https://nodejs.org/)
for installation instructions.

Once you have the correct Node.js version, start a local development
server by running:

```bash
ng serve
```

When the server is running, open your browser and navigate to
`http://localhost:4200/`. The application will automatically
reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate
a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`,
`directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in
the `dist/` directory. By default, the production build optimizes
your application for performance and speed.

## Running unit tests

Tests are written with Jest and can be run with:

```bash
npm run test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework
by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed
command references, visit the
[Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
