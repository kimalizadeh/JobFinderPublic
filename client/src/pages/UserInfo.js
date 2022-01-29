import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';



function UserInfo() {
    const [currentUser, setcurrentUser] = useState({});
    let { id } = useParams();


    useEffect(() => {
        axios.get(`https://jobfinder-fsd01.herokuapp.com/users/account/${id}`,
        {headers: {accessToken: localStorage.getItem("accessToken")}})
        .then((response)=> {
          setcurrentUser(response.data);
    
        });
      }, []);
    return (
<div>
    <h1> Update Your Personal Info</h1>
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
  <tbody>
  <tr >           
    <td>{currentUser.email}</td>
    <td>{currentUser.name}</td>
    <td>{currentUser.role}</td>
    <td>{currentUser.province}</td>
    <td>{currentUser.city}</td>
    <td>
      <Link to={"/updateaccount/"+currentUser.id}><button className="btn btn-primary green-btn">Update Your Info</button></Link></td>
  </tr>
  </tbody>

  </table>

</div>
  
    )}




export default UserInfo
