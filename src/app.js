import DoubleRange from './DoubleRange/index.js';

import './base.scss';

const doubleRangeElem = document.querySelector('[data-elem="double-range"]');

if (doubleRangeElem) {
  /* eslint-disable-next-line */
  new DoubleRange(doubleRangeElem);
}
