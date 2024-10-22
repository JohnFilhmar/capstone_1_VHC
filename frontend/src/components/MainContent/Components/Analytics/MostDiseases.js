import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import tinycolor from 'tinycolor2';

const MostDiseases = ({ data }) => {

  const labels = data.map(item => item.case_name.length > 8 ? item.case_name.substring(0, 8) + "..." : item.case_name);
  const casesCounts = data.map(item => item.case_count);
  const maxCount = Math.max(...casesCounts);

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
        borderColor: "#000000",
        backgroundColor: casesCounts.map(count => getColorForCount(count)),
        borderWidth: 2
      }
    ],
  };

  return (
    <Bar options={patientChartOptions} data={PatientData}/>
  );
}

export default MostDiseases;
