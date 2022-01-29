import React from 'react';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import FormikControl from '../components/FormikControl';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


function Registration() {

    const [error, setError] = useState("");



    const {register, handleSubmit, formState: {errors} } = useForm({
        defaultValues: {
            email: "",
            password: "",
            name: "",
            role: "",
            province: "",
            city: "",
        }
    });
     let history = useNavigate();


         const successUserAddAlert = () => {
        // window.alert("Invalid Credentials");
        toast("New user added successfully!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
    
        });
    }

    // const role = [
    //     { key: 'Select a role', value: '' },
    //     { key: 'Employer', value: 'Employer' },
    //     { key: 'Employee', value: 'Employee' }
    //   ]

    //   const province = [
    //     { key: 'Select a province', value: '' },
    //     { key: 'QC', value: 'QC' },
    //     { key: 'ON', value: 'ON' },
    //     { key: 'BC', value: 'BC' }
    //   ]

    // const initialValues = {
    //     email: "",
    //     password : "",
    //     name: "",
    //     role: "",
    //     province: "",
    //     city: ""

    // }

    // const validationSchema = Yup.object().shape({
    //     email:  Yup.string().max(250).email("Enter a valid email").required("You must input an email"),
    //     password: Yup.string().min(4).max(200).required(),
    //     name: Yup.string().min(2).max(200).matches(/^[a-zA-Z0-9-. ]+$/ , 'name should only contains characters and numbers').required(),
    //     role: Yup.string().required('Required'),
    //     province: Yup.string().required('Required'),
    //     city: Yup.string().min(2).max(200).matches(/^[a-zA-Z0-9-. ]+$/ , 'name should only contains characters and numbers').required(),
    // });

    const onSubmit = (data) => {
        axios.post("https://jobfinder-fsd01.herokuapp.com/users", data).then((response) =>{
            console.log(response.data)

            if(response.data.error) {
                setError(response.data.error);
            } else {
                if(localStorage.getItem("accessToken")){
                    successUserAddAlert();
                    history("/manageusers");
                    window.location.reload(false);
                }else{
                    successAlert();
                    history("/login");
                }
                
            }


        });
    };
    
    const successAlert = () => {
        // window.alert("Invalid Credentials");
        toast("Your accout was created!", {
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
    //     <Formik
    //   initialValues={initialValues}
    //   validationSchema={validationSchema}
    //   onSubmit={onSubmit}
    // >
    //   {formik => (
    //     <Form>
    //       <FormikControl
    //         control='input'
    //         type='email'
    //         label='Email'
    //         name='email'
    //       />
    //       <FormikControl
    //         control='input'
    //         type='password'
    //         label='Password'
    //         name='password'
    //       />

    //      <FormikControl
    //         control='input'
    //         type='text'
    //         label='Name'
    //         name='name'
    //       />

    //       <FormikControl
    //         control='select'
    //         label='Select a province'
    //         name='selectOption1'
    //         options={province}
    //       />
    //       <FormikControl
    //         control='input'
    //         type='text'
    //         label='City'
    //         name='city'
    //       />
                    
    //                 <FormikControl
    //         control='select'
    //         label='Select a role'
    //         name='selectOption2'
    //         options={role}
    //       />
    //       <button type='submit'>Submit</button>
    //     </Form>
    //   )}
    // </Formik> 
    <div className="container  border-1">
            <h3>Registration</h3>
            <span className="text-danger">{error}</span>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group ">
                <p role="alert" data-testid="filter-error-email" className="text-danger">{errors.email?.message}</p>
                {/* <p className="text-danger">{error}</p> */}
                {/* {errors.email && <span role="alert" data-testid="filter-error-email" className="text-danger">{errors.email.message}</span>} */}
                <label>Email:</label>
                <input data-testid="filter-input-email" name="email" role="textbox" className="form-control col-3 mb-3" {...register ("email", {
                    required: "Email should be entered", 
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "invalid email address"
                      },
                    maxLength: {value: 250, message: "Max length is 250"}
                    })} 
                    placeholder="Please Enter your email"/>
                <p role="alert" data-testid="filter-error-password" className="text-danger">{errors.password?.message}</p>
                <label>Password:</label>
                <input data-testid="filter-input-password" className="form-control col-4 mb-4" type="password" {...register ("password", {
                    required: "Password is required", 
                    minLength: {value: 4, message: "Length cannot be less than 4 characters"},
                    maxLength: {value: 200, message: "Length cannot be higher than 200 characters"}
                    })}placeholder="Enter your password" />
                <p role="alert" data-testid="filter-error-name" className="text-danger">{errors.name?.message}</p>
                <label>Name:</label>
                <input data-testid="filter-input-name" className="form-control col-4 mb-4" {...register ("name", {
                    required: "Name should be entered",
                    minLength: {value: 4, message: "Length cannot be less than 4 characters"},
                    maxLength: {value: 200, message: "Length cannot be higher than 200 characters"}
                })}  placeholder="John Smith"/>
                <p role="alert" data-testid="filter-error-role" className="text-danger">{errors.role?.message}</p>
                <label>Role:</label>
                <select data-testid="filter-input-role" className = "form-control" {...register ("role", {
                    required: "Role is required", 
                })} placeholder="Choose your role">
                    <option value="">Please Choose a Role...</option>
                    <option value="Employer">Employer</option>
                    <option value="Employee">Employee</option>
                </select>


                <p role="alert" data-testid="filter-error-province" className="text-danger">{errors.province?.message}</p>
                <label>Province:</label>
                <select data-testid="filter-input-province" className = "form-control" {...register ("province", {
                    required: "Please choose your province"
                })} placeholder="Choose your Province">
                    <option value="">Choose your province...</option>
                    <option value="QC">QC</option>
                    <option value="ON">ON</option>
                    <option value="BC">BC</option>
                </select>

                <p role="alert" data-testid="filter-error-city" className="text-danger">{errors.city?.message}</p>
                <label>City:</label>
                <input data-testid="filter-input-city" className="form-control col-4 mb-4" {...register ("city", {
                    required: "City should be entered", 
                    minLength: {value: 4, message: "Length cannot be less than 4 characters"},
                    maxLength: {value: 200, message: "Length cannot be more than 200 characters"}
                    })} placeholder="Enter your city" />
                <button name="register" type="submit" className="btn btn-primary">Register</button>
                </div>
            </form>

  
        </div>
    )
}

export default Registration
