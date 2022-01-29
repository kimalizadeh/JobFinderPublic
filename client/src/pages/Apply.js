import React from 'react';
import axios from "axios";
import { useNavigate, withRouter } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';


const FormData = require('form-data');




function Apply() {

    let { jobId } = useParams();

    const {register, handleSubmit, formState: {errors, isValid} } = useForm({

        defaultValues: {
            experience: "0-2",
            education: "High School",

        }
    });

    const [error, setError] = useState("");
    let history = useNavigate();
    const [job, setJob] = useState({});
    const [authState, setAuthState] = useState({email: "", id: 0, status: false, role: "", name:""});

    const successAlert = () => {
        // window.alert("Invalid Credentials");
        toast("Your application was submitted!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
    
        });
    }

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

    useEffect(() => {


        axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/${jobId}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }).then((response) => {
            setJob(response.data);
    
        });



      }, []);

    const onSubmit = (data) => {

        const formData = new FormData();
        formData.append("resume", data.resume[0]);
        formData.append("experience", data.experience);
        formData.append("education", data.education);


        axios.post(`https://jobfinder-fsd01.herokuapp.com/applications/${jobId}`, formData, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }).then((response) => {

            if(response.data.error) {
                setError(response.data.error);
                console.log(error)
            } else {
                successAlert();
                history(`/employee/${authState.id}`);
            }
            

        }) 
    }

    return (
        <div className="container">
            <h3>Apply for {job.jobTitle} at {job.company}</h3>

            <form className="formContainer" encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
            <label>Years of Experience: </label>
            <div className="col-5 m-auto">
            <p className="text-danger">{errors.experience?.message}</p>
                <select className="form-control" {...register ("experience", {
                    required: "Years of experience is required", 
                })}>
                    <option value="" >Choose Years of Experience..</option>
                    <option value="0-2">0-2</option>
                    <option value="2-5">2-5</option>
                    <option value="5+">5+</option>
                </select>
                </div>
                <div className="col-5 m-auto">
                <label>Education: </label>
                <p className="text-danger">{errors.education?.message}</p>
                <select data-testid="filter-input-education" className = "form-control" {...register ("education", {
                    required: "Education is required", 
                })}>
                    <option value="" >Choose Education..</option>
                    <option value="High School">High School</option>
                    <option value="College">College</option>
                    <option value="University">University</option>
                </select>
                </div>
                <div className = "form-control" className="col-5 m-auto">
                <label>Resume: </label>
                <p className="text-danger">{errors.resume?.message}</p>
                <span className="text-danger form-text">{error}</span>
                
                <input className="form-control" type="file" {...register("resume", {required: "You must upload a file"})} accept="application/pdf" />
                </div>


                <input className="btn btn-space" type="submit" />

                
            </form>



        </div>
    )
}

export default Apply
