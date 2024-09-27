import React,{useEffect,useState} from 'react'
import Header from './layout/Header'
import Navbar from './layout/Navbar'
import AppContent from './router/Paste';
import _ from 'lodash';
import { useLocation,useNavigate } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
function App() {
  const location = useLocation();
  const pathName = location.pathname;
  const [path, setPath] = useState(pathName);
  const [minified,setMinified]=useState(false);
  const routes=['/r-sale' && '/received']
  const navigate = useNavigate();
  const token=localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    setPath(pathName);
    if(_.includes(routes,path)){
      setMinified(true);
    }
  }, [pathName,token]);
  return (
    <>
    {path=== "/login" || path=== "/sale" || path ==="/open" ? (
      <AppContent />
    ) : (
<div id="app" class="app app-header-fixed app-sidebar-fixed app-gradient-enabled app-content-full-height">
   <Header/>
   <Navbar/>
   <AppContent/>
    </div>
    )}
    <NotificationContainer />
    </>
    
  );
}

export default App;
