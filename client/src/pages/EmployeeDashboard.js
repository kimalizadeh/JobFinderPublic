import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';

function EmployeeDashboard() {
    let {id} = useParams();
    const [error, setError] = useState("");
    
    const [listOfApplications, setListOfApplications] = useState([]);
    //const [removedApp, setRemovedApp] = useState({});
    let history = useNavigate();
    

    function refreshPage() {
        window.location.reload(false);
      }
        


    //     const removeApplication = (applicationId) => {
    //     axios
    //       .put(`http://localhost:3001/applications/remove/${applicationId}`,null,
    //       {headers: {accessToken: localStorage.getItem("accessToken")}})
    //       .then((response) => {
    //         if(response.data.error) {
    //             setError(response.data.error);
    //             console.log(error);
    //         } else {
    //             console.log(response);
    //         window.location.reload(false);}
    //         //history("/admin/jobs");
    //       });
    //   };
    const successAlert = () => {
      // window.alert("Invalid Credentials");
      toast("You removed your application successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
  
      });
  }



      useEffect(() => {

      axios.get(`https://jobfinder-fsd01.herokuapp.com/applications/employeedashboard/${id}`,             {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        setListOfApplications(response.data);
        console.log(response.data);

    });
  }, []);

  const deleteApplication = (applicationId) => {
    axios
      .delete(`https://jobfinder-fsd01.herokuapp.com/applications/delete/${applicationId}`,
      {headers: {accessToken: localStorage.getItem("accessToken")}})
      .then(() => {
          console.log("what");
          successAlert();
        setListOfApplications(
          listOfApplications.filter((val) => {
            return val.id != applicationId;
          })
        );
      });
  };

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
            <h1>My Job Application History</h1>

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
                    Education
                </td>
                <td>
                    Years of Experience
                </td>
                <td>
                    Date Applied
                </td>
                <td>
                    Expiry Date
                </td>
                <td>
                    Views
                </td>
                <td>
                    Actions
                </td>
             
            </tr>
            </thead>
        {listOfApplications.map((value, key) => { 
        return (
        <tbody>
        <tr>           
          <td>{value.Job.jobTitle}</td>
          <td>{value.Job.company}</td>
          <td>${value.Job.salary.toLocaleString()}</td>
          <td>{value.Job.category}</td>
          <td>{value.Job.jobType}</td>
          <td>{value.education}</td>
          <td>{value.experience}</td>
          <td>{moment(value.createdAt).format("MMM Do YYYY")}</td>
          <td>{moment(value.Job.expiryDate).format("MMM Do YYYY")}</td>
          
          {/* <td>{value.Applications}</td> */}
          <td>
          <button className="btn btn-primary btn-space" onClick={()=>viewResume(value.id)}>
                  View Resume</button>
          </td>
        
          <td><button className="btn btn-space red-btn"  onClick={() => {deleteApplication(value.id);}} >
              Remove Application</button>
              <Link to={"/application/update/"+value.id}><button className="btn green-btn">Update Application</button></Link>
         </td>
         

        </tr>
        </tbody>
        );
    })}
        </table>


        </div>
    )
}

export default EmployeeDashboard








// import React from 'react'
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from 'react-router-dom';
// import moment from 'moment';

// function EmployeeDashboard() {
//     let {id} = useParams();
//     const [error, setError] = useState("");
    
//     const [listOfJobs, setListOfJobs] = useState([]);
//     //const [removedApp, setRemovedApp] = useState({});
//     let history = useNavigate();


        


//         const removeApplication = (applicationId) => {
//         axios
//           .put(`http://localhost:3001/applications/remove/${applicationId}`,null,
//           {headers: {accessToken: localStorage.getItem("accessToken")}})
//           .then((response) => {
//             if(response.data.error) {
//                 setError(response.data.error);
//                 console.log(error);
//             } else {
//                 console.log(response);
//             window.location.reload(false);}
//             //history("/admin/jobs");
//           });
//       };

//       useEffect(() => {

//       axios.get(`http://localhost:3001/jobs/employee/${id}`,             {
//         headers: {
//           accessToken: localStorage.getItem("accessToken"),
//         },
//       }).then((response) => {
//         setListOfJobs(response.data);
//         console.log(response.data);

//     });
//   }, []);

//     return (
//         <div>
//             <h1>Employee Dashboard</h1>
//             <h4>The history of jobs you applied for</h4>

//             <table className="container table table-striped">
//             <thead>
//             <tr>
//                 <td>
//                     Job Title
//                 </td>
//                 <td>
//                     Company
//                 </td>
//                 <td>
//                     Salary
//                 </td>
//                 <td>
//                     Category
//                 </td>
//                 <td>
//                     Type
//                 </td>
//                 <td>
//                     Expiry Date
//                 </td>
//                 <td>
//                     Actions
//                 </td>
//                 <td>
//                     </td>
//             </tr>
//             </thead>
//         {listOfJobs.map((value, key) => { 
//         return (
//         <tbody>
//         <tr>           
//           <td>{value.jobTitle}</td>
//           <td>{value.company}</td>
//           <td>{value.salary}</td>
//           <td>{value.category}</td>
//           <td>{value.jobType}</td>
//           <td>{moment(value.expiryDate).format("MMM Do YYYY")}</td>
//           <td>{value.Applications}</td>
        
//           {/* <td><button className="btn btn-danger"  onClick={() => {removeApplication(value.Applications.id)}} >
//               Remove </button>
//          </td> */}
//         </tr>
//         </tbody>
//         );
//     })}
//         </table>


//         </div>
//     )
// }

// export default EmployeeDashboard
