import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';
import ReactPaginate from "react-paginate";
import moment from 'moment';
import parse from 'html-react-parser';
import { toast } from 'react-toastify';

function ManageJobs() {
    let {id} = useParams();
    const [error, setError] = useState("");
    const [listOfJobs, setListOfJobs] = useState([]);
    let history = useNavigate();
    const [pageNumber, setPageNumber] = useState(0);

    const jobsPerPage = 2;
    const pagesVisited = pageNumber * jobsPerPage;
    const displayJob = listOfJobs.slice(pagesVisited, pagesVisited + jobsPerPage)
  
    const pageCount = Math.ceil(listOfJobs.length / jobsPerPage);

    const changePage = ({ selected }) => {
      setPageNumber(selected);
    };

    const deleteAlert = () => {
      // window.alert("Invalid Credentials");
      toast("Job deleted!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
  
      });
  }


    

    // const deleteJob = (id) => {
    //   axios
    //     .delete(`http://localhost:3001/jobs/admin/jobs/${id}`,
    //     {headers: {accessToken: localStorage.getItem("accessToken")}})
    //     .then(() => {
    //       window.location.reload(false);
    //       history("/admin/jobs");
    //     });
    // };


    const removeJob = (jobId) => {
      axios
        .put(`https://jobfinder-fsd01.herokuapp.com/jobs/remove/${jobId}`,null,
        {headers: {accessToken: localStorage.getItem("accessToken")}})
        .then((response) => {
          if(response.data.error) {
              setError(response.data.error);
              console.log(error);
          } else {
            setListOfJobs(
              listOfJobs.filter((val) => {
                return val.id != jobId;
              })
            );
          deleteAlert()
        }
          //history("/admin/jobs");
        });
    };



    useEffect(() => {
        axios.get("https://jobfinder-fsd01.herokuapp.com/jobs/admin/jobs",
        {headers: {accessToken: localStorage.getItem("accessToken")}})
        .then((response)=> {
          setListOfJobs(response.data);
    
        });
      }, []);

    //   useEffect(() => {
    //     axios.get(`http://localhost:3001/jobs/employer/${id}"`,
    //     {headers: {accessToken: localStorage.getItem("accessToken")}})
    //     .then((response)=> {
    //       setListOfJobs(response.data);
    
    //     });
    //   }, []);


    function smart_substr(str, len) {
      var temp = str.substr(0, len);
      if(temp.lastIndexOf('<') > temp.lastIndexOf('>')) {
          temp = str.substr(0, 1 + str.indexOf('>', temp.lastIndexOf('<')));
      }
      return temp + "...";
  }

    return (
      <div className="container center">
            <div class="row justify-content-center">
        <div class="col-auto bdr">
          <h1> Manage Jobs</h1>
        <a href="/createjob" className="btn btn-lg btn-primary mb-2 green-btn">Add a new Job</a>
      <table className="container table table-striped">
      <thead>
      <tr>
          <td>
               Title
          </td>
          <td>
              Company
          </td>
          <td>
              Salary
          </td>
          <td>
              Category
          </td>
          <td>
              Type
          </td>
          <td>
              Province
          </td>
          <td>
              City
          </td>
          <td>
              Description
          </td>
          <td>
              Expiry Date
          </td>
          <td>
            # of Applications
          </td>
          <td>
              Views
          </td>
          <td>
              Actions
          </td>
      </tr>
      </thead>
  {displayJob.map((value, key) => { 
  return (
  <tbody>
  <tr >           
    <td>{value.jobTitle}</td>
    <td>{value.company}</td>
    <td>${value.salary.toLocaleString()}</td>
    <td>{value.category}</td>
    <td>{value.jobType}</td>
    <td>{value.province}</td>
    <td>{value.city}</td>
    <td>{parse(smart_substr(value.description, 20))}</td>
    <td>{moment(value.expiryDate).format("MMM Do YYYY")}</td>
    <td>{value.Applications.length}</td>
          <td>
          <button className="btn btn-primary btn-space" onClick={() =>{history(`/job/${value.id}`)}}>View Details</button>
            <button className="btn btn-primary btn-space" onClick={() =>{history(`/employer/applications/${value.id}`)}}>
              View Applications</button>
         </td>
        <td>
        
    <button onClick={() => {removeJob(value.id);}} className="btn btn-danger  mr-1 btn-space red-btn" >Delete Job</button>
    <Link to={"/admin/updatejob/"+value.id}><button className="btn btn-primary mr-1 btn-space green-btn">Update Job</button></Link>
    </td>
  </tr>
  </tbody>
  
  );
})

}
  </table>
  </div>
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
  </div>
  </div>

  
    )}




export default ManageJobs
