function shortenDate(date: Date) {
  // return date in the format DD MMM [YYYY]

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  // if same year dont show year
  if (year === new Date().getFullYear()) {
    return `${day} ${month}`;
  }

  return `${day} ${month} ${year}`;
}

export default shortenDate
