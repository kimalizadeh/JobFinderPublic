
import React, { useEffect, useState } from "react";
import {useParams, useHistory} from 'react-router-dom';
import UpdateJob from './UpdateJob';
import axios from "axios";

function UpdateJobHelper() {
    let { id } = useParams();
  const [data, setData] = useState(null);
  const [desc, setDesc] = useState("");




    useEffect(() => {
         axios.get(`https://jobfinder-fsd01.herokuapp.com/jobs/admin/${id}`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
         }).then((response) => {
            setData(response.data);
            console.log(response.data);
            console.log("here")
          });
        
    }, []);
    
  return data ? <UpdateJob preloadedValues={data}/> : <div>Loading...</div>
}

export default UpdateJobHelper;
