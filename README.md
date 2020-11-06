<h1 align="center">
    <img src="https://github.com/ricardomatias/playa/blob/master/assets/logo.png?raw=true" alt="Playa" />
</h1>

<p align="center">
    <a href="https://www.npmjs.com/package/playa"><img src="http://img.shields.io/npm/v/playa.svg?style=flat-square" alt="npm" /></a>
    <a href="https://github.com/ricardomatias/playa/blob/master/LICENSE"><img src="http://img.shields.io/npm/l/playa.svg?style=flat-square" alt="license" /></a>
    <a href="https://github.com/ricardomatias/playa/actions"><img src="https://github.com/ricardomatias/playa/workflows/CI/CD/badge.svg" alt="build" /></a>
    <a href='https://coveralls.io/github/ricardomatias/playa?branch=master'><img src='https://coveralls.io/repos/github/ricardomatias/playa/badge.svg?branch=master' alt='Coverage Status' /></a>
    <a href='https://bundlephobia.com/result?p=playa'><img src='https://badgen.net/bundlephobia/minzip/playa' alt='Bundlephobia min + gzip' /></a>
    <a href='https://bundlephobia.com/result?p=playa'><img src='https://badgen.net/bundlephobia/tree-shaking/playa' alt='Bundlephobia tree-shaking' /></a>
</p>

PLAYA *(pronounced `ˈpleɪə`)* is a framework for musical composition. It allows creating custom music algorithms, musical phrases, percussion rhythms, harmonic sequences and more.

## Install

```bash
npm install --save playa
```

## Usage

### ES6 Modules

```js
import { Chord, Key, Rhythm } from 'playa';

// or everything
import * as Playa from 'playa';
```

### Common JS (Node)

```js
const { Chord, Key, Rhythm } = require('playa');

// or everything
const Playa = require('playa');
```

## Example

```js
import { Scale, createMotif } from 'playa';

const scale = new Scale('A', Scale.Major);

createMotif(scale.notes, ['4n', '2n', '8nt']);
/* =>
[
    { time: 0, dur: 480, next: 480, midi: 73, note: 'C#4', isRest: false },
    { time: 480, dur: 960, next: 1440, midi: 80, note: 'G#4', isRest: false },
    { time: 1440, dur: 160, next: 1600, midi: 74, note: 'D4', isRest: false }
]
*/
```

## Guides

Interactive guide [here](https://observablehq.com/@ricardomatias/playa) which uses [Tone.js](https://tonejs.github.io/) for the sound.

An example of using PLAYA with P5 and Tone.js - [PLAYA meets P5](https://observablehq.com/@ricardomatias/playa-meets-p5)

## Documentation

Can be found [here](https://ricardomatias.net/playa/?api).

## License

[Open Software License 3.0](LICENSE)
