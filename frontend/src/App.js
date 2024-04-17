import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';

function Application() {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/data');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData.map(item => ({...item,
        machine_status: item.machine_status !== null ? item.machine_status : 'missing',
        vibration: item.vibration !== null ? item.vibration : 'missing'
    })));
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const chartData = {
    labels: data.map(item => item.ts),
    datasets: [
        {
            label: 'Vibration Levels',
            data: data.map(item => item.vibration === 'missing' ? NaN : item.vibration),
            backgroundColor: data.map(item => {
                if (item.machine_status === 0) return 'yellow';
                else if (item.machine_status === 1) return 'green';
                else return 'red'; // Handle missing data
            }),
            borderColor: 'black',
            borderWidth: 10,
        }
    ],
};

const options = {
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'minute'
            }
        },
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};

    return ( 

      <div>
        <Bar data={chartData} options={options} />
      </div>

     );
}

export default Application;