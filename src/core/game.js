/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { GameFlow } from './flow';

/**
 * Game
 *
 * Helper to generate the game move reducer. The returned
 * reducer has the following signature:
 *
 * (G, action, ctx) => {}
 *
 * You can roll your own if you like, or use any Redux
 * addon to generate such a reducer.
 *
 * The convention used in this framework is to
 * have action.type contain the name of the move, and
 * action.args contain any additional arguments as an
 * Array.
 *
 * Game({
 *   setup: (numPlayers) => {
 *     const G = {...};
 *     return G;
 *   },
 *
 *   moves: {
 *     'moveWithoutArgs': (G, ctx) => {
 *       return Object.assign({}, G, ...);
 *     },
 *     'moveWithArgs': (G, ctx, arg0, arg1) => {
 *       return Object.assign({}, G, ...);
 *     }
 *   },
 *
 *   victory: (G, ctx) => { ... },
 *
 *   phases: [
 *     { name: 'A', setup: (G, ctx) => G, cleanup: (G, ctx) => G },
 *     { name: 'B', setup: (G, ctx) => G, cleanup: (G, ctx) => G },
 *     ...
 *   ]
 *
 *   playerView: (G, ctx, playerID) => { ... },
 *
 *   flow: Flow({ ... })
 * })
 *
 * @param {...object} setup - Function that returns the initial state of G.
 * @param {...object} moves - A dictionary of move functions.
 * @param {...object} victory - A function that returns the ID of the
 *                              winner (if there is any).
 * @param {...object} phases - Option for GameFlow (see flow.js).
 * @param {...object} playerView - A function that returns a
 *                                 derivative of G tailored for
 *                                 the specified player.
 * @param {...object} flow - Customize the flow of the game.
 */
function Game({setup, moves, victory, phases, playerView, flow}) {
  if (!setup)       setup = () => ({});
  if (!moves)       moves = {};
  if (!victory)     victory = () => null;
  if (!playerView)  playerView = G => G;
  if (!flow)        flow = GameFlow({ victory, phases });

  return {
    setup,
    victory,
    playerView,
    flow,
    moveNames: Object.getOwnPropertyNames(moves),
    reducer: (G, action, ctx) => {
      if (moves.hasOwnProperty(action.type)) {
        const context = moves[action.type];
        const args = [G, ctx].concat(action.args);
        return moves[action.type].apply(context, args);
      }
      return G;
    },
  };
}

export default Game;