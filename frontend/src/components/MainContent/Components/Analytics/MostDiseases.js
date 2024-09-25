import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useContext } from 'react';
import { colorTheme } from '../../../../App';
import tinycolor from 'tinycolor2';

const MostDiseases = ({ data }) => {
  const [selectedTheme] = useContext(colorTheme);

  const labels = data.map(item => item.illness.length > 8 ? item.illness.substring(0, 8) + "..." : item.illness);
  const illnessCounts = data.map(item => item.count);

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
              return data[index].illness;
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
        data: illnessCounts,
        backgroundColor: tinycolor(selectedTheme).toRgbString(), 
      }
    ],
  };

  return (
    <Bar options={patientChartOptions} data={PatientData}/>
  );
}

export default MostDiseases;