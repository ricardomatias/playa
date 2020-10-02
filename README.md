<h1 align="center">
    <img src="https://github.com/ricardomatias/playa/blob/master/assets/logo.png?raw=true" alt="Playa" />
</h1>

<p align="center">
    <a href="https://www.npmjs.com/package/playa"><img src="http://img.shields.io/npm/v/playa.svg?style=flat-square" alt="npm" /></a>
    <a href="https://github.com/ricardomatias/playa/blob/master/LICENSE"><img src="http://img.shields.io/npm/l/playa.svg?style=flat-square" alt="license" /></a>
    <a href="https://github.com/ricardomatias/playa/actions"><img src="https://github.com/ricardomatias/playa/workflows/CI/CD/badge.svg" alt="build" /></a>
    <a href='https://coveralls.io/github/ricardomatias/playa?branch=master'><img src='https://coveralls.io/repos/github/ricardomatias/playa/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

PLAYA *(pronounced `ˈpleɪə`)* is a musical theory framework aimed at creating musical phrases.

## Install

```bash
npm install --save playa
```

## Usage

### ES6 Modules

```js
import { Core, Tools, Functional, Constants } from 'playa';

// or everything
import * as Playa from 'playa';
```

### Common JS (Node)

```js
const { Core, Tools, Functional, Constants } = require('playa');

// or everything
const Playa = require('playa');
```

## Example

```js
import { Core, Tools, Functional } from 'playa';
const { Scale } = Core;
const { createMotif } = Functional;
const { Rhythm } = Tools;

const scale = new Scale('A', Scale.Major);

const rhythm = Rhythm.free('2n', ['4n', '2n'], ['4n']);

createMotif(scale.notes, rhythm);
/* =>
[
	{ "time": 0, "dur": 480, "next": 480, "midi": 76, "note": "E4", "isRest": false },
	{ "time": 480, "dur": 480, "next": 960, "midi": 74, "note": "D4", "isRest": false },
	{ "time": 960, "dur": 480, "next": 1440, "midi": -1, "note": "", "isRest": true },
	{ "time": 1440, "dur": 480, "next": 1920, "midi": 74, "note": "D4", "isRest": false }
]
*/
```

## Documentation

Can be found [here](https://ricardomatias.net/playa/?api).

## License

[Open Software License 3.0](LICENSE)
