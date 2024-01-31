import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Legend, Tooltip } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Legend, Tooltip);

const Barchart = ({ chartData, whichclass,title ,label}) => {
  const data = {
    labels: chartData.map(item => item.date),
    datasets: [
      {
        label: label,
        data: chartData.map(item => item.data),
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    //   {
    //     label: 'Accuracy',
    //     data: chartData.map(item => item.accuracy),
    //     backgroundColor: 'rgba(255, 0, 0, 0.2)',
    //     borderColor: 'rgba(255, 0, 0, 1)',
    //     borderWidth: 1,
    //   },
    ],
  };

  return (
    <div>
      <div className={whichclass}>
        <h3 style={{ textAlign: "center",color:"wheat",'fontSize':"24px" }}>{title}</h3>
        <Bar
          data={data}
          options={{
            scales: {
              x: {
                grid: {
                  color: 'silver',
                },
                ticks: {
                  color: 'silver',
                },
              },
              y: {
                grid: {
                  color: 'silver',
                },
                ticks: {
                  color: 'silver',
                },
              },
            },
            plugins: {
              title: {
                display: true,
              },
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  color: 'silver',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Barchart;
