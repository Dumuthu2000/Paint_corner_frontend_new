import React from 'react'
import './updatePurchaseOrder.css';
import Navbar from '../../components/Navbar/Navbar';
import Drawer from '../../components/Drawer/Drawer';
import Error from '../../components/Errors/Error';
import DatePicker from 'react-datepicker';
import { useState, useEffect } from 'react';
import Select from 'react-select'
import axios from 'axios';
import ProductModel from '../../components/Model/ProductModel';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import PurchaseTable from '../../components/Tables/PurchaseTable';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePurchaseOrder = () => {
      //Errors
  const errorType = [
    "All fields are required"
  ]
  const [error, setError] = useState([]);
  const [erroVisible, setErrorVisible] = useState("none");
  const [backgroundColor, setBackgroundColor] = useState("#fae0e4")
  const [borderColor, setBorderColor] = useState("#ff0a54")
  const [fontColor, setFontColor] = useState("#ff0a54")
  const [iconColor, setIconColor] = useState("#ff0a54")

  
  //Options
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [vehicleModelOptions, setVehicleMakeOptions] = useState([]);
  const [companyOptions, setCompanyNameOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

   //Product Model
  const [openProductModel, setOpenProductModel] = useState(false);
  const [addView, setAddView] = useState('block')
  const [updateView, setUpdateView] = useState('none')
  const [updateIndex, setUpdateIndex] = useState(null);

  const[orderItems, setOrderItems] = useState([]);
  const[purchaseData, setPurchaseData] = useState({});

  const[vehicleNo, setVehicleNo] = useState('');
  const[vehicleMake, setVehicleModel]= useState('');
  const[vehicleModel, setVehicleModels]= useState('');
  const[companyName, setCompanyName] = useState('');
  const[issuedDate, setIssuedDate] = useState('');

  //Purchase Item Container
  const[itemName, setItemName] = useState(null);
  const[itemQty, setItemQty] = useState('');
  const[itemPrice, setItemPrice] = useState('');
  const[purchaseTableData, setPurchaseTableData] = useState([]);

  const[selectedIndex, setSelectedIndex] = useState(null)
  const [editingQty, setEditingQty] = useState('');
  const [editingPrice, setEditingPrice] = useState('');


  const navigate = useNavigate();
  const {poID} = useParams();

  useEffect(()=>{
    const purchaseData=async()=>{
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseOrder/getPurchaseOrder/${poID}`)
          .then((res)=>{
              setOrderItems(res.data.purchaseItems)
              setPurchaseData(res.data.purchaseOrder)
            
          }).catch((err)=>{
              alert(err.message);
          })
    }
    const fetchVehicleModels=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/vehicle/model`)
        .then((res)=>{
            const vehicleModel = res.data.map((vehicle)=>({
                value: vehicle.model,
                label: vehicle.model,
            }));
            setVehicleOptions(vehicleModel);
        })
    }
    const fetchVehicleMake=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/vehicle/make`)
        .then((res)=>{
            const vehicleMakes = res.data.map((vehicle)=>({
                value: vehicle.make,
                label: vehicle.make,
            }));
            setVehicleMakeOptions(vehicleMakes);
        })
    }
    const fetchCompanyName=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseCompany/companies`)
        .then((res)=>{
            const company = res.data.map((company)=>({
                value: company.companyName,
                label: company.companyName,
            }));
            setCompanyNameOptions(company);
        })
    }
    const fetchProductItems=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/estimate/items`)
        .then((res)=>{
            const items = res.data.map((item)=>({
                value: item.itemName,
                label: item.itemName,
                itemID:item.itemID
            }))
            setItemOptions(items);
        })
    }
    purchaseData();
    fetchVehicleModels();
    fetchVehicleMake();
    fetchCompanyName();
    fetchProductItems();
  },[])

    // Update state variables when purchaseData changes
    useEffect(() => {
        setVehicleNo(purchaseData.vehicleNo || '');
        setVehicleModel(purchaseData.vehicleMake || '');
        setVehicleModels(purchaseData.vehicleModel || '');
        setCompanyName(purchaseData.companyName || '');
        const parsedDate = purchaseData.issuedDate ? new Date(purchaseData.issuedDate) : null;
        setIssuedDate(parsedDate);
      }, [purchaseData]);

      useEffect(() => {
        const initialPurchaseTableData = orderItems.map((item) => ({
            item_id: item.item_id,
            itemName: item.itemName,
            itemQty: item.itemQty,
            itemPrice: item.itemPrice,
        }));
        setPurchaseTableData(initialPurchaseTableData);
    }, [orderItems]);
    

    const handleSelectVehicleModel = (vehicleMake) => {
        setVehicleModel(vehicleMake.value);
        console.log(vehicleMake.value)
    };

    const handleSelectVehicleMake = (vehicleModel) => {
        setVehicleModels(vehicleModel.value);
        console.log(vehicleModel.value)
    };

    const handleItemName=(itemName)=>{
        setItemName(itemName);
    }

    const handleSelectCompanyName=(companyName)=>{
        setCompanyName(companyName.value);
    }

  const handleTableBtn=async()=>{
    const newPurchaseOrderData={
        item_id:itemName.itemID,
        itemName: itemName.label, 
        itemPrice: itemPrice,
        itemQty: itemQty,  
    }

    setPurchaseTableData((prevData)=>[...prevData, newPurchaseOrderData]);
    setItemName(null);
    setItemQty('');
    setItemPrice('');
  }

  // Handling edit button
  const editHandler = (index) => {
    setSelectedIndex(index);
    // Set the editing states to the current values of the selected row
    setEditingQty(purchaseTableData[index].itemQty);
    setEditingPrice(purchaseTableData[index].itemPrice);
  };

  // Handling update button
  const updateHandler = (index) => {
    const updatedPurchaseData = [...purchaseTableData];
    updatedPurchaseData[index].itemQty = editingQty; // Update with the edited quantity
    updatedPurchaseData[index].itemPrice = editingPrice; // Update with the edited price

    setPurchaseTableData(updatedPurchaseData);
    setSelectedIndex(null);
  };

const deleteHandler = async (index) => {
    console.log('click')
    const order_id = poID;
    const item_id = purchaseTableData[index].item_id;
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseOrder/deletePurchaseOrder/${order_id}`, {
        data:{item_id}
    })
    .then((res) => {
        window.location.reload()
    })
};
  //Handling submit button
  const handleSubmitBtn=async()=>{
    if(!vehicleNo || !vehicleMake || !vehicleModel || !companyName || !issuedDate || !purchaseTableData){
        setErrorVisible("block");
        setError(errorType[0]);
        setBackgroundColor("#fae0e4");
        setBorderColor("#ff0a54");
        setFontColor("#ff0a54");
        setIconColor("#ff0a54");
  
        setTimeout(() => {
          setErrorVisible("none");
        }, 2000);
    }else{
        const formData = {vehicleNo, vehicleMake, vehicleModel, companyName, issuedDate, purchaseTableData}
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseOrder/updatePurchaseOrder/${poID}`, formData)
        .then((res)=>{
            navigate(`/purchase-order/preview-purchaseOrder/${poID}`)
        }).catch((err)=>{
            alert(err.message)
        })
    }
  }

  return (
    <div className="createEstimateContainer">
        <Drawer/>
        <div className="estimateContainer">
            <Navbar className='navbarComponent' text="Purchase Order / Update Purchase Order"/>
            <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/>
            <div className='mainContainer'>
                    <div className="jobDetails" style={{width:'70%'}}>
                        <h2 style={{marginBottom:"20px", color:"red"}}>Details of Purchase Order</h2>
                        <form action="">
                        <div className='jobFormDetails'>
                            <div className="textContainer">
                                <label htmlFor="">Vehicle No:</label><br />
                                <input type="text" className='jobFormText' id='purchaseInput' placeholder='Ex. CAC-2454' value={vehicleNo} onChange={(e)=>{
                                    setVehicleNo(e.target.value)
                                }}/>
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Vehicle Make:</label><br />
                                <Select
                                    options={vehicleModelOptions}
                                    isSearchable={true}
                                    placeholder="Ex TOYOTA"
                                    className='jobFormText'
                                    value={vehicleModelOptions.find(option => option.value === vehicleMake)}
                                    onChange={handleSelectVehicleMake}
                                    required
                                />
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Vehicle Model:</label><br />
                                <Select
                                    options={vehicleOptions}
                                    isSearchable={true}
                                    placeholder="EX AXIO-161"
                                    className='jobFormText'
                                    value={vehicleOptions.find(option => option.value === vehicleModel)}
                                    onChange={handleSelectVehicleModel}
                                    required
                                />
                            </div>
                            
                        </div>
                        <div className='purchaseDetails'>
                            <div className="textContainer">
                                <label htmlFor="">Company Name:</label><br />
                                <Select
                                    options={companyOptions}
                                    isSearchable={true}
                                    placeholder="Select Company"
                                    className='jobFormText'
                                    value={companyOptions.find(option => option.value === companyName)}
                                    onChange={handleSelectCompanyName}
                                    required
                            />
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Issued Date:</label><br />
                                <DatePicker selected={ issuedDate} onChange={(date)=>setIssuedDate(date)} placeholderText='Select Date' className='jobFormText' id='purchaseIssuedDate'/>
                            </div>
                        </div>
                        </form>
                    </div>
                    <div className="purchaseContainer">
                        <div className="addNewProductItem">
                            <div style={{color: "#006d77"}} onClick={()=>{
                                setOpenProductModel(true)
                            }}><LibraryAddIcon/></div>
                            {openProductModel && (
                                <ProductModel closeModel={setOpenProductModel}/>
                            )}
                        </div>
                        <h3 className='purchaseTitle'>Purchase Items</h3>
                        <div className="purchaseContent">
                            <Select
                                options={itemOptions}
                                isSearchable={true}
                                className='itemSelectOption'
                                placeholder='Select Item'
                                value={itemName}
                                onChange={handleItemName}
                                required
                            />
                            {/* <input type="text" className="purchaseInput" id='qtyInput' placeholder='Qty' value={itemQty} onChange={(e)=>{
                                setItemQty(e.target.value)
                            }}/>
                            <input type="text" className="purchaseInput" placeholder='Amount (Rs)' value={itemPrice} onChange={(e)=>{
                                setItemPrice(e.target.value)
                            }}/> */}
                            <button style={{display:addView}} className="purchaseAddBtn" onClick={handleTableBtn}>Add</button>
                            {/* <button style={{display:updateView}} className="purchaseUpdateBtn" onClick={handleUpdateBtn}>Update</button> */}
                            <div>
                            <div className="table-container">
                                <table className="custom-table">
                                    <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Item Name</th>
                                        <th>Qty</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {purchaseTableData?.map((data, index) => (
                                        <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{data.itemName}</td>
                                        <td>
                                        {selectedIndex === index ? (
                                            <>
                                                <input
                                                    type="text"
                                                    className='insurancePrice'
                                                    style={{ padding: "5px", width: "8rem", borderRadius: "2px", }}
                                                    value={editingQty}
                                                    onChange={(e) => setEditingQty(e.target.value)}
                                                />
                                            </>
                                            ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    className='insurancePrice'
                                                    value={data.itemQty}
                                                    style={{ padding: "5px", width: "8rem", borderRadius: "2px", color:"#c9184a", fontWeight:"bold"}}
                                                    disabled
                                                />
                                            </>
                                            )}
                                        </td>
                                        <td>
                                        {selectedIndex === index ? (
                                            <>
                                                <input
                                                    type="text"
                                                    className='insurancePrice'
                                                    style={{ padding: "5px", width: "8rem", borderRadius: "2px", }}
                                                    value={editingPrice}
                                                    onChange={(e) => setEditingPrice(e.target.value)}
                                                />
                                            </>
                                            ) : (
                                            <>
                                                <input
                                                type="text"
                                                className='insurancePrice'
                                                value={data.itemPrice}
                                                style={{ padding: "5px", width: "8rem", borderRadius: "2px", color:"#c9184a", fontWeight:"bold"}}
                                                disabled
                                                />
                                            </>
                                            )}
                                        </td>
                                        <td >
                                            <div className="tableBtn">
                                            {selectedIndex === index ? (
                                                <>
                                                <button className='tableUpdateBtn' onClick={() => {updateHandler(index) }}>Update</button>
                                                </>
                                            ) : (
                                                <>
                                                <button className='editBtn' onClick={() => {editHandler(index) }}>Edit</button>
                                                <button className='deleteBtn' onClick={()=>{deleteHandler(index)}}>Delete</button>
                                                </>
                                            )}
                                            </div>
                                        </td>
                                        </tr>
                                    ))}
                                    {/* Add more rows as needed */}
                                </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                        <button className='poBtn' onClick={handleSubmitBtn}>UPDATE PURCHASE ORDER</button>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default UpdatePurchaseOrder
