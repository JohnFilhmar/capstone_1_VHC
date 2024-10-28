import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useContext, useEffect, useState } from 'react';
import { colorTheme } from '../../../../App';
import tinycolor from 'tinycolor2';
import useDropdown from '../Elements/DropdownButton';

const PatientChart = ({ title, annual_patients, monthly_patients, daily_patients }) => {
  const [selectedTheme] = useContext(colorTheme);

  const [periods, setPeriods] = useState({});
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
    const intercept = avgData - (slope * avgIndex);
    const predictions = [];
    for (let i = n; i < n + valuesToPredict; i++) {
      const predictedCount = slope * i + intercept;
      predictions.push(Math.round(predictedCount));
    }
    return predictions;
  }

  useEffect(() => {
    setPeriods({
      yearly: (() => {
        const years = annual_patients?.map(item => item.year) || [];
        const requiredYears = 4;
        if (years.length < requiredYears) {
          const lastYear = Number(years[0]) - 1;
          const missingLength = requiredYears - years.length;
          const missingYears = Array.from({ length: missingLength },(_, index) => {
            return lastYear - index;
          });
          years.push(...[1,2].map(i => Number(years[years.length-1]) + i));
          return [...missingYears.sort(), ...years];
        }
        return years;
      })(), // Immediately invoked function expression (IIFE)
      monthly: (() => {
        const months = monthly_patients?.map(item => item.month);
        const requiredMonths = 6;
        if (months?.length < requiredMonths) {
          const monthNum = new Date(`2000-${months[0]}-01`);
          const lastMonth = Number(monthNum.getMonth());
          const missingMonthLength = requiredMonths - months.length;
          const missingMonths = Array.from({ length: missingMonthLength }, (_, index) => {
            const newMonth = new Date(`2000-${lastMonth-index}-01`);
            return newMonth.toLocaleString('default', {month: 'long'});
          });
          months.push(...[1,2].map(i => (new Date(`${monthNum + 1}-2000`).toLocaleString('default', {month: 'long'}))));
          const monthSet = [...missingMonths.sort((a,b) => new Date(`${a} 2000`) - new Date(`${b} 2000`)), ...months];
          return monthSet.map(month => month.length > 3 ? month.substring(0, 3) : month);
        }
        return months;
      })() || [],
      daily: ['Sat', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    });
    setChartData(() => {
      const patientCounts = annual_patients?.map(patient => patient.patient_count) || [];
      const zerosNeeded = 4 - patientCounts?.length;
      const zeroArray = (zerosNeeded && Array(zerosNeeded).fill(0)) || [];
      const paddedData = [...zeroArray, ...patientCounts];
      setPredictedData([...predictNextValues(paddedData, 2)]);
      return paddedData;
    });    
  }, [annual_patients, monthly_patients, daily_patients]);

  useEffect(() => {
    setLabels(periods.yearly);
  }, [periods]);

  useEffect(() => {
    console.log(labels);
  }, [labels]);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

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
          text: 'Patient Count',
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
        label: 'Patient Count',
        data: [...chartData, ...predictedData],
        backgroundColor: getRandomSoftColor(),
        borderColor: '#000000',
        fill: false,
        borderWidth: 2,
        segment: {
          borderDash: ctx => (ctx.p0.parsed.x >= chartData.length - 1 ? [5, 5] : []),
        },
      },
      // {
      //   label: 'Predicted Future Patient Count',
      //   data: predictedData,
      //   borderColor: "#000000",
      //   backgroundColor: getRandomSoftColor(),
      //   borderWidth: 1,
      //   borderDash: [5, 5],
      // }
    ],
  };

  const { DropdownButton } = useDropdown({
    options: ['Yearly', 'Monthly', 'Daily'],
    defaultOption: 'Yearly',
    onSelect: (selected) => {
      selected === 'Yearly' ? setLabels(periods.yearly)
      : selected === 'Monthly' ? setLabels(periods.monthly)
      : setLabels(periods.daily);
    },
  });

  return (
    <div className={`col-span-2 md:col-span-2 lg:col-span-1 p-2 md:p-3 lg:p-5 bg-${selectedTheme}-50 rounded-md`}>
      <div className="flex flex-row justify-between items-center p-3">
        <p className='text-base font-semibold'>{ title }</p>
        <DropdownButton />
      </div>
      <Line options={patientChartOptions} data={PatientData} />
    </div>
  );
};

export default PatientChart;