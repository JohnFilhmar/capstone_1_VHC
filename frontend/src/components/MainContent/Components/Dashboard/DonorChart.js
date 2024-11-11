import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import useDropdown from '../Elements/DropdownButton';
import { useContext } from 'react';
import { colorTheme } from '../../../../App';
import tinycolor from 'tinycolor2';

const DonorChart = ({ title, annual_blood }) => {
  const [selectedTheme] = useContext(colorTheme);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
  );
  const BarOptions = {
    indexAxis: 'y',
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
      },
    },
  };
  const getColorForCount = (count) => {
    const percentage = count / Math.max(...(annual_blood?.map(blood => blood.count)));
    return tinycolor.mix('blue', 'red', percentage * 100)
                    .darken(20)
                    .setAlpha(0.7)
                    .toRgbString();
  };
  const sortedData = annual_blood?.sort((a, b) => b.count - a.count);
  const DonorData = {
    labels: sortedData?.map((don) => don.firstname.length > 5 ? `${don.firstname.substring(0,5)}...` : don.firstname),
    datasets: [
      {
        data: sortedData?.map((don) => don.count),
        backgroundColor: annual_blood?.map(blood => blood.count).map(count => getColorForCount(count)),
        // backgroundColor: 'rgba(135, 206, 235, 1)',
      },
    ],
  };

  // const { DropdownButton } = useDropdown({
  //   options: ['All Time', 'This Year', 'February', 'August', 'November'],
  //   defaultOption: 'All Time',
  //   onSelect: (selected) => {
  //     console.log(`Custom logic for ${selected}`);
  //   },
  // });

  return (
    <div className={`col-span-2 md:col-span-2 lg:col-span-1 p-2 md:p-3 lg:p-5 bg-${selectedTheme}-50 rounded-md`}>
      <div className="flex flex-row justify-between items-center p-3">
        <p className='text-base font-semibold'>{ title }</p>
        {/* <DropdownButton /> */}
      </div>
      <Bar options={BarOptions} data={DonorData}/>
    </div>
  );
}
 
export default DonorChart;