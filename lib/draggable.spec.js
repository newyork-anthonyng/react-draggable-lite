import React from 'react';
import { shallow, mount } from 'enzyme';
import Draggable from './draggable';

// mock document.addEventListener and document.removeEventListener
const map = {};
document.addEventListener = jest.fn((event, cb) => {
  map[event] = cb;
});
document.removeEventListener = jest.fn();

it('should handle mousedown on Draggable element', () => {
  const wrapper = mount(
    <Draggable>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.mousedown({
    target: myEl,
    clientX: 100,
    clientY: 200,
  });

  expect(wrapper.instance().currentMouseCoord).toEqual({
    x: 100,
    y: 200,
  });
  expect(wrapper.instance().isDragging).toEqual(true);
});

it('should handle mousedown on child of Draggable element', () => {
  const wrapper = mount(
    <Draggable>
      <header>
        <h1>Hello World</h1>
      </header>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  const myChildEl = myEl.childNodes[0];
  map.mousedown({
    target: myChildEl,
    clientX: 100,
    clientY: 200,
  });

  expect(wrapper.instance().currentMouseCoord).toEqual({
    x: 100,
    y: 200,
  });
  expect(wrapper.instance().isDragging).toEqual(true);
});

it('should do nothing if mousedown was not on Draggable element', () => {
  const wrapper = mount(
    <Draggable>
      <h1>Hello World</h1>
    </Draggable>
  );
  map.mousedown({
    target: null,
  });

  expect(wrapper.instance().currentMouseCoord).toEqual({
    x: null,
    y: null,
  });
  expect(wrapper.instance().isDragging).toEqual(false);
});

it('should handle touchstart', () => {
  const wrapper = mount(
    <Draggable>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.touchstart({
    target: myEl,
    touches: [{
      clientX: 100,
      clientY: 200,
    }],
  });

  expect(wrapper.instance().currentMouseCoord).toEqual({
    x: 100,
    y: 200,
  });
  expect(wrapper.instance().isDragging).toEqual(true);
});

it('should update xOffset and yOffset on mousemove when Draggable element is dragging', () => {
  const wrapper = mount(
    <Draggable>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.mousedown({
    target: myEl,
    clientX: 100,
    clientY: 200,
  });
  map.mousemove({
    clientX: 101,
    clientY: 202,
  });

  expect(wrapper.instance().isDragging).toEqual(true);
  expect(wrapper.state('xOffset')).toEqual(1);
  expect(wrapper.state('yOffset')).toEqual(2);
});

it('should do nothing on mousemove when Draggable element is not dragging', () => {
  const wrapper = mount(
    <Draggable>
      <h1>Hello World</h1>
    </Draggable>
  );
  map.mousedown({
    target: null,
  });
  map.mousemove({
    clientX: 100,
    clientY: 200,
  });

  expect(wrapper.instance().isDragging).toEqual(false);
  expect(wrapper.state('xOffset')).toEqual(0);
  expect(wrapper.state('yOffset')).toEqual(0);
});

it('should handle touchmove', () => {
  const wrapper = mount(
    <Draggable>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.touchstart({
    target: myEl,
    clientX: 100,
    clientY: 200,
  });
  map.touchmove({
    touches: [{
      clientX: 101,
      clientY: 202,
    }],
  });

  expect(wrapper.instance().isDragging).toEqual(true);
  expect(wrapper.state('xOffset')).toEqual(1);
  expect(wrapper.state('yOffset')).toEqual(2);
});

it('should remove event listeners when unmounting', () => {
  const wrapper = mount(
    <Draggable>
      <h1>Hello World</h1>
    </Draggable>
  );
  wrapper.unmount();
  expect(document.removeEventListener.mock.calls.length).toEqual(6);
});

it('should call props.onDragStart method on mousedown', () => {
  const cb = jest.fn();
  const wrapper = mount(
    <Draggable onDragStart={cb}>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.mousedown({
    target: myEl,
  });
  expect(cb.mock.calls.length).toEqual(1);
});

it('should not call props.onDragStart method on mousedown if Draggable element was not target', () => {
  const cb = jest.fn();
  const wrapper = mount(
    <Draggable onDragStart={cb}>
      <h1>Hello World</h1>
    </Draggable>
  );
  map.mousedown({
    target: null,
  });
  expect(cb.mock.calls.length).toEqual(0);
});

it('should call props.onDragging method on mousemove', () => {
  const cb = jest.fn();
  const wrapper = mount(
    <Draggable onDragging={cb}>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.mousedown({
    target: myEl,
  });
  map.mousemove({
    clientX: 100,
    clientY: 200,
  });

  expect(cb.mock.calls.length).toEqual(1);
});

it('should not call props.onDragging method on mousemove if Draggable element was not dragging', () => {
  const cb = jest.fn();
  const wrapper = mount(
    <Draggable onDragging={cb}>
      <h1>Hello World</h1>
    </Draggable>
  );
  map.mousedown({
    target: null,
  });
  map.mousemove({
    clientX: 100,
    clientY: 200,
  });

  expect(cb.mock.calls.length).toEqual(0);
});

it('should call props.onDragEnd method on mouseup', () => {
  const cb = jest.fn();
  const wrapper = mount(
    <Draggable onDragEnd={cb}>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.mousedown({
    target: myEl,
  });
  map.mousemove({
    clientX: 100,
    clientY: 200,
  });
  map.mouseup();

  expect(cb.mock.calls.length).toEqual(1);
});

it('should not call props.onDragEnd method on mouseup if Draggable element was not dragging', () => {
  const cb = jest.fn();
  const wrapper = mount(
    <Draggable onDragEnd={cb}>
      <h1>Hello World</h1>
    </Draggable>
  );
  map.mousedown({
    target: null,
  });
  map.mousemove({
    clientX: 100,
    clientY: 200,
  });
  map.mouseup();

  expect(cb.mock.calls.length).toEqual(0);
});

it('should set is dragging to false on mouseup', () => {
  const wrapper = mount(
    <Draggable>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.mousedown({
    target: myEl,
  });

  expect(wrapper.instance().isDragging).toEqual(true);
  map.mousemove({
    clientX: 100,
    clientY: 200,
  });
  map.mouseup();

  expect(wrapper.instance().isDragging).toEqual(false);
});

it('should call props.onDragStart method on touchstart', () => {
  const cb = jest.fn();
  const wrapper = mount(
    <Draggable onDragStart={cb}>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.touchstart({
    target: myEl,
  });
  expect(cb.mock.calls.length).toEqual(1);
});

it('should call props.onDragging method on touchmove', () => {
  const cb = jest.fn();
  const wrapper = mount(
    <Draggable onDragging={cb}>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.touchstart({
    target: myEl,
  });
  map.touchmove({
    clientX: 100,
    clientY: 200,
  });

  expect(cb.mock.calls.length).toEqual(1);
});

it('should call props.onDragEnd method on touchend', () => {
  const cb = jest.fn();
  const wrapper = mount(
    <Draggable onDragEnd={cb}>
      <h1>Hello World</h1>
    </Draggable>
  );
  const myEl = wrapper.instance().card;
  map.touchstart({
    target: myEl,
  });
  map.touchmove({
    clientX: 100,
    clientY: 200,
  });
  map.touchend();

  expect(cb.mock.calls.length).toEqual(1);
});

it('should update the css style of Draggable element', () => {
  const wrapper = mount(
    <Draggable>
      <h1>Hello World</h1>
    </Draggable>
  );
  let child = wrapper.find('h1').at(0);
  expect(child.prop('style')).toEqual({
    display: 'inline-block',
    transform: 'translateX(0px) translateY(0px)',
    willChange: 'unset',
  });

  const myEl = wrapper.instance().card;
  map.mousedown({
    target: myEl,
    clientX: 100,
    clientY: 200,
  });
  map.mousemove({
    clientX: 101,
    clientY: 202,
  });

  expect(child.prop('style')).toEqual({
    display: 'inline-block',
    transform: 'translateX(1px) translateY(2px)',
    willChange: 'transform',
  });
});

it('should keep css style of Draggable element children', () => {
  const wrapper = mount(
    <Draggable>
      <h1 style={{ color: 'red' }}>Hello World</h1>
    </Draggable>
  );
  let child = wrapper.find('h1').at(0);
  expect(child.prop('style').color).toEqual('red');

  const myEl = wrapper.instance().card;
  map.mousedown({
    target: myEl,
    clientX: 100,
    clientY: 200,
  });
  map.mousemove({
    clientX: 101,
    clientY: 202,
  });

  expect(child.prop('style').color).toEqual('red');
});
