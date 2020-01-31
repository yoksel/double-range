import { fillTemplate, createElement } from './helpers.js';
import tmpl from './template.js';

import './styles.scss';

export default class DoubleRange {
  constructor (elemPlaceholder) {
    this.render(elemPlaceholder);

    this.control = {
      elem: this.elem
    };

    // Use form to check reset
    this.form = this.control.elem.closest('form');

    this.thumbs = {
      from: {
        elem: this.control.elem.querySelector('.double-range__thumb--from')
      },
      to: {
        elem: this.control.elem.querySelector('.double-range__thumb--to')
      },
      currentKey: null,
      current: null,
      min: null,
      max: null
    };

    this.thumbsList = {
      from: this.thumbs.from,
      to: this.thumbs.to
    };

    this.inputs = {
      from: this.control.elem.querySelector('.double-range__input--from'),
      to: this.control.elem.querySelector('.double-range__input--to')
    };

    this.values = {
      from: this.control.elem.querySelector('.double-range__label-text--from'),
      to: this.control.elem.querySelector('.double-range__label-text--to')
    };

    this.coords = {
      x: 0,
      min: null,
      max: null
    };

    // Assume both inputs have equal max values on start
    this.maxValue = this.inputs.to.max;

    this.setThumbPosition = this.setThumbPosition.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.moveThumb = this.moveThumb.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.reset = this.reset.bind(this);

    this.init();
  }

  render (elemPlaceholder) {
    const placeHolderClass = elemPlaceholder.className;

    const data = {
      class: placeHolderClass,
      ...elemPlaceholder.dataset
    };

    const markup = fillTemplate({
      tmpl,
      data
    });

    this.elem = createElement(markup);
    elemPlaceholder.replaceWith(this.elem);
  }

  init () {
    this.disableDefaultDragstart();
    this.addEvents();

    // Dirty hack to fix wrong thumb position
    // at first paint
    setTimeout(() => {
      this.reset();
    }, 100);
  }

  reset () {
    this.control.coords = this.control.elem.getBoundingClientRect();
    this.thumbs.width = this.thumbs.from.elem.offsetWidth;
    this.thumbs.maxLeft = this.control.elem.offsetWidth - this.thumbs.width;

    this.coords.min = 0;
    this.coords.max = this.thumbs.maxLeft;

    this.setThumbPosition();
  }

  disableDefaultDragstart () {
    const list = Object.values(this.thumbsList);

    list.forEach(elem => {
      elem.ondragstart = () => false;
    });
  }

  setThumbPosition (params = {}) {
    const { inputKey, reset } = params;

    for (const key in this.thumbsList) {
      if (inputKey && inputKey !== key) {
        continue;
      }

      const input = this.inputs[key];
      const thumb = this.thumbs[key].elem;
      const valueElem = this.values[key];
      const elemWidth = this.control.elem.clientWidth;

      // Glass wall for inputs
      if (key === 'from') {
        const compareTo = this.inputs.to;
        const inputValue = +input.value;
        const compareToValue = +compareTo.value;

        if (inputValue >= compareToValue) {
          input.value = compareToValue - compareTo.step;
        }
      } else {
        const compareTo = this.inputs.from;
        const inputValue = +input.value;
        const compareToValue = +compareTo.value;
        const compareToStep = +compareTo.step;

        if (inputValue <= compareToValue) {
          input.value = compareToValue + compareToStep;
        }
      }

      // Set thumb position
      const value = reset ? input.defaultValue : input.value;

      let left = value / this.maxValue * (elemWidth - this.thumbs.width);
      left = left.toFixed();

      this.thumbs[key].x = left;
      thumb.style.left = `${left}px`;

      // Set label texts
      valueElem.innerHTML = value;
      valueElem.style.left = `${left}px`;
    }
  }

  // Events
  addEvents () {
    for (const key in this.inputs) {
      const input = this.inputs[key];
      const thumb = this.thumbs[key].elem;

      thumb.ondragstart = () => false;

      input.addEventListener('input', () => {
        this.setThumbPosition({ inputKey: key });
      });
    }

    this.control.elem.addEventListener('pointerdown', this.pointerDown);

    window.addEventListener('resize', this.reset);

    this.form.addEventListener('reset', () => {
      this.setThumbPosition({ reset: true });
    });
  }

  pointerDown (event) {
    const key = event.target.dataset.key;
    if (!key) {
      return;
    }
    event.preventDefault();

    this.thumbs.currentKey = key;
    this.thumbs.current = this.thumbs[key];

    this.startDrag();
  }

  // Dragging
  startDrag () {
    const thumbCoords = this.thumbs.current.elem.getBoundingClientRect();
    this.thumbs.offset = event.pageX - thumbCoords.left;

    this.elemCoords = this.control.elem.getBoundingClientRect();

    this.control.elem.addEventListener('pointermove', this.moveThumb);
    this.control.elem.addEventListener('pointerup', this.stopDrag);
    document.addEventListener('pointerup', this.stopDrag);
  }

  moveThumb (event) {
    this.coords.x = event.pageX - this.elemCoords.left - this.thumbs.offset;
    const max = this.coords.max;
    const key = this.thumbs.currentKey;
    const value = this.coords.x / max * this.maxValue;

    this.inputs[key].value = value;
    this.inputs[key].focus();
    const inputEvent = new Event('input');
    this.inputs[key].dispatchEvent(inputEvent);
  }

  stopDrag () {
    this.control.elem.removeEventListener('pointermove', this.moveThumb);
    this.control.elem.removeEventListener('pointerup', this.stopDrag);
    document.removeEventListener('pointerup', this.stopDrag);
  }
}
