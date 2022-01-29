
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import CreateJob from './pages/CreateJob';
import Registration from './pages/Registration';
import Login from './pages/Login';
import { AuthContext } from './helpers/AuthContext';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Apply from './pages/Apply';
import axios from 'axios';
import Manageusers from './pages/Manageusers';
import UpdateUser from './pages/UpdateUser';
import ApiUpdate from './pages/ApiUpdate';
import ManageJobs from './pages/ManageJobs';
import UpdateJobHelper from './pages/UpdateJobHelper';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployerApplications from './pages/EmployerApplications';
import Home from './pages/Home';
import Job from './pages/Job';
import UserInfo from './pages/UserInfo';
import UpdateInfoHelper from './pages/UpdateInfoHelper';
//import TestHome from './pages/TestHome';
import Wishlist from './pages/Wishlist';
import EmplyerUpdateHelper from './pages/EmplyerUpdateHelper';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CreateIcon from '@mui/icons-material/Create';
import UpdateApplicationHelper from './pages/UpdateApplicationHelper';
//import WebFont from 'webfontloader';



function App() {

  const [authState, setAuthState] = useState({email: "", id: 0, status: false, role: "", name:""});

  let history = useNavigate();


  useEffect(() =>{
    axios
      .get("https://jobfinder-fsd01.herokuapp.com/users/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
    }).then((response)=>{
      if (response.data.error) {
        setAuthState({...authState,status:false});
      } else {
        setAuthState({
          email: response.data.email,
          id: response.data.id,
          status: true,
          role: response.data.role,
          name: response.data.name
        });
      }
    });
  },[]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    //cookie.Expires = DateTime.Now.AddDays(-1);
    setAuthState({email: "", id: 0, status:false, role:"", name:""});
    history("/");
    window.location.reload(false);
  }

  return (
    <div className="App">
        <ToastContainer />
        <AuthContext.Provider value={{authState ,setAuthState}}>
        
        <nav className="navbar navbar-expand-lg  navbar-dark nav-bkg">

        <div className="links">
        <ul className="navbar-nav">
                  <li className="nav-item">
        <Link className="navbar-brand nav-link nav-item navbar-expand-lg mb-0 h1 brand" to="/"><WorkIcon></WorkIcon> JobFinder </Link>
        </li>

        
                  {(!authState.status) && (
                <>
                  <li className="nav-item">
                  <Link className="nav-link" to="/login"> Login</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to="/registration"> Registration</Link>
                  </li>
              </>)}
                
                  {(authState.role ==="Admin") && (
                    <>
                  <li className="nav-item">
                  <Link className="nav-link" to="/createjob"><CreateIcon></CreateIcon> Create Job</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to="/manageusers"><ManageAccountsIcon></ManageAccountsIcon>Manage Users</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to="/admin/jobs"><DashboardIcon></DashboardIcon>Manage Jobs</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to={"/account/"+authState.id}><AdminPanelSettingsIcon></AdminPanelSettingsIcon>Account</Link>
                  </li>
                  <p  className="nav-link" >Welcome, {authState.name} </p> </>)}
                                  
                  {(authState.role ==="Employer") && (
                    <>
                  <li className="nav-item">
                  <Link className="nav-link" to="/createjob"><CreateIcon></CreateIcon> Create Job</Link>
                  </li>
                  {/* <li className="nav-item">
                  <Link className="nav-link" to={"/employer/"+authState.id} >Manage Jobs</Link>
                  </li> */}
                  <li className="nav-item">
                  <Link className="nav-link" to="/employer"><DashboardIcon></DashboardIcon>Dashboard</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link welcome" to={"/account/"+authState.id}><AccountCircleIcon></AccountCircleIcon>Account</Link>
                  </li>
                  <p  className="nav-link welcome" > Welcome, {authState.name} </p> </>)}
                  {(authState.role ==="Employee") && (
                    <>
                  <li className="nav-item">
                  <Link className="nav-link" to={"/employee/"+authState.id}><DashboardIcon></DashboardIcon>Dashboard</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to="/employee/wishlist"><FavoriteIcon ></FavoriteIcon >My Wishlist</Link>
                  </li>
                  <li className="nav-item">
                  {/* <Link className="nav-link" to="/apply">Apply</Link> */}
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to={"/account/"+authState.id}><AccountCircleIcon></AccountCircleIcon>Account</Link>
                  </li>
                  <p  className="nav-link" >Welcome, {authState.name} </p> </>)}
              {authState.status && <button className="btn btn-primary logout" onClick={logout}> Logout</button>}

              </ul>
            </div>

          </nav>

          <Routes>
            <Route path="/createjob" element={<CreateJob />}/>
            <Route path="/registration" element={<Registration />}/>
            <Route path="/login" element={<Login />}/>
            {/* <Route path="/apply" element={<Apply />}/> */}
            <Route path="/manageusers" element={<Manageusers />}/>
            <Route path="manageusers/updateuser/:id" element={<ApiUpdate />}/>
            <Route path="updateaccount/:id" element={<UpdateInfoHelper />}/>
            <Route path="/admin/jobs" element={<ManageJobs />}/>
            <Route path="/employer/:id" element={<ManageJobs />}/>
            <Route path="admin/updatejob/:id" element={<UpdateJobHelper />}/>
            <Route path="employer/updatejob/:id" element={<EmplyerUpdateHelper />}/>
            <Route path="application/update/:id" element={<UpdateApplicationHelper/>}/>
            <Route path="/employee/:id" element={<EmployeeDashboard />}/>
            <Route path="/employee/apply/:jobId" element={<Apply />}/>
            <Route path="/employee/apply/:jobId" element={<Apply />}/>
            <Route path="/employer" element={<EmployerDashboard />}/>
            <Route path="/account/:id" element={<UserInfo />}/>
            <Route path="/" element={<Home />}/>
            <Route path="/job/:jobId" element={<Job />}/>
            {/* <Route path="/testhome" element={<TestHome/>}/> */}
            <Route path="/employer/applications/:jobId" element={<EmployerApplications />}/>
            {/* <Route path="/testhome" element={<TestHome/>}/> */}
            <Route path="/employee/wishlist" element={<Wishlist />}/>

          </Routes>
          
       
        </AuthContext.Provider>
    </div>
  );
}

export default App;
