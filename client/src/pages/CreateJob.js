import React from 'react'
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toast } from 'react-toastify';


function CreateJob() {

    const MAXSTEPS = 3;


    let history = useNavigate();

    const [ckDescription, setCKDescription] = useState("");
    const [error, setError] = useState("");
    const [formStep, setFormStep] = useState(0);
    const { watch } = useForm();
    const [authState, setAuthState] = useState({email: "", id: 0, status: false, role: "", name:""});


    useEffect(() =>{
        axios
          .get("https://jobfinder-fsd01.herokuapp.com/users/auth", {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
        }).then((response)=>{
          if (response.data.error) {
            setAuthState({...authState,status:false});
          } else {
            setAuthState({
              email: response.data.email,
              id: response.data.id,
              status: true,
              role: response.data.role,
              name: response.data.name
            });    
          }
        });

      },[]);
    

    const completeFormStep = () => {
        setFormStep(curr => curr + 1)

    }

    const {register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode: "all",
        defaultValues: {
            jobTitle: "",
            company: "",
            salary: "",
            category: "",
            jobType: "",
            province: "",
            city: "",
            expiryDate: ""
        }
    });

    const onSubmit = (data) => {
        data.description = ckDescription;
        console.log(data);
        axios.post("https://jobfinder-fsd01.herokuapp.com/jobs", data,             {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }).then((response) => {
            if(response.data.error) {
                setError(response.data.error);
            } else {
                if(authState.role == "Employer") {
                    history("/employer");

                } else {
                    history("/admin/jobs");
                }
                successAlert();
                
            }

        }) 
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
        toast("Job posted successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
    
        });
    }





    return (
        <div>
            <h1>Create A Job</h1>
            <form className="formContainer col-5 m-auto rounded border" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-5 m-auto ">


                <div className="d-inline-flex p-2 text-muted">
                    {formStep > 0 && (
                        <button onClick={goToPreviousStep} type="button" className="btn btn-secondary btn-sm m-2" data-toggle="tooltip">
                            <ChevronLeftIcon fontSize="small"/>
                        </button>
                    )}
                    <p >Step {formStep + 1} of {MAXSTEPS}</p>
                </div>
                <div className="progressbar">
                    <div style={{ width: formStep === 0 ? "33.3%" : formStep === 1 ? "66.6%" : "100%"}}></div>

                </div>
            
            
            
            <span className="text-danger form-text">{error}</span>

                {formStep === 0 && (<section>
                <p className="text-danger">{errors.jobTitle?.message}</p>
                <label>Job Title:</label>
                <input  className="form-control"
                {...register ("jobTitle", {
                    required: "Job title is required", 
                    minLength: {value: 5, message: "Min length is 5 characters"},
                    maxLength: {value: 250, message: "Max length is 250"}
                    })} 
                     />
                <p className="text-danger">{errors.company?.message}</p>
                <label>Company:</label>
                <input className="form-control"
                {...register ("company", {
                    required: "Company is required", 
                    minLength: {value: 2, message: "Min length is 2 characters"},
                    maxLength: {value: 200, message: "Max length is 200 characters"}
                    })} />
                <p className="text-danger">{errors.salary?.message}</p>
                <label>Salary:</label>
                <input className="form-control"
                type="number" min="1" max="1000000" {...register ("salary", {
                    required: "Salary is required",
                })} />
                <p className="text-danger">{errors.category?.message}</p>
                <label>Category:</label>
                <select className="form-control"
                {...register ("category", {
                    required: "Category is required", 
                })}>
                    <option value="">Chose a category</option>
                    <option value="IT">IT</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="General">General</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Art">Art</option>
                </select>

                <p className="text-danger">{errors.jobType?.message}</p>
                <label>Job Type:</label>
                <select className="form-control"
                {...register ("jobType", {
                    required: "Job Type is required"
                })}>
                    <option value="">Chose a job type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                </select><br/>
                </section>)}



                {formStep === 1 && (<section>   
                <p className="text-danger">{errors.province?.message}</p>
                <label>Province:</label>
                <select className="form-control" {...register ("province", {
                    required: "Province is required"
                })}>
                    <option value="">Chose a province</option>
                    <option value="QC">QC</option>
                    <option value="ON">ON</option>
                    <option value="BC">BC</option>
                </select>

                <p className="text-danger">{errors.city?.message}</p>
                <label>City:</label>
                <input className="form-control"
                {...register ("city", {
                    required: "City is required", 
                    minLength: {value: 2, message: "Min length is 2 characters"},
                    maxLength: {value: 200, message: "Max length is 200 characters"}
                    })} placeholder="E.g. Montreal" />

                <p className="text-danger">{errors.expiryDate?.message}</p>
                <label>Expiry Date:</label>
                <input className="form-control"
                type="date" {...register ("expiryDate", {
                    required: "Expiry Date is required"
                })} />
                </section>)}

                {formStep === 2 && (<section> 
                <p className="text-danger">{errors.description?.message}</p>
                
                <div className="container-sm">

                <CKEditor  editor={ClassicEditor} onReady={editor=> {}} config={{removePlugins: ["EasyImage","ImageUpload","MediaEmbed"]}}   
                
                onChange={handleCKEditorState}
                />
                </div>
                </section>)}

                {renderButton()}


            </div>
            </form>
            

  
        </div>
    )
}

export default CreateJob









