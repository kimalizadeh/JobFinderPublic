import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import parse from 'html-react-parser';
import ReactPaginate from "react-paginate";
import { toast } from 'react-toastify';


function EmployerDashboard() {

    const [error,setError] = useState("");
    const [listOfJobs, setListOfJobs] = useState([]);
    let history = useNavigate()

    const [pageNumber, setPageNumber] = useState(0);

    const jobsPerPage = 2;
    const pagesVisited = pageNumber * jobsPerPage;

    const pageCount = Math.ceil(listOfJobs.length / jobsPerPage)

    const changePage = ({selected}) => {
        setPageNumber(selected);
    };

    useEffect(() => {
        axios.get("https://jobfinder-fsd01.herokuapp.com/jobs",             {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }).then((response) => {
            setListOfJobs(response.data);
            console.log(response.data);
    
        });
      }, []);


    //   const deleteJob = (id) => {
    //     axios
    //       .delete(`http://localhost:3001/jobs/employer/${id}`,
    //       {headers: {accessToken: localStorage.getItem("accessToken")}})
    //       .then(() => {
    //         window.location.reload(false);
    //         history("/employer");
    //       });
    //   };

    function smart_substr(str, len) {
        var temp = str.substr(0, len);
        if(temp.lastIndexOf('<') > temp.lastIndexOf('>')) {
            temp = str.substr(0, 1 + str.indexOf('>', temp.lastIndexOf('<')));
        }
        return temp + "...";
    }

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
                  deleteAlert();
            // window.location.reload(false);
        }
            //history("/admin/jobs");
          });
      };



      const displayJobs = listOfJobs.slice(pagesVisited, pagesVisited + jobsPerPage).map((value, key) => {
        return (
            <tbody>
            <tr>           
              <td>{value.jobTitle}</td>
              <td>{value.company}</td>
              <td>${value.salary.toLocaleString()}</td>
              <td>{value.category}</td>
              <td>{value.jobType}</td>
              <td className="card-text">{parse(smart_substr(value.description, 20))}</td>
              <td>{moment(value.expiryDate).format("MMM Do YYYY")}</td>
              <td>{value.Applications.length}</td>
              <td><button className="btn btn-primary btn-space" onClick={() =>{history(`/job/${value.id}`)}}>View job Details</button>
                  <button className="btn btn-primary btn-space" onClick={() =>{history(`/employer/applications/${value.id}`)}}>
                  View Applications</button>
             </td>
             <td> 
                <button onClick={() => {removeJob(value.id);}} className="btn btn-danger  mr-1 btn-space red-btn" >Delete Job</button>
                <Link to={"/employer/updatejob/"+value.id}><button className="btn btn-primary mr-1 btn-space green-btn">Update Job</button></Link>
            </td>
            </tr>
            </tbody>
            );
      }
      )

    return (
        <div>
            <h1>Employer Dashboard</h1>
            <h4>Your current job postings</h4>

            <table className="container table table-striped">
            <thead>
            <tr>
                <td>
                    Job Title
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
            {displayJobs}
        {/* {listOfJobs.map((value, key) => { 
        return (
        <tbody>
        <tr>           
          <td>{value.jobTitle}</td>
          <td>{value.company}</td>
          <td>${value.salary.toLocaleString()}</td>
          <td>{value.category}</td>
          <td>{value.jobType}</td>
          <td className="card-text">{parse(smart_substr(value.description, 20))}</td>
          <td>{moment(value.expiryDate).format("MMM Do YYYY")}</td>
          <td>{value.Applications.length}</td>
          <td><button className="btn btn-primary" onClick={() =>{history(`/employer/applications/${value.id}`)}}>
              View Applications</button>
         </td>
         <td> <button className="btn btn-primary" onClick={() =>{history(`/job/${value.id}`)}}>View Details</button>
            <button onClick={() => {removeJob(value.id);}} className="btn btn-danger  mr-1 btn-space red-btn" >Delete Job</button>
            <Link to={"/employer/updatejob/"+value.id}><button className="btn btn-primary mr-1 btn-space green-btn">Update Job</button></Link>
        </td>
        </tr>
        </tbody>
        );
    })} */}
        </table>

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
    )
}

export default EmployerDashboard
