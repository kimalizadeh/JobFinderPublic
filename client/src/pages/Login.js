import React, {useState, useContext } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../helpers/AuthContext';
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import {withFormik, Formik, Form, Field, ErrorMessage} from "formik";


function Login() {
    //const { register, formState: { errors }, handleSubmit, clearErrors } = useForm();
    const [error, setError] = useState("");
    // const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext)

    let history = useNavigate();

    // const successAlert = () => {
    //     // window.alert("Invalid Credentials");
    //     toast("You logged in successfully!", {
    //         position: "top-right",
    //         autoClose: 2000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         draggable: true,
    //         progress: undefined,
    
    //     });
    // }

    const initialValues = {
        email: "",
        password: "",
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Enter a valid email").required("Email cannot be empty"),
        password: Yup.string().min(4).required("You must input your passsword")
    })


    const onSubmit= (data) => {
        // data.email = email;
        // data.password= password;
        console.log(data);
        axios.post("https://jobfinder-fsd01.herokuapp.com/users/login", data).then((response)=>{
            if (response.data.error) {
                //alert(response.data.error);
                setError(response.data.error);
                console.log(response.data);
                //resetForm();
            }
            else {
                localStorage .setItem("accessToken", response.data.token);
                setAuthState({
                   email: response.data.email, 
                   id: response.data.id, 
                   status:true,
                   name: response.data.name,
                   role: response.data.role
                });
                //successAlert();
                    if(response.data.role === "Employer") {
                        history("/employer");
                    } else if (response.data.role === "Employee") {
                        history(`/employee/${response.data.id}`);
                    } else {
                        history("/manageusers");

                    }
                    
                } 
                
        });
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <span className="text-danger">{error}</span>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} >
                <Form className="formContainer">
                <div className="col-5 m-auto">
                <label name="email">Email: </label>
                <ErrorMessage name="email" component="span" className="text-danger"  />
                <Field name="email" className="form-control" />
                </div>
                <div className="col-5 m-auto">
                <label name ="password">Password: </label>
                <ErrorMessage name="password" component="span" className="text-danger" />
                <Field name="password" type="password" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary btn-space">Login</button>
                </Form>
            </Formik>


        </div>
        // <div>
        //     <h1> Login </h1>
        // <div className="loginContainer">
        // <p className="text-danger">{error}</p>
        //     <label>Email:</label>
        //     <input 
        //     type="text"
        //     onChange= {(event)=>{
        //         setEmail(event.target.value);
        //     }} />
        //     <label>Password:</label>
        //     <input 
        //     type="password"
        //     onChange= {(event)=>{
        //         setPassword(event.target.value);
        //     }} />
        //     <button onClick={login} className="btn btn-primary">Login</button>
        // </div>
        // </div>
    )
}

export default Login;
