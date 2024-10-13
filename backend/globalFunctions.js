function convertDate(Ddate) {
  const date = new Date(Ddate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours() % 12 || 12;
  const meridian = date.getHours() >= 12 ? 'PM' : 'AM';
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const formattedDateString = `${month}-${day}-${year} ${hours}:${minutes} ${meridian}`;
  return formattedDateString;
};

module.exports = {
  convertDate,
}