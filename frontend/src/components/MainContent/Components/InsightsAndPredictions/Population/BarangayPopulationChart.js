import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useContext } from 'react';
import { colorTheme } from '../../../../../App';

const BarangayPopulationChart = ({data}) => {
  const [selectedTheme] = useContext(colorTheme);

  ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

  const chartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Population',
        data: [data.Male, data.Female],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className='flex flex-col gap-1 justify-start items-start p-2'>
      <p className={`font-semibold text-${selectedTheme}-800`}>{data.Barangay}= {data["Total Population"]}</p>
      <Pie options={chartOptions} data={chartData} />
    </div>
  );
};

export default BarangayPopulationChart;
