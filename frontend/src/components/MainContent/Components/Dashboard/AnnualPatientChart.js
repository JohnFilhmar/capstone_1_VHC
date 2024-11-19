import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useContext, useEffect, useRef, useState } from "react";
import { colorTheme } from "../../../../App";
import tinycolor from "tinycolor2";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { Packer } from "docx";

const AnnualPatientChart = ({ title, annual_patients }) => {
  const [selectedTheme] = useContext(colorTheme);

  const [labels, setLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const chartRef = useRef(null);

  function predictNextValues(data, valuesToPredict = 2) {
    const n = data.length;
    const avgIndex = (n - 1) / 2;
    const avgData = data.reduce((sum, count) => sum + count, 0) / n;
    let numerator = 0;
    let denominator = 0;
    data.forEach((count, i) => {
      numerator += (i - avgIndex) * (count - avgData);
      denominator += Math.pow(i - avgIndex, 2);
    });
    const slope = numerator / denominator;
    const intercept = avgData - slope * avgIndex;
    const predictions = [];
    for (let i = n; i < n + valuesToPredict; i++) {
      const predictedCount = slope * i + intercept;
      predictions.push(Math.round(predictedCount));
    }
    return predictions;
  }

  useEffect(() => {
    const years = annual_patients?.map((item) => item.year) || [];
    const requiredYears = 4;
    if (years.length < requiredYears) {
      const lastYear = Number(years[0]) - 1;
      const missingLength = requiredYears - years.length;
      const missingYears = Array.from({ length: missingLength }, (_, index) => {
        return lastYear - index;
      });
      years.push(...[1, 2].map((i) => Number(years[years.length - 1]) + i));
      setLabels([...missingYears.sort(), ...years]);
    }
    setChartData(() => {
      const patientCounts =
        annual_patients?.map((patient) => patient.patient_count) || [];
      const zerosNeeded = 4 - patientCounts?.length;
      const zeroArray = (zerosNeeded && Array(zerosNeeded).fill(0)) || [];
      const paddedData = [...zeroArray, ...patientCounts];
      setPredictedData([...predictNextValues(paddedData, 2)]);
      return paddedData;
    });
  }, [annual_patients]);

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
        display: true,
        title: {
          display: false, // display side title of Y axis
          text: "Patient Count",
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

  const PatientData = {
    labels,
    datasets: [
      {
        label: "Patient Count",
        data: [...chartData, ...predictedData],
        backgroundColor: getRandomSoftColor(),
        borderColor: "#000000",
        fill: false,
        borderWidth: 2,
        segment: {
          borderDash: (ctx) =>
            ctx.p0.parsed.x >= chartData.length - 1 ? [5, 5] : [],
        },
      },
    ],
  };

  const handleExport = async () => {
    const chartInstance = chartRef.current;
    const chartCanvas = chartInstance?.toBase64Image();
    if (chartCanvas) {
      const imageModule = {
        getImage: () => {
          return fetch(chartCanvas)
            .then((res) => res.blob())
            .then((blob) => {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsArrayBuffer(blob);
              });
            });
        },
        getSize: () => [6, 4],
      };
      // const res = await fetch('/chart.docx');
      // const cont = await res.arrayBuffer();
      imageModule.getImage().then((imageData) => {
        Packer.toBlob().then((docBlob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const arrayBuffer = reader.result;
            const zip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true,
            });
            const content = { image: imageData };
            doc.setData(content);
            doc.render();
            const out = doc.getZip().generate({
              type: "blob",
              mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
    
            saveAs(out, "chart_report.docx");
          };
          reader.readAsArrayBuffer(docBlob);
        });
      });
    }
  };  

  return (
    <div
      className={`col-span-2 md:col-span-2 lg:col-span-1 p-2 md:p-3 lg:p-5 bg-${selectedTheme}-50 rounded-md`}
    >
      <div className="flex flex-row justify-between items-center p-3">
        <p className="text-base font-semibold">{title}</p>
      </div>
      <Line ref={chartRef} options={patientChartOptions} data={PatientData} />
      {/* <button onClick={() => handleExport()}>Export</button> */}
    </div>
  );
};

export default AnnualPatientChart;
