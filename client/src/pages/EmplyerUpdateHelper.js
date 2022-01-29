
import React, { useEffect, useState } from "react";
import {useParams, useHistory} from 'react-router-dom';
import axios from "axios";
import EmployerUpdate from "./EmployerUpdate";


function EmplyerUpdateHelper() {
    let { id } = useParams();
  const [data, setData] = useState(null);


    useEffect(() => {
         axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/employer/job/${id}`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
         }).then((response) => {
            setData(response.data);
            //console.log(response.data);
          });
        
    }, []);
    console.log(data);
  return data ? <EmployerUpdate preloadedValues={data}/> : <div>Loading...</div>
}

export default EmplyerUpdateHelper;
