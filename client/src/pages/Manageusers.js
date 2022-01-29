import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom';
import ReactPaginate from "react-paginate";
import { toast } from 'react-toastify';


function Manageusers() {
    const [listOfUsers, setListOfUsers] = useState([]);
    let history = useNavigate();
    const [pageNumber, setPageNumber] = useState(0);

    const usersPerPage = 2;
    const pagesVisited = pageNumber * usersPerPage;
    const displayUser = listOfUsers.slice(pagesVisited, pagesVisited + usersPerPage)
  
    const pageCount = Math.ceil(listOfUsers.length / usersPerPage);

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

    const deleteUser = (id) => {
      axios
        .delete(`https://jobfinder-fsd01.herokuapp.com/users/manageusers/${id}`,
        {headers: {accessToken: localStorage.getItem("accessToken")}})
        .then(() => {
          // window.location.reload(false);
          // history("/manageusers");
          setListOfUsers(
            listOfUsers.filter((val) => {
              return val.id != id;
            })
          );
          deleteAlert();
        });
    };



    useEffect(() => {
        axios.get("https://jobfinder-fsd01.herokuapp.com/users/manageusers",
        {headers: {accessToken: localStorage.getItem("accessToken")}})
        .then((response)=> {
          setListOfUsers(response.data);
    
        });
      }, []);
    return (
      <div className="container center">
            <div class="row justify-content-center">
        <div class="col-auto">
          <h1> Manage Users</h1>
        <a href="/registration" className="btn btn-primary mb-2 green-btn btn-lg">Add a User</a>
      <table className="container table table-striped">
      <thead>
      <tr>
          <td>
              Email
          </td>
          <td>
              Name
          </td>
          <td>
              Role
          </td>
          <td>
              Province
          </td>
          <td>
              City
          </td>
          <td>
              Actions
          </td>
      </tr>
      </thead>
  {displayUser.map((value, key) => { 
  return (
  <tbody>
  <tr >           
    <td>{value.email}</td>
    <td>{value.name}</td>
    <td>{value.role}</td>
    <td>{value.province}</td>
    <td>{value.city}</td>
    <td>
      <button onClick={() => {deleteUser(value.id);}} className="btn red-btn">Delete User</button><span> </span>
      <Link to={"updateuser/"+value.id}><button className="btn btn-primary green-btn">Update User</button></Link></td>
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




export default Manageusers
