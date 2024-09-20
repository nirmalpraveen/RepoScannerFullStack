import React, { useRef, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import Chart from 'chart.js/auto';

const ChartComponent = ({ techUsed }) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: techUsed.map((tech) => tech),
    datasets: [
      {
        data: techUsed.map(() => Math.floor(Math.random() * 10 + 1)), // Dummy data for tech usage
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40"
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40"
        ],
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current) {
      console.log("Chart rendered!");
    }
  }, [techUsed]);

  return <Pie ref={chartRef} data={chartData} />;
};

export default ChartComponent;
