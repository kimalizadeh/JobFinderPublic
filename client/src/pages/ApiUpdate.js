
import React, { useEffect, useState } from "react";
import {useParams, useHistory} from 'react-router-dom';
import UpdateUser from "./UpdateUser";
import axios from "axios";

function ApiUpdate() {
    let { id } = useParams();
  const [data, setData] = useState(null);


    useEffect(() => {
         axios.get(`https://jobfinder-fsd01.herokuapp.com/users/manageusers/${id}`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
         }).then((response) => {
            response.data.password = "";
            setData(response.data);

          });
        
    }, []);
    console.log(data);
  return data ? <UpdateUser preloadedValues={data}/> : <div>Loading...</div>
}

export default ApiUpdate;
