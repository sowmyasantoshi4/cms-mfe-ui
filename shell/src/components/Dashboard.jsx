import { useSelector, useDispatch } from 'react-redux';
import { loadAllStaff, loadBranches, loadDesignations, loadDistricts, loadStates, loadStatus } from '../restApis/ApiOptions'
import Alert from 'react-bootstrap/Alert';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Card, Col, Container, Form, Row, FloatingLabel } from 'react-bootstrap';
import { getPackagesList } from '../restApis/ApiPackage';

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
      ticks: {
        stepSize: 1,  // Y-axis interval set to 1
      },
    },
  },
};


const Dashboard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);  // Access auth state from global store
const [loading, setLoading] = useState(false);

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

  // Function to extract only specific keys from the JSON response
  const extractKeysFromList = (jsonList, keysToExtract) => {
    return jsonList.map((jsonData) => {
      return Object.keys(jsonData).reduce((newObj, key) => {
        if (keysToExtract.includes(key)) {
          newObj[key] = jsonData[key];
        }
        return newObj;
      }, {});
    });
  };

  // Function to process the package data and extract status counts
  const extractStatusData = (packages) => {
    const statusMap = {};

    packages.forEach((pkg) => {
      const { currentStatusId, currentStatusName } = pkg;

      if (statusMap[currentStatusId]) {
        statusMap[currentStatusId].count += 1;  // Increment count for existing status
      } else {
        statusMap[currentStatusId] = { currentStatusName, count: 1 };  // Initialize new status with count 1
      }
    });

    return Object.keys(statusMap).map((statusId) => ({
      currentStatusId: parseInt(statusId),
      currentStatusName: statusMap[statusId].currentStatusName,
      count: statusMap[statusId].count,
    }));
  };


  useEffect(() => {
    // Simulating fetching JSON data

    //ajax call for loading report
    getPackagesList()
      .then((response) => {
        if (!(response instanceof Error)) {
          const keysToExtract = ["currentStatusId", "currentStatusName", "referenceNo", "packageId"];
          const extractedDataList = extractKeysFromList(response, keysToExtract);
          // console.log("extractedDataList",extractedDataList)
          const statusData = extractStatusData(extractedDataList);
          // console.log("statusData",statusData);

           // Prepare data for the chart
           setChartData({
            // labels: ['Pending', 'In Transit', 'Parcel Received at Destination', 'Returned', 'Cancelled', 'Delivered'],
            labels: statusData.map((item) => item.currentStatusName),  // Status names as labels
            datasets: [
              {
                label: 'Package Count',
                data: statusData.map((item) => item.count),  // Counts as data points
                backgroundColor: statusData.map((_, index) => {
                  // Generate a different color for each bar (random colors for illustration)
                  return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
                }),
                borderColor: statusData.map((_, index) => {
                  // Same logic for border color
                  return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
                }),
                borderWidth: 1,
              },
            ],
          });
          
          setLoading(false);  // Stop loading indicator
        
      
    /*
    setTimeout(() => {
      //setShowReport(true);
      setLoading(false);
      
      getReportTx();
    
      }, 100);
      */
     /*
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
        */

      }
    })
    .catch((err) => {
      console.error("Failed to fetch packages:", err);
      setLoading(false);  // Stop loading indicator on error
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

export default Dashboard