import './jobReport.css'
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import logoImage from '../../../../src/assets/paintCorner.jpg'
import sectionImage from '../../../../src/assets/section1.jpg'
import axios from 'axios';

const JobReport = () => {
    const [jobNo, setJobNo] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [insuranceName, setInsuranceName] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [inputDate, setInputDate] = useState('');

    const jwtToken = localStorage.getItem("jwtToken");
    const navigate = useNavigate();

    useEffect(()=>{
        if(!jwtToken){
            navigate('/');
        }
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/jobCard`)
        .then((res)=>{
            const result = res.data[0];

            setJobNo(result.jobID);
            setVehicleNo(result.vehicleNo);
            setInsuranceName(result.insuranceName);
            setMake(result.vehicleMake);
            setModel(result.vehicleModel);
            setAddress(result.customerAddress);
            setContact(result.customerMobile);
            setInputDate(result.inDate);
        })
    },[jwtToken])

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
  return (
    <div className='jobCardSectionContainer'>
        <div ref={componentRef} className='jobCardMainContainer'> 
            <div className="jobCardContainer">
                <div style={{width:"70%"}}>
                    <div className="jobReportHeading">
                        <img src={logoImage} alt="Paint Corner" style={{width:"10rem", height:"5rem"}}/>
                        <div className='jobCardDetails'>
                            <h1 className='jobCard'>JOB CARD</h1>
                            <p className='jobNo'>JOB NO :- <span style={{fontWeight:"bold", color:"red"}}>{jobNo}</span></p>
                        </div>
                    </div>
                    <hr />
                    <form action="" style={{marginTop:"10px"}}>
                        <div className='details'>
                            <label htmlFor="">Vehicle No:</label>
                            <input type="text" value={vehicleNo} className='reportField'/>
                        </div>
                        <div className='details'> 
                            <label htmlFor="">Insurance Co:</label>
                            <input type="text"value={insuranceName} className='reportField'/>
                        </div>
                        <div className='details'>
                            <label htmlFor="">Make:</label>
                            <input type="text"value={make} className='reportField'/>
                        </div>
                        <div className='details'>
                            <label htmlFor="">Model:</label>
                            <input type="text"value={model} className='reportField'/>
                        </div>
                        <div className='details' style={{display:"flex"}}>
                            <label htmlFor="">Address:</label>
                            <textarea value={address} cols="23" rows="3" className='addressFiled'></textarea>
                        </div>
                        <div className='details'>
                            <label htmlFor="">Contact No:</label>
                            <input type="text"value={contact} className='reportField'/>
                        </div>
                        <div className='details'>
                            <label htmlFor="">Input:</label>
                            <input type="text"value={inputDate} className='reportField'/>
                        </div>
                        <div className='details'>
                            <label htmlFor="">Output:</label>
                            <input type="text"value={""} className='reportField'/>
                        </div>
                    </form>
                    <div className="table">
                    <table border="1">
                        <thead>
                            <tr>
                                <td>Polish</td>
                                <th colSpan="2" width="150px"></th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Repair Section</td>
                                <td colSpan="2"></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Paint Section</td>
                                <td width="30px"></td>
                                <td width="100px"></td>
                                <td width="100px"></td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
                <div style={{border:"1px solid black", padding:"10px", width:"40%"}}>
                    <p>SPARE PARTS</p>
                    <div className="sparePartsConatiner">
                        <div style={{padding:"10px"}}>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>

                        </div>
                        <div style={{padding:"10px"}}>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>
                            <p>...........................</p>

                        </div>
                    </div>
                </div>
            </div>
            <div className='signatureBox'>
                <p>........................................................</p>
                <p>Service Advisor Signature</p>
            </div>
            <div className="section">
                <div style={{border:"1px solid black", padding:"10px"}}>
                    <h2 className='sectionName'>DENTING SECTION</h2>
                    <img src={sectionImage} alt="" height="310px" width="370px"/>
                </div>
                <div style={{border:"1px solid black", padding:"10px"}}>
                    <h2 className='sectionName'>PAINTING SECTION</h2>
                    <img src={sectionImage} alt="" height="310px"  width="370px"/>
                </div>
            </div>
            <div className='DRsection'>
                <div style={{border:"1px solid black", marginRight:"10px", padding:"5px"}}>
                    <p><span style={{fontSize:"20px", fontWeight:"bold"}}>DR</span> with Inner Panel.......................................</p>
                    <p>.............................................................................</p>
                    <p>.............................................................................</p>
                    <p>.............................................................................</p>
                </div>
                <div style={{border:"1px solid black", marginRight:"10px", padding:"5px"}}> 
                    <p><span style={{fontSize:"20px", fontWeight:"bold"}}>DR</span> with Inner Panel.......................................</p>
                    <p>.............................................................................</p>
                    <p>.............................................................................</p>
                    <p>.............................................................................</p>
                </div>
            </div>
            <div className="commentsSection">
                <p>Comments</p>
                <p>............................................................................................................................................................................</p>
                <p>............................................................................................................................................................................</p>
            </div>
            <div className="secondPage">
                <h3 className='secondPageTitle'>PREPERATION COST & OTHER EXPENSES</h3>
                <div className="tableSectionConatiner">
                    <div className="costTables">
                        <table border="1">
                            <thead>
                                <tr>
                                    <td colSpan={3} style={{textAlign:"center", fontWeight:"bold"}}>PRINTING COST</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{fontSize:"14px"}}>
                                    <td  style={{width:"12rem"}}></td>
                                    <td style={{width:"7rem", textAlign:"center", fontWeight:"bold"}}>QUANTITY</td>
                                    <td style={{width:"7rem", textAlign:"center", fontWeight:"bold"}}>PRICE</td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Cataloy (Local)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>Sanding Paper             80</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                   120</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                   180</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                   320</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                   400</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                   600</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                   800</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                  1000</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                  1500</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                  2000</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td><pre>            -                  2500</pre></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Sanding Disk</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Filter (ml)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Paint + Peal Colour</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Lacquer</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Tiner (2k)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Tiner (N/C)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Cotton lace</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Tec Cloth</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Filter</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Masking Tape</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Paper + Polythene Roll</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Filter Dust Cord</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Vehicle Interior - Cut & Polish Cost</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Combi</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td style={{height:"27px"}}></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                <td style={{height:"27px"}}></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Painter Cost</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td colSpan={2} style={{textAlign:"center", fontWeight:"bold"}}>TOTAL =</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="painerSignature">
                            <p>........................................</p>
                            <p>Painter Signature</p>
                        </div>
                    </div>
                    <div className="costTables">
                    <table border="1">
                            <thead>
                                <tr>
                                    <td colSpan={3} style={{textAlign:"center", fontWeight:"bold"}}>DENTING COST</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{fontSize:"14px"}}>
                                    <td  style={{width:"12rem"}}></td>
                                    <td style={{width:"7rem", textAlign:"center", fontWeight:"bold"}}>QUANTITY</td>
                                    <td style={{width:"7rem", textAlign:"center", fontWeight:"bold"}}>PRICE</td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Cutting Disk</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Flap Disk</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Nut & Bolt</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Clips</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Plastic Welding Net</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Acetylene & Oxygen</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Stapler Pin</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Grinding Disk</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Washer</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Mig Welding (ft)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Dent Puller Machine (min)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Body Sealer</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>AC Re-gas & Repair</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Coolant</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Double Tape</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Rivet</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Bulb</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td style={{height:"27px"}}></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td style={{height:"27px"}}></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td style={{height:"27px"}}></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td>Denter Cost</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style={{fontSize:"14px"}}>
                                    <td colSpan={2} style={{textAlign:"center", fontWeight:"bold"}}>TOTAL =</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="painerSignature">
                            <p>........................................</p>
                            <p>Denter Signature</p>
                        </div>
                        <div className="billContainer">
                            <p style={{fontSize:"13px", fontWeight:"bold"}}>Varies depending on the number of vehicles arriving per month</p>
                            <table>
                                    <tr>
                                        <td style={{width:"16rem"}}>Electricity Bill</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{width:"16rem"}}>Building Rent</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{width:"16rem"}}>Meals</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{width:"16rem"}}>Tax</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{width:"16rem"}}>Commission</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{width:"16rem"}}>Maintaince</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{width:"16rem"}}>Document Charges</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{width:"16rem", textAlign:"end", fontWeight:"bold"}}>Total =</td>
                                        <td></td>
                                    </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="jobCardBtnSection">
            <Link to="/new-job"><button className='jobBackBtn'>Back</button></Link>
            <button className='jobPrintBtn' onClick={handlePrint}>Print</button>
        </div>
    </div>
  )
}

export default JobReport
