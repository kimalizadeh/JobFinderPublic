import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import CheckIcon from '@mui/icons-material/Check';

function Wishlist() {

    const [wishlist, setWishList] = useState([]);
    let history = useNavigate()

    useEffect(() => {
        axios.get("https://jobfinder-fsd01.herokuapp.com/wishlists",             {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }).then((response) => {
            setWishList(response.data);
            console.log(response.data);
    
        });
      }, []);

    
    const remove = (id) => {

        axios
        .delete(`https://jobfinder-fsd01.herokuapp.com/wishlists/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then(() => {
          setWishList(
            wishlist.filter((val) => {
              return val.id != id;
            })
          );
        });


    }


    return (
        <div>
            <h1>My WishList</h1>

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
                    City
                </td>
                <td>
                    Province
                </td>
                <td>
                    Applied
                </td>
                <td>
                    View
                </td>
                <td>
                    Remove
                </td>
            </tr>
            </thead>
        {wishlist.map((value, key) => { 
        return (
        <tbody>
        <tr>           
          <td>{value.Job.jobTitle}</td>
          <td>{value.Job.company}</td>
          <td>${value.Job.salary.toLocaleString()}</td>
          <td>{value.Job.category}</td>
          <td>{value.Job.jobType}</td>
          <td>{value.Job.city}</td>
          <td>{value.Job.province}</td>
          
          {value.Job.Applications.length > 0 ? (
              <td><CheckIcon></CheckIcon></td>
          ) : (
            <td><button className="btn btn-primary green-btn" onClick={() =>{history(`/employee/apply/${value.Job.id}`)}}>
            Apply</button></td>

          )
          }
        

          <td><button className="btn btn-info" onClick={() =>{history(`/job/${value.Job.id}`)}}>
              View</button>
         </td>
          <td><button className="btn btn-danger red-btn" onClick={() => {
                          remove(value.id);
                        }}>
              Remove</button>
         </td>
        </tr>
        </tbody>
        );
    })}
        </table>

        </div>
    )
}

export default Wishlist
