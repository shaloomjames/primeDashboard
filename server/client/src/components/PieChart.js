import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJs } from 'chart.js/auto';

const PieChart = ({ chartData, title }) => {
  // State to manage theme (dark or light)
  const [isDark, setIsDark] = useState(false);


  // Effect to handle theme updates and cross-tab changes
  useEffect(() => {
      // Function to check and update the theme based on localStorage
  const updateTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
  };
  
    // Initial theme update
    updateTheme();

    // Handle `storage` event for cross-tab changes
    const handleStorageChange = (event) => {
      if (event.key === 'theme') {
        updateTheme();
      }
    };

    // Set an interval to check the theme every 100ms
    const interval = setInterval(updateTheme, 100);

    // Add event listener for storage change
    window.addEventListener('storage', handleStorageChange);

    // Cleanup interval and event listener on component unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Runs only once on mount

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: isDark ? 'white' : 'black', // Change the legend font color based on theme
              },
            },
            title: {
              display: true,
              text: title,
              color: isDark ? 'white' : 'black', // Change the title font color based on theme
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
