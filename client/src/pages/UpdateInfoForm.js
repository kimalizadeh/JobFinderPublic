import React from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useEffect, useState, useContext} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { setNestedObjectValues } from 'formik';
//import {withRouter} from 'react-router-dom';
//import { withRouter } from 'react-router'
import { toast } from 'react-toastify';

function UpdateInfoForm({preloadedValues}) {
    let { id } = useParams();
    const [error, setError] = useState("");



    // }, []);

    //console.log(itemObject.email);
    console.log(preloadedValues);

    const successAlert = () => {
        // window.alert("Invalid Credentials");
        toast("Your Personal Info updated successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
    
        });
    }
    

    const {register, handleSubmit, formState: {errors} } = useForm({
        mode: "all",
        defaultValues: preloadedValues
    });
     let history = useNavigate();


    const onSubmit = (data) => {
        axios.put(`https://jobfinder-fsd01.herokuapp.com/users/updateaccount/${id}`, data,
        {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) =>{
            console.log(response.data)
            if(response.data.error) {
                setError(response.data.error)

            } else {
                history(`/account/${id}`);
                successAlert();
            }

        });
    }; 

    return (
    <div className="container border border-1">
            <h3>Modify User Information</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group ">
                    <div className="text-danger">{error}</div>
                <p className="text-danger">{errors.email?.message}</p>
                <label>Email:</label>
                <input 
                className="form-control col-3 mb-3" type="email" {...register ("email", {
                    required: "Email should be entered", 
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "invalid email address"
                      },
                    maxLength: {value: 250, message: "Max length is 250"}
                    })} 
                    placeholder="Ex. email@gmail.com"/>
                <p className="text-danger">{errors.password?.message}</p>
                <label>Password:</label>
                <input className="form-control col-4 mb-4" type="password" {...register ("password", {
                    required: "Password is required", 
                    minLength: {value: 4, message: "Length cannot be less than 4 characters"},
                    maxLength: {value: 200, message: "Length cannot be higher than 200 characters"}
                    })} />
                <p className="text-danger">{errors.name?.message}</p>
                <label>Name:</label>
                <input className="form-control col-4 mb-4" {...register ("name", {
                    required: "Name should be entered",
                    minLength: {value: 4, message: "Length cannot be less than 4 characters"},
                    maxLength: {value: 200, message: "Length cannot be higher than 200 characters"}
                })}  placeholder="John Smith"/>
                <p className="text-danger">{errors.role?.message}</p>
                {/* <label>Role:</label>
                <select className = "form-control" {...register ("role", {
                    required: "Role is required", 
                })}>
                    <option value="">Please Choose a province...</option>
                    <option value="Employer">Employer</option>
                    <option value="Employee">Employee</option>
                </select> */}


                <p className="text-danger">{errors.province?.message}</p>
                <label>Province:</label>
                <select className = "form-control" {...register ("province", {
                    required: "Please choose your province"
                })}>
                    <option value="">Choose your province...</option>
                    <option value="QC">QC</option>
                    <option value="ON">ON</option>
                    <option value="BC">BC</option>
                </select>

                <p className="text-danger">{errors.city?.message}</p>
                <label>City:</label>
                <input className="form-control col-4 mb-4" {...register ("city", {
                    required: "City should be entered", 
                    minLength: {value: 4, message: "Length cannot be less than 4 characters"},
                    maxLength: {value: 200, message: "Length cannot be more than 200 characters"}
                    })} placeholder="Ex. Toronto" />
                <button type="submit" className="btn btn-primary green-btn">Update Your Info</button>
                </div>
            </form>

  
        </div>
    )
}

export default UpdateInfoForm
