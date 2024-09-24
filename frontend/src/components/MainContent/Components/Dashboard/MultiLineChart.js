import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useContext, useEffect, useState } from 'react';
import { colorTheme } from '../../../../App';
import tinycolor from 'tinycolor2';

const MultiLineChart = ({ title, data }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  function extendData(data, yearsToExtend = 5) {
    if (!data || !data.length) return { years: [], values: [] };
    const newData = data.map(item => item.delivery_year);
    const latestYear = Math.max(...newData);
    const earliestYear = Math.min(...newData);
    const yearMap = new Map(data.map(item => [item.delivery_year, item.delivery_count]));
    const currentYearCount = latestYear - earliestYear + 1;
    const missingYears = yearsToExtend - currentYearCount;
    for (let i = 1; i <= missingYears; i++) {
      const yearToAdd = earliestYear - i;
      if (!yearMap.has(yearToAdd)) {
        yearMap.set(yearToAdd, 0);
      }
    }
    const sortedYears = [...yearMap.keys()].sort((a, b) => a - b);
    const years = sortedYears;
    const values = sortedYears.map(year => yearMap.get(year));
    return { years, values };
  }

  useEffect(() => {
    const toPlot = extendData(data);
    setLabels(toPlot.years);
    setValues(toPlot.values);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

  const multiDataChartOptions = {
    responsive: true,
    plugins: {
      legend: true,
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
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const multiDataChartData = {
    labels,
    datasets: [
      {
        label: "Delivered Babies",
        data: values,
        backgroundColor: tinycolor('pink').toRgbString(),
        borderColor: tinycolor('red').toRgbString(),
        borderWidth: 2,
        fill: false,
      }
    ],
  };

  return (
    <div className={`col-span-2 p-2 md:p-3 lg:p-5 bg-${selectedTheme}-50 rounded-md`}>
      <div className="flex flex-row justify-between items-center p-3">
        <p className='text-base font-semibold'>{title}</p>
      </div>
      <Line options={multiDataChartOptions} data={multiDataChartData} />
    </div>
  );
}

export default MultiLineChart;