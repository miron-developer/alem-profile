// just debounce
export function Debounce(fn, ms) {
  let timeOut;
  return (...args) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}

/**
 * `GetValueFromListByIDAndInputValue` - get datalist's option value by listID and inputValue
 * @param {String} listID - list elem's id
 * @param {String} inputValue - input elem's value
 * @returns
 */
export const GetValueFromListByIDAndInputValue = (listID, inputValue) => {
  const list = document.getElementById(listID);
  if (!list) return;
  const dt = Array.from(list.childNodes);
  const op = dt.find((option) => option.value.includes(inputValue));
  if (op) return op.textContent;
};

/**
 * `SetListData` fill options to datalist
 * @param {String} listID - list elem's id
 * @param {Array} dataArr - data array
 * @param {Function} fillerCB - with this callback will be filled datalist options
 * @returns
 */
export const SetListData = (listID, dataArr = [], fillerCB = () => {}) => {
  if (!(dataArr instanceof Array) || !listID) return;

  const dt = document.getElementById(listID);
  if (!dt) return;

  const options = dataArr?.map(fillerCB);

  dt.innerHTML = "";
  dt.append(...options);
};

let RAF_ID; // requestAnimationFrame ID

export const AnimateWord = (selector) => {
  // checking
  if (!selector) return;
  const el = document.querySelector(selector);
  if (!el) return;

  // preparation
  const letters = el.textContent.split("");
  el.innerHTML = "";
  el.append(
    ...letters.map((l) => {
      const lElem = document.createElement("span");
      lElem.textContent = l;
      lElem.style.opacity = 0;
      return lElem;
    })
  );

  // animation
  const letterDurationMS = 100; // min = 100ms
  const duration = 2 * letters.length * letterDurationMS; // one iteration duration
  const delayMS = 1000; // delay between iteration
  const fps = 60; // frame per second
  const iterationMS = 1000 / fps;
  let isToShowAnimationDirection = true;
  let curPassMS = 0; // how many ms pass in current iteration
  let curLetterPassMS = 0; // how many pass animation with cur letter
  let curLetterIndex = 0; // with this letter work animation

  // main iterator, 60fps
  const iteration = () => {
    curLetterPassMS += iterationMS;

    const lElem = el.childNodes[curLetterIndex];
    const opacityStep = 1000 / (fps * letterDurationMS);

    if (isToShowAnimationDirection) {
      const next = parseFloat(lElem.style.opacity) + opacityStep;
      lElem.style.opacity = next > 1 ? 1 : next;
    } else {
      const next = parseFloat(lElem.style.opacity) - opacityStep;
      lElem.style.opacity = next < 0 ? 0 : next;
    }

    if (curLetterPassMS >= letterDurationMS) {
      // if last letter change direction and paste to start letter index
      // else just increment letter index
      if (curLetterIndex === letters.length - 1) {
        curLetterIndex = 0;
        isToShowAnimationDirection = !isToShowAnimationDirection;
      } else {
        curLetterIndex++;
      }
      curLetterPassMS = 0;
    }
  };

  const iterationCB = () => {
    curPassMS += iterationMS;

    if (curPassMS < duration) iteration();
    else if (curPassMS >= duration + delayMS) curPassMS = 0;

    window.cancelAnimationFrame(RAF_ID);
    RAF_ID = window.requestAnimationFrame(iterationCB);
  };

  RAF_ID = window.requestAnimationFrame(iterationCB);
};

export const StopAnimation = () => window.cancelAnimationFrame(RAF_ID);
