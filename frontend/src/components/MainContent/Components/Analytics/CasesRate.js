import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import tinycolor from 'tinycolor2';

const CasesRate = ({ data }) => {

  function extendData(data, yearsToExtend = 5) {
    const currentYear = new Date().getFullYear(); 
    const startYear = currentYear - 4;
    const yearCasesMap = {};
    data.forEach(item => {
      if (!yearCasesMap[item.case_name]) {
        yearCasesMap[item.case_name] = {};
      }
      yearCasesMap[item.case_name][item.year] = item.count;
    });
    const sortedYears = Array.from({ length: yearsToExtend }, (_, i) => startYear + i);
    const casesData = Object.keys(yearCasesMap).map(case_name => ({
      case_name,
      counts: sortedYears.map(year => yearCasesMap[case_name][year] || 0),
    }));
    const totalCountsPerYear = sortedYears.map((year, index) => {
      return casesData.reduce((total, currentCase) => total + currentCase.counts[index], 0);
    });
    return { sortedYears, casesData, totalCountsPerYear };
  }  
  const toPlot = extendData(data);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

  const chartOptions = {
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
        title: {
          display: true,
          text: 'Years',
        },
      },
      y: {
        display: true,
        title: {
          display: false,
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

  const getRandomSoftColor = () => {
    return tinycolor({ h: Math.random() * 360, s: 0.5, l: 0.7 }).toRgbString(); 
  };

  const chartData = {
    labels: toPlot.sortedYears,
    datasets: [
      ...toPlot.casesData.map((casesData, i) => ({
        label: casesData.case_name,
        data: casesData.counts,
        borderColor: "#000000",
        backgroundColor: getRandomSoftColor(),
        fill: false,
        borderWidth: 1,
      })),
      {
        label: 'Total',
        data: toPlot.totalCountsPerYear,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <>
      <Line options={chartOptions} data={chartData} />
    </>
  );
};

export default CasesRate;