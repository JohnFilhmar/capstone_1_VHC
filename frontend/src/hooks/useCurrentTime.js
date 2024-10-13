import { useEffect, useState } from "react";

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentDay = String(currentDate.getDate()).padStart(2, '0');
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const startDate = `${currentYear}-${currentMonth}-${currentDay}`;
  const endDate = `${currentYear}-${currentMonth}-${daysInMonth}`;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString();

  const TimeComponent = () => (
    <p>Time: {formattedTime}</p>
  );
  const DateComponent = () => (
    <p>Date: {formattedDate}</p>
  );
  const offsetInMinutes = currentTime.getTimezoneOffset();
  const adjustedTime = new Date(currentTime.getTime() - (offsetInMinutes * 60000));
  const mysqlTime = adjustedTime.toISOString().slice(0, 19).replace('T', ' ');

  return {
    DateComponent,
    TimeComponent,
    formattedTime,
    formattedDate,
    startDate,
    endDate,
    currentTime,
    mysqlTime,
    weeks,
    months,
  };
};
 
export default useCurrentTime;
