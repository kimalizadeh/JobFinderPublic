import React from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import { useForm } from 'react-hook-form';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast } from 'react-toastify';
import CheckIcon from '@mui/icons-material/Check';
import parse from 'html-react-parser';
import Description from './Description';


function Job() {

    let { jobId } = useParams();
    let history = useNavigate();
    const [job, setJob] = useState({});
    const [error, setError] = useState("");
    const [added, setAdded] = useState(false);
    const [applied, setApplied] = useState(false);
    const description = useRef("");

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



    useEffect(() => {
      axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/${jobId}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        response.data.salary = response.data.salary.toLocaleString()
        response.data.description = parse(response.data.description)
        setJob(response.data);
       

    });

      }, []);

      useEffect(() => {
        axios.get(`https://jobfinder-fsd01.herokuapp.com/wishlists/${jobId}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }).then((response) => {
          if(response.data.added) {
            setAdded(true)
          }
          console.log(added)
  
      });
  
        }, []);



        useEffect(() => {
          axios.get(`https://jobfinder-fsd01.herokuapp.com/applications/employee/${jobId}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }).then((response) => {
            if(response.data.applied) {
              setApplied(true)
            }
            // console.log(response.data.added)
    
        });
    
          }, []);


      const successAlert = () => {
        toast("Job added to your Wishlist!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
    
        });
    }

      const addToWishList = () => {

        axios.post(`https://jobfinder-fsd01.herokuapp.com/wishlists/${jobId}`,  null,           {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }).then((response) => {
            if(response.data.added) {
              setAdded(true)
              successAlert();
            } else {
              setAdded(false);
            }
            console.log(response.data.added)

        }) 

      }

    return (
        <div className="container">
            <div class="card job-card">
            <h3 className="card-header job-card-header"><strong>{job.jobTitle}</strong></h3>
            <div class="card-body">
            <h4 class="card-text">{job.company}</h4>
            <div class="card-text">${job.salary}</div>
            <div className="card-text">{job.category}</div>
            <div className="card-text">{job.jobType}</div>
            <div className="card-text">{job.city}, {job.province}</div>
            <div className="card-text"><i>Posted: {moment(job.createdAt).format("MMM Do YYYY")}</i></div>
            <div className="card-text"><i>Expires: {moment(job.expiryDate).format("MMM Do YYYY")}</i></div><br />
            <div className="card-text"><strong>Description:</strong> {job.description}</div>
           
            
            
            {!applied && (authState.role ==="Employee") && (
              <div>
              <button onClick={() =>{history(`/employee/apply/${job.id}`)}} class="btn btn-primary search-btn">Apply</button>
              <div className="text-danger">{error}</div>
              </div>
            )}

            {applied && (authState.role ==="Employee") && (
              <div>
              <div>Applied: <CheckIcon></CheckIcon></div>
              <div className="text-danger">{error}</div>
              </div>
            )}

            {!added && (authState.role ==="Employee") && (
              <div>
              <button className="fav-Icon" onClick={addToWishList}>< FavoriteBorderOutlinedIcon className="favIcon" ></FavoriteBorderOutlinedIcon></button>
              <div className="text-danger">{error}</div>
              </div>
            )}

            {added && (authState.role ==="Employee") && (
              <div>
              <button className="fav-Icon" onClick={addToWishList}><i className="favIcon"><FavoriteIcon className="favIcon" ></FavoriteIcon ></i></button>
              <div className="text-danger">{error}</div>
              </div>
            )}
            
            </div>
            </div>
        </div>
    )
}

export default Job