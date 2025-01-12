// some Help Functions to be used in more than one file

// prettifyDate: shows a pretty date, by default just the time and you can add more details:
// use it: helpers.prettifyDate(Timestamp or empty for current time, Time, Seconds, Weekday, Date)}

// getTrendSymbol: shows up, down, bar or empty for trends
// use it: helpers.getTrendSymbol('up' or 'down' or 'stable' for correlate symbols)

// getValueOrPlaceholder: shows a value with unit or "--" if empty
// use it: getValueOrPlaceholder('21,5', '°C') displays 21,5 °C and empty just --

// Here they are:

// This shows a pretty date, by default just the time, you can add more
export function prettifyDate(
  timestamp = new Date(),
  showTime = true,
  showSeconds = false,
  showWeekday = false,
  showDate = false,
) {
  const options = {};

  // default: just time
  if (showTime) {
  options.hour = '2-digit';
  options.minute = '2-digit';
  }

  // add seconds
  if (showSeconds) {
    options.second = '2-digit';
  }

  // add date
  if (showDate) {
    options.year = 'numeric';
    options.month = 'short';
    options.day = '2-digit';
  }

  // add weekday
  if (showWeekday) {
    options.weekday = 'long';
  }

  return new Date(timestamp).toLocaleString('en-US', options);
}

// This controlls the Trend Symbol
export function getTrendSymbol(trend) {
  return trend === 'up' ? '▲' : trend === 'down' ? '▼' : trend === 'stable' ? '▬' : '';
}

// Display value or placeholder
export function getValueOrPlaceholder(value, unit = '') {
  return value != null ? `${value} ${unit}` : '--';
}