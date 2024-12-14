import React, { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom'; 

import Barc from './visualizations/Bar-ch'
import Piec from './visualizations/Pie-ch'
import Map from './visualizations/Iligan'
import "../css/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isUploading, setIsUploading] = useState(false); 
  const [file, setFile] = useState(null);

  const handleAddDisaster = () => {
    navigate("/dashboard/add-disaster");
  };

  const handleUploadCsvClick = () => {
    setModalType("upload");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    if (file) {
      setIsUploading(true);
      // Simulate file upload process
      setTimeout(() => {
        setIsUploading(false);
        setIsModalOpen(false);
        alert("File uploaded successfully!");
      }, 2000); // Simulate a delay of 2 seconds
    }
  };
  
  return (
    <div className="dashboard">

      <div className="dash-btn">

        <button className="add-disaster" onClick={handleAddDisaster}>
          <i className="fa-solid fa-file-circle-plus"></i>
          Add Disaster
        </button>

        <button className="upload-csv" onClick={handleUploadCsvClick}>
          <i className="fa-solid fa-upload"></i>
          Upload CSV
        </button>

      </div>

      <div className="dashboard-container">
        
        <div className="ch1">
          <Barc/>
        </div>

        <div className="ch2">
          <Map/>
          <Piec/>
        </div>
            
      </div>

      {isModalOpen && modalType === "upload" && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>
              ×
            </button>
            <h2 className="modal-title">Upload Disaster CSV</h2>
            <form onSubmit={handleFileUpload} className="upload-form">
              <input type="file" accept=".csv" onChange={handleFileChange} />
              <button type="submit" className="submit-btn" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default Dashboard;
