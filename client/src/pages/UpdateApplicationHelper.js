
import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom';
import axios from "axios";
import UpdateApplication from "./UpdateApplication";

function UpdateApplicationHelper() {
    let { id } = useParams();
  const [data, setData] = useState(null);


    useEffect(() => {
         axios.get(`https://jobfinder-fsd01.herokuapp.com/applications/employeeapp/${id}`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
         }).then((response) => {
             console.log("hey")
             console.log(response.data);
             setData(response.data);
            // setData({
            //   experience:response.data.experience,
            //   education: response.data.education,
            //   resume: "",
            // });
            
          });
        
    }, []);
    //console.log(data);
    return data ? <UpdateApplication preloadedValues={data}/> : <div>Loading...</div>
  
}

export default UpdateApplicationHelper;
