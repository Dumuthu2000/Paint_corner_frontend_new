import React from 'react'
import { useState, useEffect } from 'react';
import './productModel.css'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ProductModel = (props) => {
    const [itemName, setItemName] = useState('');

    const errorType = ['Item Name is required', 'New Item added successfully']
    const [error, setError] = useState([]);
    const [erroVisible, setErrorVisible] = useState("none");
    const [backgroundColor, setBackgroundColor] = useState("#fae0e4")
    const [borderColor, setBorderColor] = useState("#ff0a54")
    const [fontColor, setFontColor] = useState("#ff0a54")

    const handleAddItemBtn=async()=>{
        if (!itemName) {
            setErrorVisible("block");
            setError(errorType[0]);
            setBackgroundColor("#fae0e4");
            setBorderColor("#ff0a54");
            setFontColor("#ff0a54");

            setTimeout(()=>{
                setErrorVisible("none");
            },2000);
        }else{
            const formData = {itemName}
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/parts/addParts`, formData);
            setErrorVisible("block");
            setError(errorType[1]);
            setBackgroundColor("#C6F6D5");
            setBorderColor("#2F855A");
            setFontColor("#2F855A");
        }
    }
    useEffect(() => {
        if (error === errorType[1]) {
            setTimeout(() => {
                setErrorVisible("none");
                setItemName('');
            }, 1500);
        }
    }, [error]);
  return (
    <div className='modalBackground '>
      <div className="modalContainer">
      <div className="errorContainers" style={{border:`2px solid ${borderColor}`, backgroundColor:backgroundColor, color:fontColor, display:erroVisible}}>
        {error}
      </div>
        <div className="titleSection">
            <h4 className='popupTitle'>Add New Product Item</h4>
            <div style={{textAlign:"end", fontWeight:"bold"}} onClick={()=>{props.closeModel(false)}}><CloseIcon/></div>
        </div>
        <div className="bodySection">
            <label style={{fontSize:"18px"}}>Item Name: </label>
            <input type="text" className='itemAddInput' required placeholder='Enter item name' onChange={(e)=>{
                setItemName(e.target.value)
            }}/>
        </div>
        <div className="footerSection">
            <button className='closeBtnForProduct' onClick={()=>{props.closeModel(false)}}>Close</button>
            <button className='addBtnForProduct' onClick={handleAddItemBtn}>Add</button>
        </div>
      </div>
    </div>
  )
}

export default ProductModel
