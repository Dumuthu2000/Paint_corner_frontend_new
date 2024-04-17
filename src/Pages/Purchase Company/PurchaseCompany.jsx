import Navbar from '../../../components/Navbar/Navbar'
import Drawer from '../../../components/Drawer/Drawer'
import Error from '../../../components/Errors/Error'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PurchaseCompany = () => {
    const errorType = [ 
        "Vehicles are not available",
        "All fields are required",
        "This model and make already created",
        "New vehicle added successfully",
        "Update Successfull",
        "Delete Successfull",
        "Enter valid contact number"
      ]
      const [error, setError] = useState([]);
      const [erroVisible, setErrorVisible] = useState("none");
      const [backgroundColor, setBackgroundColor] = useState("#fae0e4")
      const [borderColor, setBorderColor] = useState("#ff0a54")
      const [fontColor, setFontColor] = useState("#ff0a54")
      const [iconColor, setIconColor] = useState("#ff0a54")

      const [companyTableData, setCompanyTableData] = useState([]);
      const [companyName, setCompanyName] = useState('');
      const [contactNumber, setContactNumber] = useState('');
      const [companyID, setCompanyID] = useState(null);

      const [addBtn, setAddBtn] = useState("");

      const navigate = useNavigate();
      const jwtToken = localStorage.getItem("jwtToken");

      //Checking user loggin or not
      useEffect(()=>{
        if(!jwtToken){
            navigate("/");
        }
      })

      const getPurchaseCompany = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseCompany/companies`);
          setCompanyTableData(res.data);
        } catch (err) {
            setErrorVisible("block");
            setError(errorType[0]);
            setBackgroundColor("#fae0e4");
            setBorderColor("#ff0a54");
            setFontColor("#ff0a54");
            setIconColor("#ff0a54");

            setTimeout(()=>{
                setErrorVisible("none");
            },5000);
        }
      };
    
      useEffect(() => {
        getPurchaseCompany();
      }, []); // Empty dependency array to run the effect only once
    
      const handleInsuranceAddBtn = async () => {
        try {
            if (!companyName || !contactNumber) {
                setErrorVisible("block");
                setError(errorType[1]);
                setBackgroundColor("#fae0e4");
                setBorderColor("#ff0a54");
                setFontColor("#ff0a54");
                setIconColor("#ff0a54");
    
                setTimeout(()=>{
                    setErrorVisible("none");
                },2000);
            }else if(contactNumber.length != 10){
                setErrorVisible("block");
                setError(errorType[6]);
                setBackgroundColor("#fae0e4");
                setBorderColor("#ff0a54");
                setFontColor("#ff0a54");
                setIconColor("#ff0a54");
    
                setTimeout(()=>{
                    setErrorVisible("none");
                },2000);
            }
             else {
              const formData = {companyName, contactNumber}
        
              await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseCompany/createPurchaseCompany`, formData);
              setErrorVisible("block");
              setError(errorType[3]);
              setBackgroundColor("#C6F6D5");
              setBorderColor("#2F855A");
              setFontColor("#2F855A");
              setIconColor("#2F855A");
              setTimeout(() => {
                setErrorVisible("none");
              }, 1500);
        
              setCompanyName("");
              setContactNumber("");
              getPurchaseCompany();
            }
        } catch (err) {
            setErrorVisible("block");
            setError(errorType[1]);
            setBackgroundColor("#fae0e4");
            setBorderColor("#ff0a54");
            setFontColor("#ff0a54");
            setIconColor("#ff0a54");

            setTimeout(()=>{
                setErrorVisible("none");
            },2000);
        }
        
      }

      const handleEdit = (companyID) => {
        const selectedInsurance = companyTableData.find((data) => data.companyID === companyID);
      
        if (selectedInsurance) {
          setCompanyName(selectedInsurance.companyName);
          setContactNumber(selectedInsurance.contactNumber);
          setCompanyID(selectedInsurance.companyID);
          setAddBtn("none");
        } else {
          console.error("Purchase Entry not found");
        }
      };
      

      const handleUpdate=async(companyID)=>{
        const updateFormData = {companyName, contactNumber}
        if (!companyName || !contactNumber) {
            setErrorVisible("block");
            setError(errorType[1]);
            setBackgroundColor("#fae0e4");
            setBorderColor("#ff0a54");
            setFontColor("#ff0a54");
            setIconColor("#ff0a54");

            setTimeout(()=>{
                setErrorVisible("none");
            },2000);
        }else if(contactNumber.length != 10){
            setErrorVisible("block");
            setError(errorType[6]);
            setBackgroundColor("#fae0e4");
            setBorderColor("#ff0a54");
            setFontColor("#ff0a54");
            setIconColor("#ff0a54");

            setTimeout(()=>{
                setErrorVisible("none");
            },2000);
        }
        else{
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseCompany/updatePurchaseCompany/${companyID}`, updateFormData)
            .then((res)=>{
                setErrorVisible("block");
                setError(errorType[4]);
                setBackgroundColor("#C6F6D5");
                setBorderColor("#2F855A");
                setFontColor("#2F855A");
                setIconColor("#2F855A");
                setTimeout(() => {
                    setErrorVisible("none");
                }, 1500);

                getPurchaseCompany();
                setCompanyID(null);
                setCompanyName("");
                setContactNumber("");
                setAddBtn("");
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
      }
    const handleDelete = async(companyID)=>{
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseCompany/deletePurchaseCompany/${companyID}`)
        .then((res)=>{
            getPurchaseCompany();
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
      
  return (
    <div className='createEstimateContainer'>
    <Drawer/>
    <div className="estimateContainer">
        <Navbar  text="Add Purchase Company"/>
        <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/>
        <div className="vehiclesContainer">
            <div className="addVehicleSection">
                <form action="">
                    <div className='vehicleInputSection' style={{marginBottom:"10px"}}>
                        <label htmlFor="">Purchase Company Name:</label>
                        <input type="text"  className='vehicleFields' placeholder='Enter Company Name' value={companyName} onChange={(e)=>{
                            setCompanyName(e.target.value)
                        }}/>
                    </div>
                    <div className='vehicleInputSection' style={{marginBottom:"10px"}}>
                        <label htmlFor="">Contact No:</label>
                        <input type="text"  className='vehicleFields' placeholder='Enter Contact No' value={contactNumber} onChange={(e)=>{
                            setContactNumber(e.target.value)
                        }}/>
                    </div>
                </form>
                <button className='vehicleAddBtn' onClick={handleInsuranceAddBtn} style={{display:addBtn}}>Add</button>
            </div>
            <div className="vehiclesSection">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Contact No</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            {companyTableData.map((data, index)=>(
                                <tr key={index}>
                                    <td>{data.companyName}</td>
                                    <td>{data.contactNumber}</td>
                                    <td>
                                        <div className="tableBtn">
                                            <div className="tableBtn">
                                                {companyID === data.companyID ? (
                                                    <>
                                                    <button className='tableUpdateBtn' onClick={() => {handleUpdate(data.companyID) }}>Update</button>
                                                    </>
                                                ) : (
                                                    <>
                                                    <button className='editBtn' onClick={() => {handleEdit(data.companyID) }}>Edit</button>
                                                    <button className='deleteBtn' onClick={() => {handleDelete(data.companyID) }}>Delete</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                 </tr>
                            ))
                            }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
  )
}

export default PurchaseCompany
