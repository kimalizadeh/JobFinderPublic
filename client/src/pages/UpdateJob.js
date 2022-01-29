import React from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useEffect, useState, useContext} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
//import {withRouter} from 'react-router-dom
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toast } from 'react-toastify';


function UpdateJob({preloadedValues}) {

    let { id } = useParams();
    console.log("Something")
    console.log(preloadedValues.id);

    
    const MAXSTEPS = 3;


    let history = useNavigate();

    const [ckDescription, setCKDescription] = useState(preloadedValues.description);
    console.log(preloadedValues.description);
    const [error, setError] = useState("");
    const [formStep, setFormStep] = useState(0);
    const { watch } = useForm();
    

    const completeFormStep = () => {
        setFormStep(curr => curr + 1)

    }

    const handleCKEditorState = (event, editor) => {
        const ckdata = editor.getData();
        // console.log(ckdata);
        setCKDescription(ckdata);

    }

    const renderButton = () => {

        if (formStep < 2) {
            return (
            <button className="btn btn-primary btn-space"
            disabled={!isValid} 
            onClick={completeFormStep}
            type="button">
            Next Step
            </button>)
        } else {
            return(
            <input
            disabled={!isValid} 
            type="submit"
            />)
        }
    }

    const goToPreviousStep = () => {
        setFormStep(curr => curr - 1);

    }

    const successAlert = () => {
        // window.alert("Invalid Credentials");
        toast("Job updated successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
    
        });
    }

  

    const {register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode:"all",
         defaultValues: preloadedValues, 
    });

    const onSubmit = (data) => {
        data.description = ckDescription;
        axios.put(`https://jobfinder-fsd01.herokuapp.com/jobs/admin/${id}`, data,
        {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) =>{
            if(response.data.error) {
                setError(response.data.error);
            } else {
            console.log(response.data);
            console.log(response.data.description);
            history("/admin/jobs");
            successAlert();
        }
        });
    }; 

    return (
    <div className="container border border-1">

            <h3>Modify Job Information</h3>
            <span className="text-danger ">{error}</span>
            <form className="container" onSubmit={handleSubmit(onSubmit)}>


                <div className="d-inline-flex p-2 text-muted">
                    {formStep > 0 && (
                        <button onClick={goToPreviousStep} type="button" class="btn btn-secondary btn-sm m-2" data-toggle="tooltip">
                            <ChevronLeftIcon fontSize="small"/>
                        </button>
                    )}
                    <p >Step {formStep + 1} of {MAXSTEPS}</p>
                </div>
                <div className="progressbar">
                    <div style={{ width: formStep === 0 ? "33.3%" : formStep === 1 ? "66.6%" : "100%"}}></div>

                </div>
            
            
            
            {/* <span className="text-danger form-text">{error}</span> */}

                {formStep === 0 && (<section>
                <p className="text-danger">{errors.jobTitle?.message}</p>
                <label>Job Title:</label>
                <input {...register ("jobTitle", {
                    required: "Job title is required", 
                    minLength: {value: 5, message: "Min length is 5 characters"},
                    maxLength: {value: 250, message: "Max length is 250"}
                    })} 
                     />
                <p className="text-danger">{errors.company?.message}</p>
                <label>Company:</label>
                <input {...register ("company", {
                    required: "Company is required", 
                    minLength: {value: 2, message: "Min length is 2 characters"},
                    maxLength: {value: 200, message: "Max length is 200 characters"}
                    })} />
                <p className="text-danger">{errors.salary?.message}</p>
                <label>Salary:</label>
                <input type="number" min="1" max="1000000" {...register ("salary", {
                    required: "Salary is required",
                })} />
                <p className="text-danger">{errors.category?.message}</p>
                <label>Category:</label>
                <select {...register ("category", {
                    required: "Category is required", 
                })}>
                    <option value="IT">IT</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="General">General</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Art">Art</option>
                </select>

                <p className="text-danger">{errors.jobType?.message}</p>
                <label>Job Type:</label>
                <select {...register ("jobType", {
                    required: "Job Type is required"
                })}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                </select>
                </section>)}



                {formStep === 1 && (<section>   
                <p className="text-danger">{errors.province?.message}</p>
                <label>Province:</label>
                <select {...register ("province", {
                    required: "Province is required"
                })}>
                    <option value="QC">QC</option>
                    <option value="ON">ON</option>
                    <option value="BC">BC</option>
                </select>

                <p className="text-danger">{errors.city?.message}</p>
                <label>City:</label>
                <input {...register ("city", {
                    required: "City is required", 
                    minLength: {value: 2, message: "Min length is 2 characters"},
                    maxLength: {value: 200, message: "Max length is 200 characters"}
                    })} placeholder="Montreal" />

                <p className="text-danger">{errors.expiryDate?.message}</p>
                <label>Expiry Date:</label>
                <input type="date" {...register ("expiryDate", {
                    required: "Expiry Date is required"
                })} />
                </section>)}

                {formStep === 2 && (<section> 
                <p className="text-danger">{errors.description?.message}</p>
                
                <div className="container-sm">
                    
                <CKEditor data={ckDescription} editor={ClassicEditor} onReady={editor=> {}} config={{removePlugins: ["EasyImage","ImageUpload","MediaEmbed"]}}
                
                onChange={handleCKEditorState}
                />
                </div>
                </section>)}

                {renderButton()}


            </form>
            {/* <div>{parse(ckDescription)}</div> */}

  
        </div>
    )
}


export default UpdateJob
