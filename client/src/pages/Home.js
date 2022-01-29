import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import parse from 'html-react-parser';
import { toast } from 'react-toastify';
import { set } from "react-hook-form";



function Home() {

    let history = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [province, setProvince] = useState("All");
    const [jobType, setJobType] = useState("All");
    const [category, setCategory] = useState("All");

    const jobsPerPage = 2;

    const [listOfJobs, setListOfJobs] = useState([]);
    const page = useRef(1);
    const [showPagination, setShowPagination] = useState(false);
    const [total, setTotal] = useState("");
    const [pageCount, setPageCount] = useState(0)
    const [authState, setAuthState] = useState({email: "", id: 0, status: false, role: "", name:""});
    // const wishlistLength = useRef(0);
    const [applications, setApplications] = useState([]);
    const [wishlists, setWishlists] = useState([]);
    const [pageNum, setPageNum] = useState(0);
    
    
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

        // setPageNum(0)





      },[]);


      useEffect(() =>{


        // setPageNum(0)



        if(authState.role == "Employee") {
          axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/auth/search/${province}/${jobType}/${category}/${page.current}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }).then((response) => {
            console.log(authState.role)
            setListOfJobs(response.data.jobs);
            console.log(response.data.jobs)
            setTotal(response.data.total)
            setPageCount(Math.ceil(response.data.total / jobsPerPage))
            page.current = 1; 
            setShowPagination(true);
            console.log(listOfJobs)
            
            

        });

        } else {
          axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/search/${province}/${jobType}/${category}/${page.current}`).then((response) => {
                setListOfJobs(response.data.jobs);
                setTotal(response.data.total)
                setPageCount(Math.ceil(response.data.total / jobsPerPage))
                page.current = 1; 
                setShowPagination(true);   
                console.log("something") 
            });

        }

      },[authState]);


      const search = () => {

        if(keyword.length == 0 && authState.status) {
            axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/auth/search/${province}/${jobType}/${category}/${page.current}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
              }).then((response) => {
                setListOfJobs(response.data.jobs);
                setTotal(response.data.total)
                setPageCount(Math.ceil(response.data.total / jobsPerPage))
                page.current = 1; 
                setShowPagination(true);
                console.log(response.data.jobs)
 
                 
            });
        } else if (keyword.length > 0 && authState.status){
          axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/auth/search/${keyword}/${province}/${jobType}/${category}/${page.current}`, {
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
          axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/search/${keyword}/${province}/${jobType}/${category}/${page.current}`).then((response) => {
                setListOfJobs(response.data.jobs);
                setTotal(response.data.total)
                setPageCount(Math.ceil(response.data.total / jobsPerPage))
                page.current = 1; 
                setShowPagination(true);    
            });

        } else {
          axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/search/${province}/${jobType}/${category}/${page.current}`).then((response) => {
                setListOfJobs(response.data.jobs);
                setTotal(response.data.total)
                setPageCount(Math.ceil(response.data.total / jobsPerPage))
                page.current = 1; 
                setShowPagination(true);    
            });

        } 

    }

    const successAlert = () => {
      // window.alert("Invalid Credentials");
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
                    successAlert();
                    
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
        // console.log(selected)
          page.current = selected + 1;
          // setPageNum(selected + 1);
        search()
    };

    function smart_substr(str, len) {
      var temp = str.substr(0, len);
      if(temp.lastIndexOf('<') > temp.lastIndexOf('>')) {
          temp = str.substr(0, 1 + str.indexOf('>', temp.lastIndexOf('<')));
      }
      return temp + "...";
  }

 const resetSearch = () => {
  window.location.reload(false);
  }



    return (
        <div>

<div className="container ">
                
<div className="form-inline search-form">
<div className="row">
  <div className="col-md-3">
    
                <input placeholder="Search here for a job..." className="form-control search-input" type="text" value={keyword} onChange={(event) => {
                    setKeyword(event.target.value);

                }}   />
</div>
<div className="col-md-2">
                {/* <label>Province</label> */}
                <select placeholder="choose a province" className="form-select search-select " value={province}   onChange={(event) => {
                setProvince(event.target.value);

                }}>
                    
                    <option value="All">Province</option>
                    <option value="QC">QC</option>
                    <option value="ON">ON</option>
                    <option value="BC">BC</option>
                </select>
                </div>
                <div className="col-md-2">
                                {/* <label>Job Type</label> */}
                <select className="form-select search-select "  value={jobType}       onChange={(event) => {
                setJobType(event.target.value);

                }}>
                    <option value="All">Type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                </select>
                </div>
                <div className="col-md-2">
                {/* <label>Category</label> */}
                <select className="form-select search-select "  value={category}       onChange={(event) => {
                setCategory(event.target.value);

                }}>
                    <option value="All">Category</option>
                    <option value="IT">IT</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="General">General</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Art">Art</option>
                </select>
                </div>
                <div className="col-md-1">
                <button className="btn search-btn" onClick={search}>Find jobs</button>
                </div>
                <div className="col-md-1">
                <button className="btn reset-btn"  onClick={resetSearch}>Reset</button>
                </div>

                </div>
                </div>




                {showPagination && (<div>Total Jobs Found: {total}</div>)}
                


                <div>

                  {listOfJobs.map((value, key) => { 
                  return (

          <div className="card job-card">
              <h3 className="card-header job-card-header"><strong>{value.jobTitle}</strong></h3>
              <div className="card-body">
                  <h4 className="card-text">{value.company}</h4>
                  <div className="card-text">${value.salary.toLocaleString()} per year</div>
                  <div className="card-text">{value.category}</div>
                  <div className="card-text">{value.jobType}</div>
                  <div className="card-text">{value.city}, {value.province}</div>
                  <div className="card-text"><i>Posted: {moment(value.createdAt).format("MMM Do YYYY")}</i></div>
                  <div className="card-text"><i>Expires: {moment(value.expiryDate).format("MMM Do YYYY")}</i></div><br />
                  {/* <div className="card-text">{value.description.replace(/(<([^>]+)>)/gi, "").substring(0,10) + "..."}</div> */}
                  <div className="card-text"><strong>Description:</strong> {parse(smart_substr(value.description, 20))}</div>

                  
                  {authState.role === "Employee" && value.Wishlists && value.Wishlists.length > 0 && (
                      <button className="fav-Icon" onClick={() => {addToWishList(value.id)}}><FavoriteIcon></FavoriteIcon ></button>
                  )}
 

                  {authState.role === "Employee" && value.Wishlists && value.Wishlists.length === 0 && (
                      <div><button  className="fav-Icon"  onClick={() => {addToWishList(value.id)}}><FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon></button></div>
                  )} 

                  {authState.role === "Employee" && value.Applications && value.Applications.length > 0 && (
                  <div>Applied: <CheckIcon></CheckIcon></div>
                  )}

                  {authState.role === "Employee" && value.Applications && value.Applications.length === 0 && (<div>
                  <button onClick={() =>{history(`/employee/apply/${value.id}`)}} className="btn btn-primary apply-btn">Apply</button></div>
                  )}  
                  
                  
                  <button className="btn btn-primary" onClick={() =>{history(`/job/${value.id}`)}}>View Details</button>
              </div>
          </div>

      );
  })}

                </div>
                <div className="m-5" >
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
                  forcePage={page.current - 1}
                  
                  />

                  )} 
                  </div>
 
            </div>

        </div>
    )
}

export default Home

