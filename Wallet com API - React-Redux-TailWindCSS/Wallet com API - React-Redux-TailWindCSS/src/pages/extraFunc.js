const discoverName = (target, exchangeRates, values) => {
  const object = Object.entries(exchangeRates).find(

    (excha) => excha[0] === target,
  );
  const adjust = 100;
  const newAdjust = 1000;
  const fixedNumber = 3
  const obj = object;
  if (values) {
    const exchangeValue = obj[1].ask;
    const valueConvert = values.value * exchangeValue;
    obj[1].converted = parseInt(valueConvert * adjust, 10) / adjust;
  }
  obj[1].newAsk = (Math.round(obj[1].ask * newAdjust) / newAdjust).toFixed(fixedNumber);
  return obj[1];
};

const returnParse = (value) => {
  const adjust = 100;
  return parseInt(value * adjust, 10) / adjust;
};
export default { discoverName, returnParse };
