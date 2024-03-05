import './addNewInvoiceItemModel.css'
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import axios from 'axios';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ProductModel from './ProductModel';

const AddNewInvoiceItemModel = (props) => {
    const [itemOption, setItemOption] = useState([]);

    const [selectedOption, setSelectedOption] = useState(null);
    const [insurancePrice, setInsurancePrice] = useState(0.00);
    const [itemValue, setItemValue] = useState('');

      //Product Model
    const [openProductModel, setOpenProductModel] = useState(false);
    const [isItemModelDisplay, setIsItemModelDisplay] = useState('')

    useEffect(()=>{
        const fetchItems=async()=>{
            await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/estimate/items`)
            .then((res)=>{
                const formattedOptions = res.data.map((item)=>({
                    value: item.itemName,
                    label: item.itemName
                }));
                setItemOption(formattedOptions);
            }).catch((err)=>{
                console.log(err.message)
            })
        }
        fetchItems();
    },[openProductModel])

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
      };

    const handleNewItemAddBtn=async(e)=>{
        e.preventDefault();

        const tableCategory = props.tableCategory;
        const jobID = props.invoiceJobID;
        console.log(props)
        const itemName = selectedOption.value;

        const formData = {tableCategory, itemName, itemValue, insurancePrice, jobID}
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/addNewItem`, formData)
        .then((res)=>{
            props.closeItemModel(false)
            setItemOption(null);
            setItemValue('');
            setInsurancePrice('')
        }).catch((err)=>{
            alert(err.message)
        })
    }
    const handleProductModel=()=>{
        setOpenProductModel(false);
        setIsItemModelDisplay('');
    }
  return (
    <div className='itemModalBackground' >
        <div style={{display:"flex", justifyContent:"space-between"}}>
            <h3 className='newItemModelTitle'>{props.modelName}</h3>
            {/* Create product model pop up window */}
            <div className="addNewProductItem">
                  <div style={{color: "#006d77"}} onClick={()=>{
                    setOpenProductModel(true)
                    setIsItemModelDisplay('none');
                  }}>
                    <LibraryAddIcon/>
                  </div>
                  {openProductModel && (
                    <ProductModel closeModel={handleProductModel}/>
                  )}
                </div>
            <div onClick={()=>{props.closeItemModel(false)}}><CloseIcon/></div>
        </div>
        <div className="objectSection" style={{display:isItemModelDisplay}}>
            <Select
                options={itemOption}
                isSearchable={true}
                placeholder="Select Item"
                className='selectedOptions'
                name='itemName'
                value={selectedOption || ''}
                onChange={handleSelectChange}
            />
            <input 
                type="text" 
                placeholder='Insurance Price' 
                className='priceText'  
                name='itemValue' 
                style={{width:"10rem"}}
                onChange={(e)=>{
                    setInsurancePrice(e.target.value)
                }}
            />
            <div style={{display:props.typeOptionDisable}}>
                <select 
                className='priceText' 
                name='itemValue'
                style={{borderRadius:"5px", 
                marginLeft:"10px", 
                border:"1px solid darkgoldenrod"}}
                onChange={(e)=>{
                    setItemValue(e.target.value)
                }}
                >
                    <option value="" selected>Type</option>
                    <option value="MR">MR</option>
                    <option value="RC">RC</option>
                    <option value="SH">SH</option>
                    <option value="AP">AP</option>
                    <option value="NN">NN</option>
                    <option value="NC">NC</option>
                    <option value="DELETE">DELETE</option>
                    <option value="ND">ND</option>
                </select>
            </div>
            <button className='addBtn' onClick={handleNewItemAddBtn}>Add</button>
        </div>
    </div>
  )
}

export default AddNewInvoiceItemModel
