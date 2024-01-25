import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, Tooltip } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, Tooltip);

const Linechart = ({ chartData,whichclass }) => {
  const data = {
    labels: chartData.map(item => item.date), // Assuming 'year' is the label for X-axis
    datasets: [
      {
        label: 'wpm',
        data: chartData.map(item => item.wpm),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Accuracy',
        data: chartData.map(item => item.accuracy),
        borderColor: 'rgba(255,0,0,1)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <div className={whichclass}>
        <h3 style={{ textAlign: "center" }}></h3>
        <Line
          data={data}
          options={{
            plugins: {
              title: {
                display: true,
              },
              legend: {
                display: true,
                position: "bottom",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Linechart;
