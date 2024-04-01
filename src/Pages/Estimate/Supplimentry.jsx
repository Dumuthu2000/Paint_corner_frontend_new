import Drawer from '../../components/Drawer/Drawer'
import Navbar from '../../components/Navbar/Navbar'
import Error from '../../components/Errors/Error'
import Select from 'react-select';
import EstimateTable from '../../components/Tables/EstimateTable';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ProductModel from '../../components/Model/ProductModel';

const Supplimentry = () => {
  const navigate = useNavigate();
  //Errors
  const errorType = [
    "Job Number is required", 
    "Enter valid mobile number",
    "Estimate is created successfully", 
    "Replacement item is required",
    "Replacement item or Price is required", 
    "Price should be a number",
    "At least one item is required",
    "Not Estimate for this Job Number",
  ]
  const [error, setError] = useState([]);
  const [erroVisible, setErrorVisible] = useState("none");
  const [backgroundColor, setBackgroundColor] = useState("#fae0e4")
  const [borderColor, setBorderColor] = useState("#ff0a54")
  const [fontColor, setFontColor] = useState("#ff0a54")
  const [iconColor, setIconColor] = useState("#ff0a54")

  const [jobID, setJobNo] = useState('');
  const [disable, setDisable] = useState(false)

  //Details of selected job
  const [accidentDate, setAccidentDate] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [vehicleMake, setVehicleMake] = useState('');
  const [customerMobile, setCustomerMobile] = useState("");
  const [insuranceName, setInsuranceName] = useState("");
  //Items table visibility
  const [visible, setVisible] = useState("none")

  //Items Details
  const [itemOption, setItemOption] = useState([]);

  //Replacement Items table handling
  const [btnVisible, setBtnVisible] = useState("block");
  const [replacementUpdateBtnVisible, setReplacementUpdateBtnVisible] = useState("none");
  const [refixedUpdateBtnVisible, setRefixedUpdateBtnVisible] = useState("none");
  const [repairUpdateBtnVisible, setRepairUpdateBtnVisible] = useState("none");
  const [paintUpdateBtnVisible, setPaintUpdateBtnVisible] = useState("none");
  
  const [replacementAddVisible, setReplacementAddVisible] = useState("block");
  const [refixedAddVisible, setRefixedAddVisible] = useState("block");
  const [repairAddVisible, setRepairAddVisible] = useState("block");
  const [paintAddVisible, setPaintAddVisible] = useState("block");

  // State array to store Replacement Table Data
  const [selectedOption, setSelectedOption] = useState(null);
  const [replacementPrice, setReplacementPrice] = useState(0);
  const [replacementInputValue, setReplacementInputValue] = useState('');
  const [replacementTableData, setReplacementTableData] = useState([]);

  // State array to store Fremove and refixed Table Data
  const [refixedSelectedOption, setRefixedSelectedOption] = useState(null);
  const [refixedPrice, setRefixedPrice] = useState(0);
  const [refixedInputValue, setRefixedInputValue] = useState('');
  const [refixedTableData, setRefixedTableData] = useState([]);

  // State array to store Repair Table Data
  const [repairSelectedOption, setRepairSelectedOption] = useState(null);
  const [repairPrice, setRepairPrice] = useState(0);
  const [repairInputValue, setRepairInputValue] = useState('');
  const [repairTableData, setRepairTableData] = useState([]);

  // State array to store Paint Table Data
  const [paintSelectedOption, setPaintSelectedOption] = useState(null);
  const [paintPrice, setPaintPrice] = useState(0);
  const [paintInputValue, setPaintInputValue] = useState('');
  const [paintTableData, setPaintTableData] = useState([]);

  const[insurancePrice, setInsurancePrice] = useState(0)

  const [index, setIndex] = useState(null);
  const [supplimentryCounts, setSupplimentryCount] = useState("");

  //Product Model
  const [openProductModel, setOpenProductModel] = useState(false);

  const jwtToken = localStorage.getItem("jwtToken");

  //Handle select items
  useEffect(()=>{
    if(!jwtToken){
      navigate("/");
    }
    setDisable(false);
    const fetchItems= async()=>{
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/estimate/items`)
      .then((res)=>{
        const formattedOptions = res.data.map((item) => ({
          value: item.itemName,
          label: item.itemName,
        }));
        setItemOption(formattedOptions);
      }).catch((err)=>{
        console.log(err.message);
      })
    }
    fetchItems();
  },[jwtToken, openProductModel]);


  //Handle job searching
  const handleJobSearchBtn = async(e)=>{
    e.preventDefault();
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

    }
    else{
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/estimate/getEstimateJobDetails/${jobID}`)
      .then((res)=>{
        const result = res.data[0];

        setAccidentDate(result.accidentDate);
        setVehicleNo(result.vehicleNo);
        setVehicleModel(result.vehicleModel);
        setVehicleMake(result.vehicleMake);
        setCustomerName(result.customerName);
        setCustomerMobile(result.customerMobile);
        setInsuranceName(result.insuranceName);

        setVisible("block");
        setDisable(true);

        const countData = { jobID }; // Assuming jobID is a query parameter
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/supplimentryPreview/getSupplimentryCount`, {
          params: countData, // Use params to send data as query parameters
        }).then((res)=>{
          const countResult = res.data;
          setSupplimentryCount(countResult.currentSupplimentry);
        }).catch((err)=>{
          console.log(err.message)
        })

      }).catch((err)=>{
        setErrorVisible("block");
        setError(errorType[7]);
        setBackgroundColor("#fae0e4");
        setBorderColor("#ff0a54");
        setFontColor("#ff0a54");
        setIconColor("#ff0a54");

        setTimeout(()=>{
            setErrorVisible("none");
        },5000);
      })
      
      
        
    }
    
  }
  //-------------------------------------------------------------------------------------------------------------------------------------------
  //Replacement Items table handling
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  const handleReplecementInputValue=(e)=>{
    setReplacementInputValue(e.target.value)
  };
  const handleReplacementPrice=(e)=>{
    setReplacementPrice(e.target.value)
  }
  const handleReplacementTableAddBtn=()=>{
    if(!selectedOption){
      setErrorVisible("block");
      setError(errorType[3]);
      setBackgroundColor("#fae0e4");
      setBorderColor("#ff0a54");
      setFontColor("#ff0a54");
      setIconColor("#ff0a54");

      setTimeout(()=>{
        setErrorVisible("none");
      },2000);
    }else{
      const newReplacementData = {
        no:replacementTableData.length + 1,
        itemName: selectedOption.label + " (Supplimentry " + (supplimentryCounts + 1) +")",
        itemPrice: parseFloat(replacementPrice).toFixed(2),
        itemValue: replacementInputValue.toUpperCase(),
        tableCategory:"Replacement",
        insurancePrice: parseFloat(insurancePrice).toFixed(2),
        supNo:(supplimentryCounts + 1),
        jobID: jobID
      }
      setReplacementTableData((prevData)=>[...prevData, newReplacementData]);
      setBtnVisible("block");
      // Clear the input and selected option after adding to the table
      setSelectedOption(null);
      setReplacementPrice(0);
      setReplacementInputValue('');
    }
  }
  //-------------------------------------------------------------------------------------------------------------------------------------------
  //Remove and Re-Fixed Items table handling
  const handleRefixedSelectedChange=(refixedSelectedOption)=>{
    setRefixedSelectedOption(refixedSelectedOption)
  }

  const handleRefixedPriceChange=(e)=>{
    setRefixedPrice(e.target.value);
  }
  const handleRefixedInputValue=(e)=>{
    setRefixedInputValue(e.target.value);
  }
  const handleRefixedTableAddBtn=()=>{
    if(!refixedSelectedOption || !refixedPrice){
      setErrorVisible("block");
      setError(errorType[4]);
      setBackgroundColor("#fae0e4");
      setBorderColor("#ff0a54");
      setFontColor("#ff0a54");
      setIconColor("#ff0a54");

      setTimeout(()=>{
        setErrorVisible("none");
      },2000);
    }else{
      if(isNaN(refixedPrice)){
        setErrorVisible("block");
        setError(errorType[5]);
        setBackgroundColor("#fae0e4");
        setBorderColor("#ff0a54");
        setFontColor("#ff0a54");
        setIconColor("#ff0a54");

        setTimeout(()=>{
          setErrorVisible("none");
        },2000);
      }else{
        const newRefixedData = {
          no:refixedTableData.length + 1,
          itemName: refixedSelectedOption.label + " (Supplimentry " + (supplimentryCounts + 1) +")",
          itemPrice: parseFloat(refixedPrice).toFixed(2),
          itemValue:refixedInputValue.toUpperCase(),
          tableCategory:"Refixed",
          insurancePrice: parseFloat(insurancePrice).toFixed(2),
          supNo:(supplimentryCounts + 1),
          jobID: jobID
        }
        setRefixedTableData((prevData)=>[...prevData, newRefixedData]);
        setBtnVisible("block");
        // Clear the input and selected option after adding to the table
        setRefixedSelectedOption(null);
        setRefixedPrice(0);
      }
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------
  //Remove and Repair Items table handling
  const handleRepairSelectedChange=(repairSelectedOption)=>{
    setRepairSelectedOption(repairSelectedOption)
  }

  const handleRepairPriceChange=(e)=>{
    setRepairPrice(e.target.value);
  }
  const handleRepairInputValue=(e)=>{
    setRepairInputValue(e.target.value)
  }
  const handleRepairTableBtn=()=>{
    if(!repairSelectedOption || !repairPrice){
      setErrorVisible("block");
      setError(errorType[4]);
      setBackgroundColor("#fae0e4");
      setBorderColor("#ff0a54");
      setFontColor("#ff0a54");
      setIconColor("#ff0a54");

      setTimeout(()=>{
        setErrorVisible("none");
      },2000);
    }else{
      if(isNaN(repairPrice)){
        setErrorVisible("block");
        setError(errorType[5]);
        setBackgroundColor("#fae0e4");
        setBorderColor("#ff0a54");
        setFontColor("#ff0a54");
        setIconColor("#ff0a54");

        setTimeout(()=>{
          setErrorVisible("none");
        },2000);
      }else{
        const newRepairData = {
          no:repairTableData.length + 1,
          itemName: repairSelectedOption.label + " (Supplimentry " + (supplimentryCounts + 1) +")",
          itemPrice: parseFloat(repairPrice).toFixed(2),
          itemValue: repairInputValue.toUpperCase(),
          tableCategory:"Repair",
          insurancePrice: parseFloat(insurancePrice).toFixed(2),
          supNo:(supplimentryCounts + 1),
          jobID: jobID
        }
        setRepairTableData((prevData)=>[...prevData, newRepairData]);
        setBtnVisible("block");
        // Clear the input and selected option after adding to the table
        setRepairSelectedOption(null);
        setRepairPrice(0);
      }
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------
  //Remove Paint table handling
  const handlePaintChange=(paintSelectedOption)=>{
    setPaintSelectedOption(paintSelectedOption)
  }

  const handlePaintPriceChange=(e)=>{
    setPaintPrice(e.target.value);
  }
  const handlePaintInputValue=(e)=>{
    setPaintInputValue(e.target.value);
  }
  const handlePaintTableBtn=()=>{
    if(!paintSelectedOption || !paintPrice){
      setErrorVisible("block");
      setError(errorType[4]);
      setBackgroundColor("#fae0e4");
      setBorderColor("#ff0a54");
      setFontColor("#ff0a54");
      setIconColor("#ff0a54");

      setTimeout(()=>{
        setErrorVisible("none");
      },2000);
    }else{
      if(isNaN(paintPrice)){
        setErrorVisible("block");
        setError(errorType[5]);
        setBackgroundColor("#fae0e4");
        setBorderColor("#ff0a54");
        setFontColor("#ff0a54");
        setIconColor("#ff0a54");

        setTimeout(()=>{
          setErrorVisible("none");
        },2000);
      }else{
        const newPaintData = {
          no:paintTableData.length + 1,
          itemName: paintSelectedOption.label + " (Supplimentry " + (supplimentryCounts + 1) +")",
          itemPrice: parseFloat(paintPrice).toFixed(2),
          itemValue: paintInputValue.toUpperCase(),
          tableCategory:"Paint",
          insurancePrice: parseFloat(insurancePrice).toFixed(2),
          supNo:(supplimentryCounts + 1),
          jobID: jobID
        }
        setPaintTableData((prevData)=>[...prevData, newPaintData]);
        setBtnVisible("block");
        // Clear the input and selected option after adding to the table
        setPaintSelectedOption(null);
        setPaintPrice(0);
      }
    }
  }

  //---------------------------------------------------Edit Tables-----------------------------------------------------------------------------------
 
  // Handle replacement item editing
 const replecementEditHandler = (no) => {
  const {itemName, itemPrice, itemValue} = replacementTableData[no];
  setSelectedOption({label: itemName, value: itemName});
  setReplacementPrice(itemPrice);
  setReplacementInputValue(itemValue);
  setReplacementAddVisible("none")
  setBtnVisible("none");
  setReplacementUpdateBtnVisible('block');
  setIndex(no);
};

const replecementUpdateHandler = () => {
  if (index !== null) {
    const updatedReplacementData = [...replacementTableData];
    updatedReplacementData[index] = {
      no: index + 1,
      itemName: selectedOption.label,
      itemPrice:parseFloat(replacementPrice).toFixed(2),
      itemValue: replacementInputValue.toUpperCase(),
      tableCategory:"Replacement",
      insurancePrice: parseFloat(insurancePrice).toFixed(2),
      supNo: supplimentryCounts + 1,
      jobID
    };
    setReplacementTableData(updatedReplacementData);
    setBtnVisible("block");
    setReplacementAddVisible("block")
    setReplacementUpdateBtnVisible('none');
    setSelectedOption(null);
    setReplacementPrice(0.00)
    setReplacementInputValue('');
    setIndex(null); // Reset index after update
  }
};
 
  // Handle Refixed item editing
 const refixedEditHandler = (no) => {
  const {itemName, itemPrice} = refixedTableData[no];
  setRefixedSelectedOption({label: itemName, value: itemName});
  setRefixedPrice(itemPrice);
  setRefixedAddVisible("none")
  setBtnVisible("none");
  setRefixedUpdateBtnVisible('block');
  setIndex(no);
};

const refixedUpdateHandler = () => {
  if (index !== null) {
    const updatedRefixedData = [...refixedTableData];
    updatedRefixedData[index] = {
      no: index + 1,
      itemName: refixedSelectedOption.label,
      itemPrice:parseFloat(refixedPrice).toFixed(2),
      tableCategory:"Refixed",
      insurancePrice: parseFloat(insurancePrice).toFixed(2),
      supNo: supplimentryCounts + 1,
      jobID
    };
    setRefixedTableData(updatedRefixedData);
    setRefixedAddVisible("block")
    setBtnVisible("block");
    setRefixedUpdateBtnVisible('none');
    setRefixedSelectedOption(null);
    setRefixedPrice('');
    setIndex(null); // Reset index after update
  }
};
 
  // Handle Repair item editing
 const repairEditHandler = (no) => {
  const {itemName, itemPrice} = repairTableData[no];
  setRepairSelectedOption({label: itemName, value: itemName});
  setRepairPrice(itemPrice);
  setRepairAddVisible("none")
  setBtnVisible("none");
  setRepairUpdateBtnVisible('block');
  setIndex(no);
};

const repairUpdateHandler = () => {
  if (index !== null) {
    const updatedRepairData = [...repairTableData];
    updatedRepairData[index] = {
      no: index + 1,
      itemName: repairSelectedOption.label,
      itemPrice:parseFloat(repairPrice).toFixed(2),
      tableCategory:"Repair",
      insurancePrice: parseFloat(insurancePrice).toFixed(2),
      supNo: supplimentryCounts + 1,
      jobID
    };
    setRepairTableData(updatedRepairData);
    setRepairAddVisible("block")
    setBtnVisible("block");
    setRepairUpdateBtnVisible('none');
    setRepairSelectedOption(null);
    setRepairPrice('');
    setIndex(null); // Reset index after update
  }
};
 
  // Handle Paint item editing
 const paintEditHandler = (no) => {
  const {itemName, itemPrice} = paintTableData[no];
  setPaintSelectedOption({label: itemName, value: itemName});
  setPaintPrice(itemPrice);
  setPaintAddVisible('none')
  setBtnVisible("none");
  setPaintUpdateBtnVisible('block');
  setIndex(no);
};

const paintUpdateHandler = () => {
  if (index !== null) {
    const updatedPaintData = [...paintTableData];
    updatedPaintData[index] = {
      no: index + 1,
      itemName: paintSelectedOption.label,
      itemPrice:parseFloat(paintPrice).toFixed(2),
      tableCategory:"Paint",
      insurancePrice: parseFloat(insurancePrice).toFixed(2),
      supNo: supplimentryCounts + 1,
      jobID
    };
    setPaintTableData(updatedPaintData);
    setPaintAddVisible('block')
    setBtnVisible("block");
    setPaintUpdateBtnVisible('none');
    setPaintSelectedOption(null);
    setPaintPrice('');
    setIndex(null); // Reset index after update
  }
};


  //-----------------------------------------------------Deleting Tables records-----------------------------------------------------------------
  //Replacement item table
  const replacementDeleteHandler=(no)=>{
    console.log(no, "Need to delete")
    const restData = [...replacementTableData]
    restData.splice(no,1);
    setReplacementTableData(restData);
  }
  //Refixed item table
  const refixedDeleteHandler=(no)=>{
    console.log(no, "Need to delete")
    const restData = [...refixedTableData]
    restData.splice(no,1);
    setRefixedTableData(restData);
  }
  //Repair item table
  const repairDeleteHandler=(no)=>{
    console.log(no, "Need to delete")
    const restData = [...repairTableData]
    restData.splice(no,1);
    setRepairTableData(restData);
  }
  //Repair item table
  const paintDeleteHandler=(no)=>{
    console.log(no, "Need to delete")
    const restData = [...paintTableData]
    restData.splice(no,1);
    setPaintTableData(restData);
  }

  //---------------------------------------------------------submit estimate handling-----------------------------------------------------------------
  const handleSupplimentry = async () => {
    //Check already created or not
    const formData = {
      data: [
        ...replacementTableData,
        ...refixedTableData,
        ...repairTableData,
        ...paintTableData,
      ],
    };

    if(!formData.data || formData.data.length === 0){
      setErrorVisible("block");
      setError(errorType[6]);
      setBackgroundColor("#fae0e4");
      setBorderColor("#ff0a54");
      setFontColor("#ff0a54");
      setIconColor("#ff0a54");

      setTimeout(()=>{
        setErrorVisible("none");
      },2000);
    }else{
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/supplimentry/createSupplimentry`, formData)
      .then((res) => {
        setErrorVisible("none");
      })
      .catch((err) => {
        setErrorVisible("block");
        setError(errorType[7]);
        setBackgroundColor("#fae0e4");
        setBorderColor("#ff0a54");
        setFontColor("#ff0a54");
        setIconColor("#ff0a54");

        setTimeout(()=>{
            setErrorVisible("none");
        },5000);
      });
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/createEstimateInvoice`, formData);
      setErrorVisible("none");

      const supplimentryCountData = { jobID }
      //Add supplimentry count
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/supplimentryPreview/updateSupplimentryCount`, {
        params: supplimentryCountData
      })
      .then((res)=>{
        navigate('/supplimentry-preview');
      }).catch((err)=>{
        console.log(err.message)
      })
    }
  };
  
  return (
    <div className="createEstimateContainer">
        <Drawer/>
        <div className="estimateContainer">
            <Navbar className='navbarComponent' text="Estimate / Create Supplimentry"/>
            <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/>
            <div className='mainContainer'>
              <div className="searchJob" style={{marginLeft:"40px"}}>
                <label htmlFor="" style={{fontSize:"18px"}}>Seach Job No:</label>
                <input type="text" placeholder='Enter Job No'  className='searchInput' onChange={(e)=>{
                  setJobNo(e.target.value)
                }} disabled={disable} style={{width:"15rem"}}/>
                <button className='searchBtn' onClick={handleJobSearchBtn}>Seach</button>
              </div>
              {/* -------------------------------------------------------------------------------------------------------- */}
              <div className="jobDetails" style={{marginLeft:"40px"}}>
                <h2 style={{marginBottom:"20px", color:"red"}}>Details of Selected Job</h2>
                <form action="">
                  <div className='jobFormDetails'>
                    <div className="textContainer">
                      <label htmlFor="">Accident Date:</label><br />
                      <input type="text" readOnly className='jobFormText' value={accidentDate}/>
                    </div>
                    <div className="textContainer">
                      <label htmlFor="">Customer Name:</label><br />
                      <input type="text" readOnly className='jobFormText' value={customerName}/>
                    </div>
                  </div>
                  <div className='jobFormDetails'>
                    <div className="textContainer">
                      <label htmlFor="">Vehicle No:</label><br />
                      <input type="text" readOnly className='jobFormText' value={vehicleNo}/>
                    </div>
                    <div className="textContainer">
                      <label htmlFor="">Contact No:</label><br />
                      <input type="text" readOnly className='jobFormText' value={customerMobile}/>
                    </div>
                  </div>
                  <div className='jobFormDetails'>
                    <div className="textContainer">
                      <label htmlFor="">Vehicle Name:</label><br />
                      <input type="text" readOnly className='jobFormText' value={vehicleMake+' '+vehicleModel}/>
                    </div>
                    <div className="textContainer">
                      <label htmlFor="">Insurance Company:</label><br />
                      <input type="text" readOnly className='jobFormText' value={insuranceName}/>
                    </div>
                  </div>
                </form>
              </div>
              {/* ------------------------------------------------------------------------------------------------------------------------ */}
              <div className="replacementItemContainer" style={{display:visible}}>
                {/* Create product model pop up window */}
                <div className="addNewProductItem">
                  <div style={{color: "#006d77"}} onClick={()=>{
                    setOpenProductModel(true)
                  }}><LibraryAddIcon/></div>
                  {openProductModel && (
                    <ProductModel closeModel={setOpenProductModel}/>
                  )}
                </div>
                <h2  style={{color:"red"}}>Replacement Items</h2>
                <div className='selectableItemOptions'>
                <Select
                  options={itemOption}
                  isSearchable={true}
                  placeholder="Select Item"
                  className='selectedOptions'
                  name='itemName'
                  value={selectedOption}
                  onChange={handleSelectChange}
                />
                <input type="text" placeholder='Price' className='priceText' value={replacementPrice} name='itemValue' onChange={handleReplacementPrice} style={{width:"5rem"}}/>
                <select className='priceText' value={replacementInputValue} name='itemValue' onChange={handleReplecementInputValue} style={{borderRadius:"5px", marginLeft:"10px", border:"1px solid darkgoldenrod"}}>
                  <option value="" selected>Value</option>
                  <option value="MR">MR</option>
                  <option value="RC">RC</option>
                  <option value="SH">SH</option>
                  <option value="AP">AP</option>
                  <option value="NN">NN</option>
                  <option value="NC">NC</option>
                  <option value="DELETE">DELETE</option>
                  <option value="ND">ND</option>
                </select>
                <button className='addBtn' style={{display:replacementAddVisible,  marginRight:"0"}} onClick={handleReplacementTableAddBtn}>Add</button>
                <button className='updateBtn' id='replacementUpdateBtn' style={{ display: replacementUpdateBtnVisible, marginLeft:"10px" }} onClick={replecementUpdateHandler}>Update</button>
                <div>
                  <EstimateTable
                    tableData={replacementTableData || []}
                    column1="Item Name"
                    column2="Type"
                    tableWidth="100%"
                    visibility={btnVisible}
                    handleEdit={(index) => replecementEditHandler(index)}
                    handleDelete={(index)=>{replacementDeleteHandler(index)}}
                  />
                </div>
                </div>
              </div>
              {/* ------------------------------------------------------------------------------------------------------------------- */}
              <div className="replacementItemContainer" style={{display:visible}}>
                 {/* Create product model pop up window */}
                 <div className="addNewProductItem">
                  <div style={{color: "#006d77"}} onClick={()=>{
                    setOpenProductModel(true)
                  }}><LibraryAddIcon/></div>
                  {openProductModel && (
                    <ProductModel closeModel={setOpenProductModel}/>
                  )}
                </div>
                <h2  style={{color:"red"}}>Remove and Re-Fixed Items</h2>
                <div className='selectableItemOptions'>
                  <Select
                    options={itemOption}
                    isSearchable={true}
                    placeholder="Select Item"
                    className='selectedOptions'
                    name='itemName'
                    value={refixedSelectedOption}
                    onChange={handleRefixedSelectedChange}
                  />
                  <input type="text" placeholder='Price' className='priceText' name='itemValue' value={refixedPrice} onChange={handleRefixedPriceChange}/>
                  <input type="text" placeholder='Type' className='priceText' value={refixedInputValue} name='itemValue' onChange={handleRefixedInputValue} style={{display:"none"}}/>
                  <button className='addBtn' style={{display:refixedAddVisible, marginRight:"3rem"}} onClick={handleRefixedTableAddBtn}>Add</button>
                  <button className='updateBtn' id='refixedUpdateBtn' style={{ display: refixedUpdateBtnVisible, marginLeft:"10px" }} onClick={refixedUpdateHandler}>Update</button>
                  <div>
                    <EstimateTable
                      tableData={refixedTableData || []}
                      column1="Item Name"
                      column2="Price"
                      tableWidth="100%"
                      priceColumn="none"
                      visibility={btnVisible}
                      handleEdit={(index) => refixedEditHandler(index)}
                      handleDelete={(index)=>{refixedDeleteHandler(index)}}
                    />
                </div>
                </div>
              </div>
              {/* ------------------------------------------------------------------------------------------------------------------- */}
              <div className="replacementItemContainer" style={{display:visible}}>
                 {/* Create product model pop up window */}
                 <div className="addNewProductItem">
                  <div style={{color: "#006d77"}} onClick={()=>{
                    setOpenProductModel(true)
                  }}><LibraryAddIcon/></div>
                  {openProductModel && (
                    <ProductModel closeModel={setOpenProductModel}/>
                  )}
                </div>
                <h2  style={{color:"red"}}>Repair Items</h2>
                <div className='selectableItemOptions'>
                  <Select
                    options={itemOption}
                    isSearchable={true}
                    placeholder="Select Item"
                    className='selectedOptions'
                    value={repairSelectedOption}
                    onChange={handleRepairSelectedChange}
                  />
                  <input type="text" placeholder='Price' className='priceText' value={repairPrice} onChange={handleRepairPriceChange}/>
                  <input type="text" placeholder='Type' className='priceText' value={repairInputValue} name='itemValue' onChange={handleRepairInputValue} style={{display:"none"}}/>
                  <button className='addBtn'  style={{display:repairAddVisible, marginRight:"3rem"}} onClick={handleRepairTableBtn}>Add</button>
                  <button className='updateBtn' id='repairUpdateBtn' style={{ display: repairUpdateBtnVisible, marginLeft:"10px" }} onClick={repairUpdateHandler}>Update</button>
                  <div>
                    <EstimateTable
                      tableData={repairTableData || []}
                      column1="Item Name"
                      column2="Price"
                      tableWidth="100%"
                      priceColumn="none"
                      visibility={btnVisible}
                      handleEdit={(index) => repairEditHandler(index)}
                      handleDelete={(index)=>{repairDeleteHandler(index)}}
                    />
                  </div>
                </div>
              </div>
              {/* ------------------------------------------------------------------------------------------------------------------- */}
              <div className="replacementItemContainer" style={{display:visible}}>
                 {/* Create product model pop up window */}
                 <div className="addNewProductItem">
                  <div style={{color: "#006d77"}} onClick={()=>{
                    setOpenProductModel(true)
                  }}><LibraryAddIcon/></div>
                  {openProductModel && (
                    <ProductModel closeModel={setOpenProductModel}/>
                  )}
                </div>
                <h2  style={{color:"red"}}>Paint Items</h2>
                <div className='selectableItemOptions'>
                  <Select
                    options={itemOption}
                    isSearchable={true}
                    placeholder="Select Item"
                    className='selectedOptions'
                    value={paintSelectedOption}
                    onChange={handlePaintChange}
                  />
                  <input type="text" placeholder='Price' className='priceText' value={paintPrice} onChange={handlePaintPriceChange}/>
                  <input type="text" placeholder='Type' className='priceText' value={paintInputValue} name='itemValue' onChange={handlePaintInputValue} style={{display:"none"}}/>
                  <button className='addBtn' style={{display:paintAddVisible, marginRight:"3rem"}} onClick={handlePaintTableBtn}>Add</button>
                  <button className='updateBtn' id='paintUpdateBtn' style={{ display: paintUpdateBtnVisible, marginLeft:"10px" }} onClick={paintUpdateHandler}>Update</button>
                  <div>
                    <EstimateTable
                      tableData={paintTableData || []}
                      column1="Item Name"
                      column2="Price"
                      tableWidth="100%"
                      priceColumn="none"
                      visibility={btnVisible}
                      handleEdit={(index) => paintEditHandler(index)}
                      handleDelete={(index)=>{paintDeleteHandler(index)}}
                    />
                  </div>
                </div>
              </div>
              {/* ------------------------------------------------------------------------------------------------------------------- */}
              <button className='estimateBtn' style={{display:visible}} onClick={handleSupplimentry}>Create Supplimentary</button>
            </div>
        </div>
    </div>
  )
}

export default Supplimentry
