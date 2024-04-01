import './insuranceInvoice.css'
import Drawer from '../../../components/Drawer/Drawer'
import Navbar from '../../../components/Navbar/Navbar'
import InvoiceTable from '../../../components/Tables/InvoiceTable'
import Error from '../../../components/Errors/Error'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import AddNewInvoiceItemModel from '../../../components/Model/AddNewInvoiceItemModel'

const InsuranceInvoice = () => {
    const errorType = [
        "Job Number is required",
        "Update Successfull",
        "Delete Successfull",
        "This job number having not any Estimate or Supplimentry",
      ]
      const [error, setError] = useState([]);
      const [erroVisible, setErrorVisible] = useState("none");
      const [backgroundColor, setBackgroundColor] = useState("#fae0e4")
      const [borderColor, setBorderColor] = useState("#ff0a54")
      const [fontColor, setFontColor] = useState("#ff0a54")
      const [iconColor, setIconColor] = useState("#ff0a54")
    
    const [jobID, setJobID] = useState(''); 

    const [disable, setDisable] = useState();
    const [accidentDate, setAccidentDate] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [vehicleName, setVehicleName] = useState('');
    const [vehicleMake, setVehicleMake] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerMobile, setCustomerMobile] = useState('');
    const [insuranceName, setInsuranceName] = useState('');

    const [replacementTableData, setReplacementTableData] = useState([]);
    const [refixedTableData, setRefixedTableData] = useState([]);
    const [repairTableData, setRepairTableData] = useState([]);
    const [paintTableData, setPaintTableData] = useState([]);

    const [invoiceID, setInvoiceID] = useState('');
    const [selectedInvoiceID, setSelectedInvoiceID] = useState('');
    const [insurancePrice, setInsurancePrice] = useState(0);

    const jwtToken = localStorage.getItem("jwtToken");
    const navigate = useNavigate();

    const [replacementPopup, setReplacementPopup] = useState(false);
    const [refixedPopup, setRefixedPopup] = useState(false);
    const [repairPopup, setRepairPopup] = useState(false);
    const [paintPopup, setPaintPopup] = useState(false);

    useEffect(()=>{
        if(!jwtToken){
            navigate("/")
        }
    },[jwtToken])
    const handleSearchJob= async()=>{
        if(!jobID){
            setErrorVisible("block");
            setError(errorType[0]);
            setBackgroundColor("#fae0e4");
            setBorderColor("#ff0a54");
            setFontColor("#ff0a54");
            setIconColor("#ff0a54");

            setTimeout(()=>{
            setErrorVisible("none");
            },2000);
        }else{
            try {
                // Fetch job details
                const jobDetails = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/estimate/getEstimateJobDetails/${jobID}`);
                const result = jobDetails.data[0];
                setAccidentDate(result.accidentDate);
                setVehicleNo(result.vehicleNo);
                setVehicleName(result.vehicleModel);
                setVehicleMake(result.vehicleMake);
                setCustomerName(result.customerName);
                setCustomerMobile(result.customerMobile);
                setInsuranceName(result.insuranceName);

                setDisable("block");
                fetchTablesData();
            } catch (error) {
                setErrorVisible("block");
                setError(errorType[3]);
                setBackgroundColor("#fae0e4");
                setBorderColor("#ff0a54");
                setFontColor("#ff0a54");
                setIconColor("#ff0a54");

                setTimeout(()=>{
                    setErrorVisible("none");
                },2000);
            }
        }
    }
    // const fetchTablesData= async()=>{
    //     //Fetch table details
    //     const tablesDetails = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/getInvoice/${jobID}`);
    //     const estimateDetails = tablesDetails.data;

    //     const replacementData = estimateDetails.filter((item) => item.tableCategory === "Replacement");
    //     const refixedData = estimateDetails.filter((item) => item.tableCategory === "Refixed");
    //     const repairData = estimateDetails.filter((item) => item.tableCategory === "Repair");
    //     const paintData = estimateDetails.filter((item) => item.tableCategory === "Paint");

    //     setReplacementTableData(replacementData);
    //     setRefixedTableData(refixedData);
    //     setRepairTableData(repairData);
    //     setPaintTableData(paintData);
        
    // }
    const fetchTablesData = async () => {
        try {
            // Fetch table details
            const tablesDetails = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/getInvoice/${jobID}`);
            const estimateDetails = tablesDetails.data;
    
            const replacementData = estimateDetails.filter((item) => item.tableCategory === "Replacement");
            const refixedData = estimateDetails.filter((item) => item.tableCategory === "Refixed");
            const repairData = estimateDetails.filter((item) => item.tableCategory === "Repair");
            const paintData = estimateDetails.filter((item) => item.tableCategory === "Paint");
    
            setReplacementTableData(replacementData);
            setRefixedTableData(refixedData);
            setRepairTableData(repairData);
            setPaintTableData(paintData);
        } catch (error) {
            console.error("Error fetching tables data:", error.message);
            // Handle the error as needed
        }
    };
    useEffect(() => {
        fetchTablesData();
    }, [replacementPopup, refixedPopup, repairPopup, paintPopup, selectedInvoiceID]);
    

    //--------------------------------------------------------------------Insurance price editing--------------------------------------------------------------
    const insuranceEditHandler=(selectedInvoiceID)=>{
        setSelectedInvoiceID(selectedInvoiceID);
    }
    const handleInsurancePrice = (value,invoiceID)=>{
        setInsurancePrice(value);
        setReplacementTableData(updateInsurancePrice(value, invoiceID, replacementTableData));
        setRefixedTableData(updateInsurancePrice(value, invoiceID, refixedTableData));
        setRepairTableData(updateInsurancePrice(value, invoiceID, repairTableData));
        setPaintTableData(updateInsurancePrice(value, invoiceID, paintTableData));
    }
    const insuranceUpdateHandle=async()=>{
        const formData = {insurancePrice}
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/updateInvoice/${selectedInvoiceID}`, formData)
        .then((res)=>{
            setErrorVisible("block");
            setError(errorType[1]);
            setBackgroundColor("#C6F6D5");
            setBorderColor("#2F855A");
            setFontColor("#2F855A");
            setIconColor("#2F855A");
            setTimeout(()=>{
                setErrorVisible("none");
            },1500)

            setSelectedInvoiceID('');
            //Displaying new tables data
            fetchTablesData();
        }).catch((err)=>{
            setErrorVisible("block");
            setError(err.message);
            setBackgroundColor("#fae0e4");
            setBorderColor("#ff0a54");
            setFontColor("#ff0a54");
            setIconColor("#ff0a54");

            setTimeout(()=>{
                setErrorVisible("none");
            },2000);
        })
    }
    const updateInsurancePrice = (value, invoiceID, array) => {
        // Find the index of the object with the specified estimateID
        const indexToUpdate = array.findIndex(item => item.invoiceID === invoiceID);
    
        // If the index is found, update the insurancePrice with the specified value
        if (indexToUpdate !== -1) {
            array[indexToUpdate].insurancePrice = value;
        }
    
        return array;
    }

    //------------------------------------------------Delete Inovice item-------------------------------------------------------------------------------
    const insuranceDeleteHandler=async(selectedInvoiceID)=>{
        setSelectedInvoiceID(selectedInvoiceID);
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/deleteItem/${selectedInvoiceID}`)
        .then((res)=>{
            console.log("Deletion Success");
        }).catch((err)=>{
            alert(err.message)
        })
    }
  return (
    <div className='createEstimateContainer'>
        <Drawer/>
        <div className="estimateContainer">
            <Navbar  text="Invoice / With-Insurance"/>
            <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/>
            <div className="estimateBlock">
                <div className="EstimatSearchJob">
                    <label htmlFor="" style={{fontSize:"18px"}}>Seach Job No:</label>
                    <input type="text" placeholder='Enter Job No' style={{width:"15rem", fontSize:"16px", fontWeight:"bold", color:"red"}} onChange={(e)=>{
                        setJobID(e.target.value)
                    }}/>
                    <button className='searchBtn' style={{padding:"6px", width:"5rem", textAlign:"center"}} onClick={handleSearchJob}>Seach</button>
                </div>
                <div className="estimateSheet">
                    <h2 className='estimateTitle' style={{backgroundColor:"#926c15"}}>Invoice</h2>
                    <h2 className='estimateTitles'>Job Details</h2>
                    <div className="jobDetailsContainer">
                        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                            <div>
                                <div>
                                    <label htmlFor="">Accident Date:</label><br />
                                    <input type="text" className='estimateInput' value={accidentDate} disabled/>
                                </div>
                                <div>
                                    <label htmlFor="">Vehicle No:</label><br />
                                    <input type="text" className='estimateInput' value={vehicleNo} disabled/>
                                </div>
                                <div>
                                    <label htmlFor="">Vehicle Name:</label><br />
                                    <input type="text" className='estimateInput' value={vehicleMake+' '+vehicleName} disabled/>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="">Customer Name:</label><br />
                                    <input type="text" className='estimateInput' value={customerName} disabled/>
                                </div>
                                <div>
                                    <label htmlFor="">Contact No:</label><br />
                                    <input type="text" className='estimateInput' value={customerMobile} disabled/>
                                </div>
                                <div>
                                    <label htmlFor="">Insurance Company:</label><br />
                                    <input type="text" className='estimateInput' value={insuranceName} disabled/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Create product model pop up window */}
                    <div className="addNewProductItem" style={{display:"flex", alignItems: 'end', gap:"1rem"}}>
                        <h2 className='estimateTitles'>Replacement Items</h2>
                        <div style={{color: "#006d77"}} onClick={()=>{
                            if(jobID != 0){
                                setReplacementPopup(true)
                            }
                        }}><FiberNewIcon/></div>
                        {replacementPopup &&(
                            <AddNewInvoiceItemModel 
                                closeItemModel={setReplacementPopup} 
                                modelName='Add New Replacement Item'
                                typeOptionDisable = 'block'
                                tableCategory = "Replacement"
                                invoiceJobID = {jobID}
                            />
                        )}
                    </div>
                    <InvoiceTable
                        tableData = {replacementTableData || []} 
                        tableWidth="100%"
                        view = "none"
                        rowColor = "#926c15"
                        editingRow = {selectedInvoiceID}
                        handleEdit={(invoiceID) => insuranceEditHandler(invoiceID)}
                        handleDelete = {(invoiceID)=>insuranceDeleteHandler(invoiceID)}
                        handleUpdate = {(invoiceID)=> insuranceUpdateHandle(invoiceID)}
                        handleInsurancePrice={handleInsurancePrice}
                        reportView = "none"                      
                    />
                    <div className="addNewProductItem" style={{display:"flex", alignItems: 'end', gap:"1rem"}}>
                        <h2 className='estimateTitles'>Remove and Refixed Items</h2>
                        <div style={{color: "#006d77"}} onClick={()=>{
                            if(jobID != 0){
                                setRefixedPopup(true)
                            }
                        }}><FiberNewIcon/></div>
                        {refixedPopup &&(
                            <AddNewInvoiceItemModel 
                                closeItemModel={setRefixedPopup} 
                                modelName='Add New Remove & Refixed Item'
                                typeOptionDisable = 'none'
                                tableCategory = "Refixed"
                                invoiceJobID = {jobID}
                            />
                        )}
                    </div>
                    <InvoiceTable
                        tableData = {refixedTableData || []} 
                        display="none"
                        view = "none"
                        rowColor = "#926c15"
                        editingRow = {selectedInvoiceID}
                        handleEdit={(invoiceID) => insuranceEditHandler(invoiceID)}
                        handleDelete = {(invoiceID)=>insuranceDeleteHandler(invoiceID)}
                        handleUpdate = {(invoiceID)=> insuranceUpdateHandle(invoiceID)}
                        handleInsurancePrice={handleInsurancePrice}
                        reportView = "none" 
                    />
                    <div className="addNewProductItem" style={{display:"flex", alignItems: 'end', gap:"1rem"}}>
                        <h2 className='estimateTitles'>Repair Items</h2>
                         <div style={{color: "#006d77"}} onClick={()=>{
                            if(jobID != 0){
                                setRepairPopup(true)
                            }
                        }}><FiberNewIcon/></div>
                        {repairPopup &&(
                            <AddNewInvoiceItemModel 
                                closeItemModel={setRepairPopup} 
                                modelName='Add New Repair Item'
                                typeOptionDisable = 'none'
                                tableCategory = "Repair"
                                invoiceJobID = {jobID}
                            />
                        )}
                    </div>
                    <InvoiceTable
                        tableData = {repairTableData || []}  
                        display="none"
                        view = "none"
                        rowColor = "#926c15"
                        editingRow = {selectedInvoiceID}
                        handleEdit={(invoiceID) => insuranceEditHandler(invoiceID)}
                        handleDelete = {(invoiceID)=>insuranceDeleteHandler(invoiceID)}
                        handleUpdate = {(invoiceID)=> insuranceUpdateHandle(invoiceID)}
                        handleInsurancePrice={handleInsurancePrice}
                        reportView = "none" 
                    />
                    <div className="addNewProductItem" style={{display:"flex", alignItems: 'end', gap:"1rem"}}>
                        <h2 className='estimateTitles'>Paint Items</h2>
                         <div style={{color: "#006d77"}} onClick={()=>{
                            if(jobID != 0){
                                setPaintPopup(true)
                            }
                        }}><FiberNewIcon/></div>
                        {paintPopup &&(
                            <AddNewInvoiceItemModel 
                                closeItemModel={setPaintPopup} 
                                modelName='Add New Paint Item'
                                typeOptionDisable = 'none'
                                tableCategory = "Paint"
                                invoiceJobID = {jobID}
                            />
                        )}
                    </div>
                    <InvoiceTable
                        tableData = {paintTableData || []}  
                        display="none"
                        view = "none"
                        rowColor = "#926c15"
                        editingRow = {selectedInvoiceID}
                        handleEdit={(invoiceID) => insuranceEditHandler(invoiceID)}
                        handleDelete = {(invoiceID)=>insuranceDeleteHandler(invoiceID)}
                        handleUpdate = {(invoiceID)=> insuranceUpdateHandle(invoiceID)}
                        handleInsurancePrice={handleInsurancePrice}
                        reportView = "none" 
                    />
                </div>
                <div className="amountContainer" style={{display:disable}}>
                     <div className="btnSection">
                        <Link to="/new-job"><button className='invoiceBackBtn'>Back</button></Link>
                        <Link to={`/invoice/insurance/invoiceReport/${jobID}`}><button className='previewReportBtn'>Preview Invoice</button></Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InsuranceInvoice

