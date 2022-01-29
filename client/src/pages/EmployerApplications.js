import React from 'react';
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function EmployerApplications() {

    let { jobId } = useParams();
    console.log(jobId);

    const [listOfApplications, setListOfApplications] = useState([]);
    const [job, setJob] = useState({});
    
    let history = useNavigate();

    useEffect(() => {
        axios.get(`https://jobfinder-fsd01.herokuapp.com/applications/list/${jobId}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }).then((response) => {
            setListOfApplications(response.data);
            setJob(response.data[0].Job)
    
        });


      }, []);

    
const viewResume = (id) => {

axios(`https://jobfinder-fsd01.herokuapp.com/applications/${id}`, {
    method: 'GET',
    responseType: 'blob' //Force to receive data in a Blob Format
})
.then(response => {
//Create a Blob from the PDF Stream
    const file = new Blob(
      [response.data], 
      {type: 'application/pdf'});
//Build a URL from the file
    const fileURL = URL.createObjectURL(file);
//Open the URL on new Window
    window.open(fileURL);
})
.catch(error => {
    console.log(error);
});

}


    return (
        <div>
            <h1>Applications for {job.jobTitle}</h1>

            

            <table className="container table table-striped">
            <thead>
            <tr>
                <td>
                    Name
                </td>
                <td>
                    Email
                </td>
                <td>
                    Years of Experience
                </td>
                <td>
                    Education
                </td>
                <td>
                    Date Applied
                </td>
                <td>
                    Resume
                </td>

            </tr>
            </thead>
        {listOfApplications.map((value, key) => { 
        return (
        <tbody>
        <tr>           
          <td>{value.User.name}</td>
          <td>{value.User.email}</td>
          <td>{value.experience}</td>
          <td>{value.education}</td>
          <td>{moment(value.createdAt).format("MMM Do YYYY")}</td>
          {/* <td>{value.resume}</td> */}
          <td><button className="btn btn-primary" onClick={()=>viewResume(value.id)}>
              View Resume</button>
         </td>
         {/* <td><a href="http://localhost:3001/applications/1" >
              View Resume</a>
         </td> */}
        </tr>
        </tbody>
        );
    })}
        </table>
        </div>
    )
}

export default EmployerApplications
