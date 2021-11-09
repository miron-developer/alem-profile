// direction = 0
const toUp = (barThickness, curBarsValuePeak, translateStep, i, marginStep) => {
  return {
    WH: [barThickness, curBarsValuePeak],
    translateXY: [translateStep * i, 0],
    amountTransformXY: [0, 100 - curBarsValuePeak + "%"],
    rectTransformXY: [0, 100 - curBarsValuePeak],
    flexDirection: "column",
    namesFlexDirection: "row",
    textMargin: `0 ${marginStep}% 0 0`,
    textWH: [barThickness, 100],
  };
};

// direction = 2
const toDown = (
  barThickness,
  curBarsValuePeak,
  translateStep,
  i,
  marginStep
) => {
  return {
    WH: [barThickness, curBarsValuePeak],
    translateXY: [translateStep * i, 0],
    amountTransformXY: [0, `calc(${curBarsValuePeak}% + 1rem)`],
    rectTransformXY: [0, 0],
    flexDirection: "column-reverse",
    namesFlexDirection: "row",
    textMargin: `0 ${marginStep}% 0 0`,
    textWH: [barThickness, 100],
  };
};

// direction = 1
const toRight = (
  barThickness,
  curBarsValuePeak,
  translateStep,
  i,
  marginStep
) => {
  return {
    WH: [curBarsValuePeak, barThickness],
    translateXY: [0, translateStep * i],
    amountTransformXY: [curBarsValuePeak + "%", barThickness / 2 + "%"],
    rectTransformXY: [0, 0],
    flexDirection: "row-reverse",
    namesFlexDirection: "column",
    textMargin: `0 0 ${marginStep}% 0`,
    textWH: [100, barThickness],
  };
};

// direction = 3
const toLeft = (
  barThickness,
  curBarsValuePeak,
  translateStep,
  i,
  marginStep
) => {
  return {
    WH: [curBarsValuePeak, barThickness],
    translateXY: [0, translateStep * i],
    amountTransformXY: [100 - curBarsValuePeak + "%", barThickness / 2 + "%"],
    rectTransformXY: [100 - curBarsValuePeak, 0],
    flexDirection: "row",
    namesFlexDirection: "column",
    textMargin: `0 0 ${marginStep}% 0`,
    textWH: [100, barThickness],
  };
};

const getBarConfigs = (direction) => {
  if (direction === 1) return toRight;
  if (direction === 2) return toDown;
  if (direction === 3) return toLeft;
  return toUp;
};

export const CalculateBars = (data = [], direction) => {
  const maxAmount = Math.max(...data.map((b) => b.amount)); // calculate maximum possible value/amount
  const barCount = data.length; // how many bar exist
  const maxBarValuePeak = 80; // bar's width/height with maximum value. the max peak mb you can say
  const maxBarsPlace = 80; // svg's maximum place dedicated for all bar
  const barThickness = maxBarsPlace / barCount; // bar's thickness
  const translateStep = 100 / barCount; // for calculating translate distance between bars

  // text calculation
  const marginStep = 20 / barCount; // for text margin

  direction = parseInt(direction); // if is string

  return data.map((b, i) => {
    const curBarsValuePeak = (maxBarValuePeak * b.amount) / maxAmount;

    const {
      WH,
      rectTransformXY,
      translateXY,
      amountTransformXY,
      textMargin,
      flexDirection,
      namesFlexDirection,
      textWH,
    } = getBarConfigs(direction)(
      barThickness,
      curBarsValuePeak,
      translateStep,
      i,
      marginStep
    );

    return {
      ...b,
      width: WH[0] + "%",
      height: WH[1] + "%",
      transform: `translate(${translateXY[0]}%, ${translateXY[1]}%)`,
      rectTransform: `translate(${rectTransformXY[0]}%, ${rectTransformXY[1]}%)`,
      amountTransform: `translate(${amountTransformXY[0]}, ${amountTransformXY[1]})`,

      // for text
      textMargin,
      flexDirection,
      namesFlexDirection,
      textWidth: textWH[0] + "%",
      textHeight: textWH[1] + "%",
    };
  });
};
