import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import tinycolor from 'tinycolor2';

const BarangayCasesRate = ({ dataset }) => {

  let data = [];

  data = dataset.length > 0 ? dataset : [];

  const maxCount = Math.max(20, ...data.map(item => item.cases_count));
  const labels = data.map(item => item.barangay);
  const casesCounts = data.map(item => item.cases_count);
  
  const getColorForCount = (count) => {
    const percentage = count / maxCount;
    return tinycolor.mix('blue', 'red', percentage * 100)
                    .darken(20)
                    .setAlpha(0.7)
                    .toRgbString();
  };  

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
  );

  const patientChartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: false,
      tooltip: {
        enabled: true,
        callbacks: {
          title: function(tooltipItems) {
            if (tooltipItems.length) {
              const index = tooltipItems[0].dataIndex;
              return data[index].case_name;
            }
            return '';
          }
        }
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
  };

  const PatientData = {
    labels,
    datasets: [
      {
        data: casesCounts,
        backgroundColor: casesCounts.map(count => getColorForCount(count))
      }
    ],
  };

  return (
    <Bar options={patientChartOptions} data={PatientData}/>
  );
};

export default BarangayCasesRate;