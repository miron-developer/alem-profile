import { useRef, useEffect } from "react";

import { RandomKey, ReadableCount } from "utils/content";

import { CalculateBars } from "./calculate";
import styled from "styled-components";

const SFigure = styled.figure`
  width: 100%;
  height: 100%;
  padding: 1rem;
  background: #000000a3;

  figcaption {
    height: 10%;
    color: white;
    font-weight: bold;
  }

  .chart {
    width: 90%;
    height: 90%;
    padding: 1rem;
    margin: auto;
    display: flex;
    overflow: auto;

    & > * {
      margin: 0.5rem;
    }

    .bar-names {
      display: flex;
      justify-content: space-between;

      & span {
        display: block;
        font-size: 1rem;
        word-break: break-all;
        overflow: auto;
      }
    }

    .bar {
      transition: 0.3s;
      cursor: pointer;

      text {
        fill: white;
        font-size: 1rem;
        max-width: 10%;
      }

      &:hover,
      &:focus {
        fill: red !important;
        transition: 0.3s;

        text {
          fill: red;
        }
      }
    }
  }
`;

const colors = [
  "green",
  "blue",
  "yellow",
  "gray",
  "pink",
  "orange",
  "white",
  "purple",
  "chocolate",
];

const calculateIndex = (i) => {
  for (; colors.length <= i; ) i = i - colors.length;
  return i;
};

const Bar = ({
  amount,
  width,
  height,
  transform,
  rectTransform,
  amountTransform,
  accuracy,
  amountSuffix = "",
  i,
  direction,
}) => {
  // Hook for amount position calculation when direction = 3
  const textRef = useRef(null);

  // Hook for amount position calculation when direction = 3
  useEffect(() => {
    const el = textRef.current;

    if (parseInt(direction) === 3 && el) {
      const bb = el.getBBox();
      el.style.transform = el.style.transform + ` translate(-${bb.width}px,0)`;
    }
  });

  if (isNaN(parseFloat(amount))) return <g></g>;

  amount = ReadableCount(amount, accuracy);
  const textAmount = amount + amountSuffix;

  return (
    <g
      className="bar"
      style={{
        transform: transform,
        fill: colors[calculateIndex(i)],
      }}
    >
      <rect
        style={{
          transform: rectTransform,
        }}
        width={width}
        height={height}
      ></rect>

      <text ref={textRef} style={{ transform: amountTransform }}>
        {textAmount}
      </text>
    </g>
  );
};

export default function BarChart({
  data = [],
  title,
  direction = 0,
  accuracy,
  amountSuffix,
}) {
  if (!(data instanceof Array) || data.length === 0)
    return <div>not have data for graph</div>;

  const bars = CalculateBars(data, direction, amountSuffix);

  if (bars.length === 0) return <div>no graph</div>;
  return (
    <SFigure>
      <figcaption>{title}</figcaption>

      <div
        className="chart"
        style={{
          flexDirection: bars[0].flexDirection,
        }}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="100%"
        >
          {bars.map((b, i) => (
            <Bar
              key={RandomKey()}
              {...b}
              i={i}
              accuracy={accuracy}
              amountSuffix={amountSuffix}
              direction={direction}
            />
          ))}
        </svg>

        <div
          className="bar-names"
          style={{
            flexDirection: bars[0].namesFlexDirection,
          }}
        >
          {bars.map(({ name, textWidth, textHeight, textMargin }) => (
            <span
              style={{
                width: textWidth,
                height: textHeight,
                margin: textMargin,
              }}
              key={RandomKey()}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </SFigure>
  );
}
