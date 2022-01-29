import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import parse from 'html-react-parser';
import ReactPaginate from "react-paginate";
import { useNavigate, withRouter } from 'react-router-dom';
import moment from 'moment';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';




function Home() {

    let history = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [province, setProvince] = useState("QC");
    const [listOfJobs, setListOfJobs] = useState([]);
    const jobsPerPage = 2;

    const page = useRef(1);
    const [showPagination, setShowPagination] = useState(false);
    const [total, setTotal] = useState("");
    const [pageCount, setPageCount] = useState(0)
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



      const search = () => {

        if(keyword.length == 0 && authState.status) {
            axios.get(`http://localhost:3001/jobs/auth/search/${province}/${page.current}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
              }).then((response) => {
                setListOfJobs(response.data.jobs);
                setTotal(response.data.total)
                setPageCount(Math.ceil(response.data.total / jobsPerPage))
                page.current = 1; 
                setShowPagination(true);

                

                
                

            });
        } else if (keyword.length > 0 && authState.status){
          axios.get(`http://localhost:3001/jobs/auth/search/${keyword}/${province}/${page.current}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
              }).then((response) => {
                setListOfJobs(response.data.jobs);
                setTotal(response.data.total)
                setPageCount(Math.ceil(response.data.total / jobsPerPage))
                page.current = 1; 
                setShowPagination(true);
                console.log(response.data.jobs)        
            });

        } else if (keyword.length > 0 ){
          axios.get(`http://localhost:3001/jobs/search/${keyword}/${province}/${page.current}`).then((response) => {
                setListOfJobs(response.data.jobs);
                setTotal(response.data.total)
                setPageCount(Math.ceil(response.data.total / jobsPerPage))
                page.current = 1; 
                setShowPagination(true);    
            });

        } else {
          axios.get(`http://localhost:3001/jobs/search/${province}/${page.current}`).then((response) => {
                setListOfJobs(response.data.jobs);
                setTotal(response.data.total)
                setPageCount(Math.ceil(response.data.total / jobsPerPage))
                page.current = 1; 
                setShowPagination(true);    
            });

        } 

    }





    const addToWishList = (jobId) => {
      axios.post(`https://jobfinder-fsd01.herokuapp.com/wishlists/${jobId}`,  null,           {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }).then((response) => {

            const wishlistItem = {
                id: 0,
                JobId: jobId,
                UserId: authState.id
              };

          if(response.data.added) {
            for(var i=0; i < listOfJobs.length; i++){    
                if(listOfJobs[i].id == jobId) {
                    var job = listOfJobs[i];
                    job.Wishlists.push(wishlistItem);
                    const newJobs = [...listOfJobs];
                    newJobs[i] = job;
                    setListOfJobs(newJobs)
                }
                    
                }
           
          } else {
            for(var i=0; i < listOfJobs.length; i++){    
                if(listOfJobs[i].id == jobId) {
                    var job = listOfJobs[i];
                    job.Wishlists = [];
                    const newJobs = [...listOfJobs];
                    newJobs[i] = job;
                    setListOfJobs(newJobs)
                }
                    
                }
            
          }
          console.log(response.data.added)
      })
      
    }

    const changePage = ({selected}) => {
        console.log(selected)
          page.current = selected + 1;
        search()
    };

    return (
        <div>

<div className="container ">
                
<form className="form-inline search-form">
<div className="row">
  <div className="col-md-6">
    
                <input placeholder="Search here for a job..." className="form-control search-input" type="text" value={keyword} onChange={(event) => {
                    setKeyword(event.target.value);
                }}   />
</div>
<div className="col-md-4">
                {/* <label>Province</label> */}
                <select placeholder="choose a province" className="form-select search-select " value={province}   onChange={(event) => {
                setProvince(event.target.value);
                }}>
                    
                    <option value="QC">QC</option>
                    <option value="ON">ON</option>
                    <option value="BC">BC</option>
                </select>
                </div>
                <div className="col-md-2">
                <button className="btn search-btn" onClick={search}> Search</button>
                </div>
                </div>
</form>

                <div>

                  {listOfJobs.map((value, key) => { 
                  return (

          <div className="card">
              <h5 className="card-header">{value.jobTitle}</h5>
              <div className="card-body">
                  <h5 className="card-title">{value.company}</h5>
                  <div className="card-text">${value.salary.toLocaleString()}</div>
                  <div className="card-text">{value.jobType}</div>
                  <div className="card-text">{value.city}, {value.province}</div>
                  <div className="card-text">Expires: {moment(value.expiryDate).format("MMM Do YYYY")}</div>
                  <div className="card-text">{parse(value.description)}</div>

                  {authState.role == "Employee" && value.Wishlists.length > 0 && (
                      <button  onClick={() => {addToWishList(value.id)}}><FavoriteIcon></FavoriteIcon ></button>
                  )} 

                  {authState.role == "Employee" && value.Wishlists.length === 0 && (
                      <button  onClick={() => {addToWishList(value.id)}}><FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon></button>
                  )} 

                  {authState.role == "Employee" && value.Applications.length > 0 && (
                  <div>Applied: <CheckIcon></CheckIcon></div>
                  )}

                  {authState.role == "Employee" && value.Applications.length == 0 && (
                  <button onClick={() =>{history(`/employee/apply/${value.id}`)}} class="btn btn-primary">Apply</button>
                  )}  
                  
                  
                  <button className="btn btn-primary" onClick={() =>{history(`/job/${value.id}`)}}>View Details</button>
              </div>
          </div>

      );
  })}

                </div>
                <div className="m-5">
                  {showPagination && listOfJobs.length > 0 && (
                  <ReactPaginate
                  previousLabel={"Previous"} 
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"paginationBttns"}
                  previousLinkClassName={"previousBttn"}
                  nextLinkClassName={"nextBttn"}
                  disabledClassName={"paginationDisabled"}
                  activeClassName={"paginationActive"}
                  
                  />

                  )} {showPagination && listOfJobs.length == 0 && (<div>0 results found</div>)} 
                  </div>
 
            </div>

        </div>
    )
}

export default Home
