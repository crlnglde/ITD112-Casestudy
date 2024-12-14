import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; 

import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import "../css/Add-Disaster.css";
import DstrGif from "../pic/disaster.gif"

const AddDisaster = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();  

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); 

    const [disasterType, setDisasterType] = useState(""); 
    const [date, setDate] = useState(""); 
    const [selectedBarangays, setSelectedBarangays] = useState([]);

    const [activeBarangay, setActiveBarangay] = useState(null); 
    const [errorMessage, setErrorMessage] = useState("");
    const [hasClickedNext, setHasClickedNext] = useState(false);

    const [barangayData, setBarangayData] = useState({});// To store all collected data per barangay

    const [residents, setResidents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleOpenModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleBackClick = () => {
   
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);   
        }
    };

    const validateFields = () => {
        const missingFields = [];

        if (!disasterType) missingFields.push("Disaster Type");
        if (!date) missingFields.push("Date");
        if (selectedBarangays.length === 0) missingFields.push("at least one Barangay");

        if (missingFields.length > 0) {
            setErrorMessage(`Please fill all the fields: ${missingFields.join(", ")}`);
            return false; 
        } else {
            setErrorMessage(""); // Clear error message if all fields are filled
            return true;
        }
    };

    const handleNextClick = (e) => {
        e.preventDefault(); 
        
        // On first click, set isSubmitted to true to trigger validation
        setHasClickedNext(true);

        // Check if all required fields are filled
        const isValid = validateFields();

        if (isValid) {
            setStep(2);
        }

    };

    const handleDisasterTypeChange = (e) => {
        setDisasterType(e.target.value);
        if (hasClickedNext) {
            validateFields(); 
        }
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
        if (hasClickedNext) {
            validateFields(); 
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setSelectedBarangays((prev) => [...prev, value]); // Add to selected list
        } else {
            setSelectedBarangays((prev) => prev.filter((barangay) => barangay !== value)); // Remove from selected list
        }
        if (hasClickedNext) {
            validateFields(); 
        }
    };

    const handleBarangayClick = (barangay) => {
        console.log(`Barangay clicked: ${barangay}`);
    
        if (barangay === activeBarangay) {
            setActiveBarangay(null); // Deselect the active barangay
            fetchResidents(barangay);
        } else {
            setActiveBarangay(barangay); // Set the clicked barangay as active
            fetchResidents(barangay); // Fetch residents for the active barangay
        }
    };
    
    // Load saved selections from localStorage on component mount
    useEffect(() => {
        const savedSelections = JSON.parse(localStorage.getItem('selectedBarangays')) || [];
        setSelectedBarangays(savedSelections);
    }, []);

    // Save selected barangays to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('selectedBarangays', JSON.stringify(selectedBarangays));
    }, [selectedBarangays]);

    useEffect(() => {
        if (hasClickedNext) validateFields();
    }, [disasterType, date, selectedBarangays]);

    const Step1 = (
        <form className="add-form">

            <div className="add-form-h2">
                <h2>Disaster Information</h2>
            </div>
            
            <div className="dstr-rows">

                <div className="dstr-cols1">
                    <div className="dstr-image-container">
                        <img src={DstrGif} alt="Disaster Animation" className="gif-image" />
                    
                        <div className="text-overlay">
                            <h2>Stay Prepared!</h2>
                            <p>Always be ready for the unexpected.</p>
                        </div>
                    </div>
                </div>

                <div className="dstr-cols2">

                    <div className="dstr-pop-form">
                        <div className="dstr-form-group">
                            <div className="dstr-input-group">
                                <span className="icon"><i className="fa-solid fa-hurricane"></i></span>
                                
                                <select 
                                    id="disaster-select" value={disasterType}
                                    onChange={handleDisasterTypeChange} required 
                                >

                                <option value="" disabled selected>Disaster Type</option>
                                <option value="typhoon">Typhoon</option>
                                <option value="fire-incident">Fire Incident</option>
                                <option value="earthquake">Earthquake</option>
                                <option value="flood">Flood</option>
                                <option value="landslide">Landslide</option>
                                </select>
                            </div>
                        </div>

                        <div className="dstr-form-group">
                            <div className="dstr-input-group">
                                <span className="icon"><i className="fa-regular fa-calendar-days"></i></span>
                                
                                <input 
                                    type="date" placeholder="Date" value={date}
                                    onChange={handleDateChange} required 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="dstr-pop-form1">

                        <div className="dstr-form-group">
                        
                            <div className="ig">
                                <span className="icon"><i className="fa-solid fa-location-dot"></i></span>
                                <label  htmlFor="barangay-select">Barangay (Affected Areas)</label>
                            </div>

                            <div className="bgy-input-group">
                                <div className="checkbox-group">
                                    {[
                                    'Abuno', 'Acmac-Mariano Badelles Sr.', 'Bagong Silang', 'Bonbonon', 'Bunawan', 'Buru-un', 'Dalipuga', 
                                    'Del Carmen', 'Digkilaan', 'Ditucalan', 'Dulag', 'Hinaplanon', 'Hindang', 'Kabacsanan', 'Kalilangan', 
                                    'Kiwalan', 'Lanipao', 'Luinab', 'Mahayahay', 'Mainit', 'Mandulog', 'Maria Cristina', 'Pala-o', 
                                    'Panoroganan', 'Poblacion', 'Puga-an', 'Rogongon', 'San Miguel', 'San Roque', 'Santa Elena', 
                                    'Santa Filomena', 'Santiago', 'Santo Rosario', 'Saray', 'Suarez', 'Tambacan', 'Tibanga', 'Tipanoy', 
                                    'Tomas L. Cabili (Tominobo Proper)', 'Upper Tominobo', 'Tubod', 'Ubaldo Laya', 'Upper Hinaplanon', 
                                    'Villa Verde'
                                    ].map((barangay) => (
                                    <div key={barangay} className="checkbox-item">
                                        <input
                                        type="checkbox"
                                        id={barangay.replace(/\s+/g, '-').toLowerCase()}
                                        name="barangay"
                                        value={barangay}
                                        checked={selectedBarangays.includes(barangay)} // Check if barangay is selected
                                        onChange={handleCheckboxChange} // Handle change
                                        />
                                        <label htmlFor={barangay.replace(/\s+/g, '-').toLowerCase()}>{barangay}</label>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="dstr-btn">
                        <button type="submit" className="dstr-submit-btn" onClick={handleNextClick}>
                        Next
                        </button>
                    </div>

                </div>
            </div>
        
        </form> 
    );

    const Step2 = (
        <div className="residents-table">
            <div className="barangay-buttons">
                {selectedBarangays.map((barangay, index) => (
                    <button
                        key={index}
                        className={`barangay-button ${barangay === activeBarangay ? 'active' : ''}`}
                        onClick={() => handleBarangayClick(barangay)}
                    >
                        {barangay}
                    </button>
                ))}
            </div>

            {activeBarangay && (
                <div>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : residents.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Barangay</th>
                                    <th>Purok</th>
                                    <th>Family Head</th>
                                    <th>Occupation</th>
                                    <th>Contact No.</th>
                                    <th>Family Members</th>
                                    <th>Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {residents.map((resident) => (
                                    <tr key={resident.id}>
                                        <td>{resident.Barangay}</td>
                                        <td>{resident.Purok}</td>
                                        <td>{resident.FamilyHead}</td>
                                        <td>{resident.Occupation}</td>
                                        <td>{resident.ContactNumber}</td>
                                        <td>{Array.isArray(resident.FamilyMembers) ? resident.FamilyMembers.join(", ") : "No family members"}</td>

                                        <td>
                                            <button onClick={() => handleOpenModal("add", resident)}>
                                                Answer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No residents found for {activeBarangay}.</p>
                    )}
                </div>
            )}
        </div>
     );
     
    //kulang ug active barangay na man retrieve ang residents dri
    // Fetch residents from the database sakto nani
    const fetchResidents = async (barangay) => {
        if (!barangay) {
            console.warn("No barangay provided for fetching residents.");
            return; // Early exit if no barangay is active
        }
    
        setIsLoading(true);
        setError(""); // Clear previous errors
        
        console.log(barangay);
        try {
            const q = query(collection(db, "bgy-Residents"), where("Barangay", "==", barangay));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                console.log(`No residents found for '${barangay}'`);
                setError(`No residents found for '${barangay}'`);
                return;
            }
    
            const residentsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            console.log("Residents fetched successfully:", residentsData);
            setResidents(residentsData);
        } catch (err) {
            console.error("Error fetching residents:", err);
            setError("Failed to fetch residents. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        if (activeBarangay) {
            const a= fetchResidents(activeBarangay);
            console.log(a);
        }
    }, [activeBarangay]);
    
     // Function to handle form submission in the modal
     const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            familiesInsideECs: formData.get("familiesInsideECs"),
            maleCount: Number(formData.get("maleCount")) || 0,
            femaleCount: Number(formData.get("femaleCount")) || 0,
            pregnantWomen: Number(formData.get("pregnantWomen")) || 0,
            lactatingMothers: Number(formData.get("lactatingMothers")) || 0,
            pwds: Number(formData.get("pwds")) || 0,
            soloParents: Number(formData.get("soloParents")) || 0,
            indigenousPeoples: Number(formData.get("indigenousPeoples")) || 0,
            idpsPlaceOfOrigin: formData.get("idpsPlaceOfOrigin") || "",
            fniServicesNeeded: formData.get("fniServicesNeeded") || "",
            campManagerContact: formData.get("campManagerContact") || "",
        };

        setBarangayData((prev) => ({
            ...prev,
            [activeBarangay]: data
        }));

        handleCloseModal();
    };

    const handleFinalSubmit = () => {
        const totalData = selectedBarangays.map((barangay) => ({
            barangay,
            ...barangayData[barangay]
        }));

        const disasterData = {
            disasterType,
            date,
            totalBarangays: selectedBarangays.length,
            totalData,
        };

        console.log("Disaster Data: ", disasterData);
        alert("Data saved successfully!");
    };

  return (
    <div className="dstr-dashboard">

        <div className="dash-btn">

            <button className="add-disaster" onClick={handleBackClick}>
            <i className="fa-solid fa-chevron-left"></i>
            Back
            </button>
            
        </div>

        <div className="dstr-dashboard-container">
            
            {step === 1 ? Step1 : Step2}

        </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="modal-close-btn" onClick={handleCloseModal}>
                            ×
                        </button>

                        {modalType === "add" && (
                            <div >

                                <div className="modal-h2">
                                    <h2>Resident Status</h2>
                                </div>
                                
                                <form className="add-form">
                                    <label>Family Head</label>

                                    {/*barangay-purok */}
                                    <div className="dstr-bgy-pop-form">
                                        <div className="form-group">
                                            <div className="dstr-bgy-input-group">
                                                <span className="icon"><i className="fa-solid fa-location-dot"></i></span>
                                                <input type="text" placeholder="Barangay" required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="dstr-bgy-input-group">
                                                <span className="icon"><i className="fa-solid fa-road"></i></span>
                                                <input type="text" placeholder="Purok" required />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/*fam iec-sex */}
                                    <div className="dstr-bgy-pop-form1">

                                       <div className="form-group-fie">
                                            <label>Families Inside ECs</label>
                                            <div className="dstr-bgy-input-group-fie">
                                                <label>
                                                    <input type="radio" name="familiesInsideECs" value="yes" required />
                                                Yes
                                                </label>

                                                <label>
                                                    <input type="radio" name="familiesInsideECs" value="no" required />
                                                No
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-group-sex">
                                            <label>Sex Breakdown</label>
                                            <div className="dstr-bgy-input-group-sex">
                                                <div className="sex">
                                                    <label>
                                                    Male:
                                                        <input type="number" name="maleCount" placeholder="0" min="0" required />
                                                    </label>
                                                </div>

                                                <div className="sex">
                                                    <label>
                                                    Female:
                                                        <input type="number" name="femaleCount" placeholder="0" min="0" required />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*preggy-lactating */}
                                    <div className="dstr-bgy-pop-form">
                                        <div className="form-group">
                                            <label>Number of Pregnant Women</label>
                                            <div className="dstr-bgy-input-group">
                                                <input type="number" placeholder="0" min="0" required />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Number of Lactating Mothers</label>
                                            <div className="dstr-bgy-input-group">
                                                <input type="number" placeholder="0" min="0" required />
                                            </div>
                                        </div>
                                    </div>

                                    {/*pwd-solo */}
                                    <div className="dstr-bgy-pop-form">

                                        <div className="form-group">
                                            <label>Number of PWDs</label>
                                            <div className="dstr-bgy-input-group">
                                                <input type="number" placeholder="0" min="0" required />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Number of Solo Parents</label>
                                            <div className="dstr-bgy-input-group">
                                            <input type="number" placeholder="0" min="0" required />
                                            </div>
                                        </div>
                                    </div>

                                    {/*ip-idp */}
                                    <div className="dstr-bgy-pop-form">

                                        <div className="form-group">
                                            <label>Number of Indigenous Peoples</label>
                                            <div className="dstr-bgy-input-group">
                                            <input type="number" placeholder="0" min="0" required />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>IDPs Place of Origin</label>
                                            <div className="dstr-bgy-input-group">
                                                <input type="text" placeholder="Place of Origin" required />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/*ip-idp */}
                                    <div className="dstr-bgy-pop-form">
                                        <div className="form-group">
                                            <label>FNI Services Needed</label>
                                            <div className="dstr-bgy-input-group">
                                                <textarea placeholder="Describe services needed" rows="3" required></textarea>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="dstr-bgy-pop-form">
                                        
                                        <div className="form-group">
                                            <label>Camp Manager Contact</label>
                                            <div className="dstr-bgy-input-group">
                                                
                                                <input type="tel" placeholder="Contact Number" required />
                                            </div>
                                        </div>

                                        
                                    </div>

                                    <button type="submit" className="submit-btn">
                                        Save
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
    
    </div>
  );
};

export default AddDisaster;
