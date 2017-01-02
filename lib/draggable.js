import React, { PropTypes } from 'react';

class Draggable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      xOffset: 0,
      yOffset: 0,
    };

    this.isDragging = false;
    this.currentMouseCoord = {
      x: null,
      y: null,
    };

    this.addEventListeners = this.addEventListeners.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.getMouseCoord = this.getMouseCoord.bind(this);
    this.elementWasClicked = this.elementWasClicked.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  componentDidMount() {
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  addEventListeners() {
    document.addEventListener('mousedown', this.handleStart);
    document.addEventListener('mousemove', this.handleMove);
    document.addEventListener('mouseup', this.handleEnd);

    document.addEventListener('touchstart', this.handleStart);
    document.addEventListener('touchmove', this.handleMove);
    document.addEventListener('touchend', this.handleEnd);
  }

  removeEventListeners() {
    document.removeEventListener('mousedown', this.handleStart);
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('mouseup', this.handleEnd);

    document.removeEventListener('touchstart', this.handleStart);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('touchend', this.handleEnd);
  }

  handleStart(e) {
    if (this.elementWasClicked(e.target)) {
      if (this.props.onDragStart) this.props.onDragStart();

      this.isDragging = true;
      const { clientX, clientY } = this.getMouseCoord(e);
      this.currentMouseCoord = {
        x: clientX,
        y: clientY,
      };
    }
  }

  elementWasClicked(target) {
    let wasClicked = false;
    let currentElement = target;
    while (currentElement) {
      if (currentElement === this.card) {
        wasClicked = true;
        break;
      }
      currentElement = currentElement.parentNode;
    }
    return wasClicked;
  }

  getMouseCoord(e) {
    const event = (e.touches && e.touches[0]) || e;
    return {
      clientX: event.clientX,
      clientY: event.clientY,
    };
  }

  handleMove(e) {
    if (!this.isDragging) return;

    const { clientX, clientY } = this.getMouseCoord(e);
    const deltaX = clientX - this.currentMouseCoord.x;
    const deltaY = clientY - this.currentMouseCoord.y;

    this.setState({
      xOffset: this.state.xOffset + deltaX,
      yOffset: this.state.yOffset + deltaY,
    });
    this.currentMouseCoord = {
      x: clientX,
      y: clientY,
    };

    if (this.props.onDragging) this.props.onDragging();
  }

  handleEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.forceUpdate();
    if (this.props.onDragEnd) this.props.onDragEnd();
  }

  calculateStyle() {
    const { xOffset, yOffset } = this.state;
    return Object.assign(
      {},
      this.props.children.props.style,
      {
        display: 'inline-block',
        transform: `translateX(${xOffset}px) translateY(${yOffset}px)`,
        willChange: `${this.isDragging ? 'transform' : 'unset'}`,
      },
    );
  }

  render() {
    return React.cloneElement(
      React.Children.only(this.props.children),
      {
        style: this.calculateStyle(),
        ref: (card) => { this.card = card; },
      },
    );
  }
}

Draggable.propTypes = {
  onDragStart: PropTypes.func,
  onDragging: PropTypes.func,
  onDragEnd: PropTypes.func,
  children: PropTypes.element.isRequired,
};

export default Draggable;
