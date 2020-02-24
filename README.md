# PLAYA

[![pipeline status](https://gitlab.com/ricardomatias/playa/badges/master/pipeline.svg)](https://gitlab.com/ricardomatias/playa/commits/master)
[![coverage report](https://gitlab.com/ricardomatias/playa/badges/master/coverage.svg)](https://gitlab.com/ricardomatias/playa/commits/master)

![alt](logo.png)

PLAYA *(pronounced `ˈpleɪə`)* is a musical theory framework aimed at creating musical phrases. It has concepts such as Keys, Scales, Chords and Notes, with which it provides ways of generating musical phrases.

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
import { Core, Tools, Functional } from 'playa;
const { Scale } = Core;
const { createMotif } = Functional;
const { Rhythm } = Tools;

const scale = new Scale('A', Scale.MAJOR);

const rhythm = Rhythm.free('1:0:0', ['4n', '8n']);
// => [ '4n', '8n', '8n', '4n', '8n', '8n' ]

createMotif(scale.notes, rhythm);
/* =>
[
  { time: 0, note: 'G#4', midi: 80, dur: '4n' },
  { time: 480, note: 'E4', midi: 76, dur: '8n' },
  { time: 720, note: 'E4', midi: 76, dur: '8n' },
  { time: 960, note: 'D4', midi: 74, dur: '4n' },
  { time: 1440, note: 'F#4', midi: 78, dur: '8n' },
  { time: 1680, note: 'D4', midi: 74, dur: '8n' }
]
*/
```

## Documentation

## License

[Open Software License 3.0](LICENSE)
