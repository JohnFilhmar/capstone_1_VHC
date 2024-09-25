import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useContext, useEffect, useState } from 'react';
import { colorTheme } from '../../../../App';
import tinycolor from 'tinycolor2';
import useDropdown from '../Elements/DropdownButton';

const PatientChart = ({ title, annual_patients, monthly_patients, daily_patients }) => {
  const [selectedTheme] = useContext(colorTheme);

  const periods = {
    yearly: annual_patients?.map(item => item.year) || [],
    monthly: monthly_patients?.map(item => item.month) || [],
    daily: daily_patients?.map(item => item.day_name) || [],
  };

  const [labels, setLabels] = useState(periods.yearly);
  const [chartData, setChartData] = useState([]);

  // Update the chart data based on the selected period
  useEffect(() => {
    const selectedPeriod = labels === periods.yearly
      ? annual_patients?.map(item => item.patient_count)
      : labels === periods.monthly
      ? monthly_patients?.map(item => item.patient_count)
      : daily_patients?.map(item => item.patient_count);

    setChartData(selectedPeriod);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels, annual_patients, monthly_patients, daily_patients]);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

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
        display: true,
        title: {
          display: true,
          text: 'Patient Count',
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

  const PatientData = {
    labels,
    datasets: [
      {
        data: chartData,
        backgroundColor: tinycolor(selectedTheme).toRgbString(),
        borderColor: tinycolor(selectedTheme).toRgbString(),
        fill: false,
      },
    ],
  };

  const { DropdownButton } = useDropdown({
    options: ['Yearly', 'Monthly', 'Daily'],
    defaultOption: 'Yearly',
    onSelect: (selected) => {
      selected === 'Yearly' ? setLabels(periods.yearly)
      : selected === 'Monthly' ? setLabels(periods.monthly)
      : setLabels(periods.daily);
    },
  });

  return (
    <div className={`col-span-2 md:col-span-2 lg:col-span-1 p-2 md:p-3 lg:p-5 bg-${selectedTheme}-50 rounded-md`}>
      <div className="flex flex-row justify-between items-center p-3">
        <p className='text-base font-semibold'>{ title }</p>
        <DropdownButton />
      </div>
      <Line options={patientChartOptions} data={PatientData} />
    </div>
  );
};

export default PatientChart;