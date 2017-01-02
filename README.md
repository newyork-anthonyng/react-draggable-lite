# React-Draggable (lite)

[![Travis](https://img.shields.io/travis/newyork-anthonyng/react-draggable-lite.svg)](https://travis-ci.org/newyork-anthonyng/react-draggable-lite/)
[![Codecov](https://img.shields.io/codecov/c/github/newyork-anthonyng/react-draggable-lite.svg)](https://codecov.io/gh/newyork-anthonyng/react-draggable-lite)
[![npm](https://img.shields.io/npm/l/react-draggable-lite.svg)](https://spdx.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

A lightweight component that makes its children draggable.

## Installation
```
$ npm install --save react-draggable-lite
```

## Basic Usage
```javascript
import Draggable from 'react-draggable-lite';

...

<Draggable
  onDragStart={() => console.log('drag start')}
  onDragging={() => console.log('dragging')}
  onDragEnd={() => console.log('drag end')}
>
  <h1>Hello World</h1>
</Draggable>
```

# API
| Property | Description |
| -------- | ----------- |
| onDragStart | A function that is called when the Draggable element is first clicked on or touched (on `mousedown` or `touchstart`) |
| onDragging | A function that is called when dragging the Draggable element (on `mousemove` or `touchmove`) |
| onDragEnd | A function that is called when the dragging has stopped (on `mouseend` or `touchend`) |
