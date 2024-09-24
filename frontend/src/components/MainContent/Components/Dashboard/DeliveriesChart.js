import { Chart as ChartJS, CategoryScale, LinearScale,PointElement, LineElement,  Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useContext, useEffect, useState } from 'react';
import { colorTheme } from '../../../../App';
import tinycolor from 'tinycolor2';

const DeliveriesChart = ({ title, data }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    setLabels(data.delivery_year);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
        data: data.delivery_count,
        backgroundColor: tinycolor(selectedTheme).toRgbString(), 
      }
    ],
  };

  return (
    <div className={`col-span-2 p-2 md:p-3 lg:p-5 bg-${selectedTheme}-50 rounded-md`}>
      <div className="flex flex-row justify-between items-center p-3">
        <p className='text-base font-semibold'>{ title }</p>
      </div>
      <Line options={patientChartOptions} data={PatientData}/>
    </div>
  );
}
 
export default DeliveriesChart;