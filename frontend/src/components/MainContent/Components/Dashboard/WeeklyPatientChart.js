import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../App";
import tinycolor from "tinycolor2";
// import useDropdown from "../Elements/DropdownButton";

const WeeklyPatientChart = ({ title, weekly_patients }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [labels, setLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);

  function predictNextValues(data, valuesToPredict = 2) {
    const n = data.length;
    const avgIndex = (n - 1) / 2;
    const avgData = data.reduce((sum, count) => sum + count, 0) / n;
    let numerator = 0;
    let denominator = 0;
    data.forEach((count, i) => {
      numerator += (i - avgIndex) * (count - avgData);
      denominator += Math.pow(i - avgIndex, 2);
    });
    const slope = numerator / denominator;
    const intercept = avgData - slope * avgIndex;
    const predictions = [];
    for (let i = n; i < n + valuesToPredict; i++) {
      const predictedCount = slope * i + intercept;
      predictions.push(Math.round(predictedCount));
    }
    return predictions;
  }

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const getWeekdayNumber = (day) => {
    return weekdays.indexOf(day);
  };
  useEffect(() => {
    const days =
      weekly_patients?.map((item) => getWeekdayNumber(item.day_name)) || [];
    const requiredDays = 5;
    if (days.length < requiredDays) {
      const firstDay = days[0] ?? 0;
      const missingDays = [];
      for (let i = 0; i < requiredDays; i++) {
        const day = (firstDay + i) % requiredDays;
        missingDays.push(day);
      }
      const result = missingDays.slice(3).concat(missingDays.slice(0, 3));
      let numDays = [...new Set([...result, ...days])];
      for (let i = 0; i < requiredDays; i++) {
        numDays[i] = weekdays[numDays[i]].substring(0, 3);
      }
      setLabels(numDays);
    }
    setChartData(() => {
      const patientCounts =
        weekly_patients?.map((patient) => patient.patient_count) || [];
      const zerosNeeded = 3 - patientCounts?.length;
      const zeroArray = (zerosNeeded && Array(zerosNeeded).fill(0)) || [];
      const paddedData = [...zeroArray, ...patientCounts];
      setPredictedData([...predictNextValues(paddedData, 3)]);
      return paddedData;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekly_patients]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
  );

  const patientChartOptions = {
    responsive: true,
    plugins: {
      legend: false,
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
        title: {
          display: false, // display side title of Y axis
          text: "Patient Count",
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const getRandomSoftColor = () => {
    return tinycolor({ h: Math.random() * 360, s: 0.5, l: 0.7 }).toRgbString();
  };

  const PatientData = {
    labels,
    datasets: [
      {
        label: "Patient Count",
        data: [...chartData, ...predictedData],
        backgroundColor: getRandomSoftColor(),
        borderColor: "#000000",
        fill: false,
        borderWidth: 2,
        segment: {
          borderDash: (ctx) =>
            ctx.p0.parsed.x >= chartData.length - 1 ? [5, 5] : [],
        },
      },
    ],
  };

  return (
    <div
      className={`col-span-2 md:col-span-2 lg:col-span-1 p-2 md:p-3 lg:p-5 bg-${selectedTheme}-50 rounded-md`}
    >
      <div className="flex flex-row justify-between items-center p-3">
        <p className="text-base font-semibold">{title}</p>
        {/* <DropdownButton /> */}
      </div>
      <Line options={patientChartOptions} data={PatientData} />
    </div>
  );
};

export default WeeklyPatientChart;
