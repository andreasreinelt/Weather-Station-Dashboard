// some Help Functions to be used in more than one file

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