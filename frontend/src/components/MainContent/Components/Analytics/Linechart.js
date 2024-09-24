import { Chart as ChartJS, CategoryScale, LinearScale,PointElement, LineElement,  Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';
import { useContext } from 'react';
import { colorTheme } from '../../../../App';
import tinycolor from 'tinycolor2';

const LineChart = () => {
  const [selectedTheme] = useContext(colorTheme);
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
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
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };
  const PatientData = {
    labels,
    datasets: [
      {
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: tinycolor(selectedTheme).toRgbString(), 
      },
      {
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: tinycolor(selectedTheme).toRgbString(),
      },
    ],
  };

  return (
    <>
    <Line options={patientChartOptions} data={PatientData}/>
    </>
  );
}
 
export default LineChart;