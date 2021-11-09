import { useState } from "react";

import { RandomKey } from "utils/content";

import styled from "styled-components";

const SFigure = styled.figure`
  height: 100%;
  width: 100%;
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
  }

  .point {
    stroke: red;
    fill: transparent;
    cursor: pointer;

    &:hover {
      stroke: green;
      fill: #004a00;
    }
  }

  .axie-point {
    text {
      font-size: 2px;
      fill: white;
    }
  }

  .active-point-decription {
    & * {
      font-size: 2px;
    }
  }
`;

const getAxieCoords = (min, max, axiePoint, isX) => {
  if (isX) return [min, max, axiePoint, axiePoint];
  return [axiePoint, axiePoint, min, max];
};

const Axie = ({
  start,
  finish,
  axiePoint,
  descriptionLinesThickness,
  isX = false,
  points = [],
}) => {
  const [x1, x2, y1, y2] = getAxieCoords(start, finish, axiePoint, isX);

  const dots = [];

  const step = 100 / (points.length - 1);

  points.forEach((p, i) => {
    const d = isX ? start + step * i : start - step * i;
    const cx = isX ? d : axiePoint;
    const cy = isX ? axiePoint : d;
    const x = isX ? cx : cx - descriptionLinesThickness;
    const y = isX ? cy + descriptionLinesThickness : cy;

    dots.push(
      <g className="axie-point" key={RandomKey()}>
        <circle cx={cx} cy={cy} r=".5" fill="#0054ff" />

        <text
          style={{
            transform: isX
              ? "translateX(-50%) rotateZ(-45deg)"
              : "translateY(50%)",
            transformBox: "fill-box",
          }}
          textLength={descriptionLinesThickness}
          x={x}
          y={y}
        >
          {p}
        </text>
      </g>
    );
  });

  return (
    <g className="axie">
      <line
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y2}
        stroke="white"
        fill="transparent"
        strokeWidth=".1"
      />

      <g className="dots">{dots}</g>
    </g>
  );
};

const Mesh = ({ startX, startY, xCount, yCount }) => {
  const stepX = 100 / (xCount - 1);
  const xLines = [];
  for (let i = 0; i < xCount; i++) {
    const y = startY + stepX * i;
    xLines.push(
      <line
        key={RandomKey()}
        x1={startX}
        x2={startX + 100}
        y1={y}
        y2={y}
        stroke="#424242"
        fill="transparent"
        strokeWidth=".1"
      />
    );
  }

  const stepY = 100 / (yCount - 1);
  const yLines = [];
  for (let i = 0; i < yCount; i++) {
    const x = startX + stepY * i;
    yLines.push(
      <line
        key={RandomKey()}
        x1={x}
        x2={x}
        y1={startY}
        y2={startY + 100}
        stroke="#424242"
        fill="transparent"
        strokeWidth=".1"
      />
    );
  }

  return (
    <>
      <g className="x-mesh">{xLines}</g>
      <g className="y-mesh">{yLines}</g>
    </>
  );
};

export default function LineChart({
  title,
  points = [],
  xAxies = [],
  yAxies = [],
  descriptionLinesThickness,
  aspectRatio = "none",
}) {
  const [activePointIndex, setPointIndex] = useState(-1);

  if (!(points instanceof Array) || points.length === 0)
    return <div>wrong points or empty</div>;

  if (!(xAxies instanceof Array) || xAxies.length === 0)
    return <div>wrong x axie or empty</div>;

  if (!(yAxies instanceof Array) || yAxies.length === 0)
    return <div>wrong y axie or empty</div>;

  const coords = points.map((p) => p.coords);
  const coordsStr = coords.join(" ");

  return (
    <SFigure>
      <figcaption>{title}</figcaption>

      <div className="chart">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="100%"
          height="100%"
          preserveAspectRatio={aspectRatio}
          viewBox={`0 0 ${100 + descriptionLinesThickness} ${
            100 + descriptionLinesThickness
          }`}
        >
          <polyline
            fill="none"
            stroke="#3e00dd"
            strokeWidth=".2"
            points={coordsStr}
            className="line-progress"
          />

          <g className="points">
            {coords.map((p, i) => {
              const [x, y] = p.split(",");
              return (
                <circle
                  onMouseOver={() => setPointIndex(i)}
                  onMouseLeave={() => setPointIndex(-1)}
                  onMouseOut={() => setPointIndex(-1)}
                  onMouseEnter={() => setPointIndex(i)}
                  key={RandomKey()}
                  className="point"
                  cx={x}
                  cy={y}
                  r=".5"
                  strokeWidth=".2"
                />
              );
            })}
          </g>

          <g className="axies">
            <Axie
              isX={true}
              points={xAxies}
              start={descriptionLinesThickness}
              finish={descriptionLinesThickness + 100}
              axiePoint={100}
              descriptionLinesThickness={descriptionLinesThickness}
            />
            <Axie
              isX={false}
              points={yAxies}
              start={100}
              finish={0}
              axiePoint={descriptionLinesThickness}
              descriptionLinesThickness={descriptionLinesThickness}
            />
          </g>

          <g className="mesh">
            <Mesh
              startX={descriptionLinesThickness}
              startY={0}
              xCount={yAxies.length}
              yCount={xAxies.length}
            />
          </g>

          {activePointIndex >= 0 && (
            <foreignObject
              x={descriptionLinesThickness + 10}
              y={10}
              width="30"
              height="20"
              className="active-point-decription"
            >
              {points[activePointIndex].render()}
            </foreignObject>
          )}
        </svg>
      </div>
    </SFigure>
  );
}
