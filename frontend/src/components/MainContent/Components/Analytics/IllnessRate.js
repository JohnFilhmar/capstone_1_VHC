import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useContext } from 'react';
import { colorTheme } from '../../../../App';
import tinycolor from 'tinycolor2';

const IllnessRate = ({ data }) => {
  const [selectedTheme] = useContext(colorTheme);

  function extendData(data, yearsToExtend = 5) {
    const yearIllnessMap = {};
    
    data.forEach(item => {
      if (!yearIllnessMap[item.illness]) {
        yearIllnessMap[item.illness] = new Map();
      }
      yearIllnessMap[item.illness].set(item.year, item.count);
    });

    const years = data.map(item => item.year);
    const earliestYear = Math.min(...years);

    for (const illness in yearIllnessMap) {
      for (let i = earliestYear - (yearsToExtend - (years.length - 1)); i <= Math.max(...years); i++) {
        if (!yearIllnessMap[illness].has(i)) {
          yearIllnessMap[illness].set(i, 0);
        }
      }
    }

    const sortedYears = Array.from(new Set([...years, ...Array.from({ length: yearsToExtend }).map((_, i) => earliestYear - i)])).sort((a, b) => a - b);

    const illnessData = Object.keys(yearIllnessMap).map(illness => ({
      illness,
      counts: sortedYears.map(year => yearIllnessMap[illness].get(year) || 0),
    }));

    return { sortedYears, illnessData };
  }

  const toPlot = extendData(data);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

  const chartOptions = {
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
        title: {
          display: true,
          text: 'Years',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Count',
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

  const chartData = {
    labels: toPlot.sortedYears,
    datasets: toPlot.illnessData.map((illnessData, i) => ({
      label: illnessData.illness,
      data: illnessData.counts,
      borderColor: tinycolor(selectedTheme).lighten(i * 10).toRgbString(),
      backgroundColor: tinycolor(selectedTheme).lighten(i * 10).toRgbString(),
      fill: false,
      borderWidth: 2,
    })),
  };

  return (
    <>
      <Line options={chartOptions} data={chartData} />
    </>
  );
};

export default IllnessRate;