import { useSelector, useDispatch } from 'react-redux';
import { loadAllStaff, loadBranches, loadDesignations, loadDistricts, loadStates, loadStatus } from '../restApis/ApiOptions'
import Alert from 'react-bootstrap/Alert';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Card, Col, Container, Form, Row, FloatingLabel } from 'react-bootstrap';

// Registering the required components
ChartJS.register(
  CategoryScale,    // x-axis
  LinearScale,      // y-axis (for linear scale)
  BarElement,       // Bar chart element
  Title,            // Title plugin
  Tooltip,          // Tooltip plugin
  Legend            // Legend plugin
);

// Registering the components required for the chart
ChartJS.register(
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Example data
const data = {
  labels: ['Pending', 'In Transit', 'Delivered', 'Returned', 'Cancelled'],  // X-axis labels
  datasets: [
    {
      label: 'Package Count',  // Y-axis label
      data: [5, 8, 12, 3, 2],  // Count of occurrences for each status
      backgroundColor: 'rgba(75, 192, 192, 0.6)',  // Color of the bars
      borderColor: 'rgba(75, 192, 192, 1)',  // Border color of the bars
      borderWidth: 1,  // Border width
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Package Status Count',
    },
    legend: {
      position: 'top',
    },
  },
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};


const Welcome = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);  // Access auth state from global store

  useEffect(() => {
    try {
      loadStates();
      loadBranches();
      loadDistricts();
      loadDesignations();
      loadAllStaff();
    }catch(err){
      console.log("unable to load options : ",err)
    }
  }, [])

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Simulating fetching JSON data
    const jsonData = [
      { "status": "Pending", "count": 5 },
      { "status": "In Transit", "count": 8 },
      { "status": "Delivered", "count": 12 },
      { "status": "Returned", "count": 3 },
      { "status": "Cancelled", "count": 2 }
    ];

    // Dynamically build the dataset
    const labels = jsonData.map(item => item.status);  // X-axis labels
    const dataValues = jsonData.map(item => item.count);  // Y-axis values

    // Generate different colors for each bar
    const backgroundColors = jsonData.map(() => {
      // Generate random color
      return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
    });

    const borderColors = backgroundColors.map(color => {
      return color.replace('0.6', '1');  // Set the border color to fully opaque
    });

    const newDataset = {
      label: 'Package Count',  // Y-axis label
      data: dataValues,  // Y-axis data
      backgroundColor: backgroundColors,  // Dynamic background colors
      borderColor: borderColors,  // Dynamic border colors
      borderWidth: 1,  // Border width
    };
    // Set the dynamic data to the state
    setChartData({
      labels,  // X-axis
      datasets: [newDataset],  // Y-axis
    });
  }, []);  // Runs once when the component mounts

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Package Status Count',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // console.log("STORE=",isAuthenticated, user)
  return (
    <Container>
      <Row>
        <Col xs={12} md={12}>
          <Card className='border-0 shadow-lg'>
            <Card.Header className='bg-info'>
              <Row>
                <Col xs={12} md={12}>
                  DASHBOARD
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {/* <Alert key="light" variant="light">
                <h3>Welcome !</h3>
                Courier Mangement System ( CMS )
              </Alert> */}
              <div>
                <Bar data={chartData} options={options} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Welcome