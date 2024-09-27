import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Config } from '../../config/connection';
import { Notification } from '../../utils/Notification';
import { Loader } from 'rsuite';
import axios from 'axios';
export default function LoingPage() {
const api=Config.urlApi;
const [values,setValues]=useState({
    userEmail:'',
    userPass:'',
})
const handledChange=(name,value)=>{
    setValues({
        ...values,[name]:value
    })
}
const navigate=useNavigate();
const [isLoading,setIsLoading]=useState(false)
const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(api + 'login/check', values);
      if (res.status === 200) {
        const { username, userEmail, user_uuid, user_Id, token, branch_Id,shop_id_fk } = res.data; 
        localStorage.setItem('username', username);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('user_uuid', user_uuid);
        localStorage.setItem('user_Id', user_Id);
        localStorage.setItem('token', token);
        localStorage.setItem('branch_Id', branch_Id);
        localStorage.setItem('shop_id_fk',shop_id_fk);
        navigate('/');
      } else {
        Notification.error('ຊື່ ແລະ ລະຫັດຜ່ານບໍ່ຖຶກຕ້ອງ ', 'ແຈ້ງເຕືອນ');
      }
    } catch (error) {
      Notification.error('ຊື່ ແລະ ລະຫັດຜ່ານບໍ່ຖຶກຕ້ອງ ', 'ແຈ້ງເຕືອນ');
    } finally {
      setIsLoading(false);
    }
  };


const [showPassword, setShowPassword] = useState(false);
const handleCheckbox = () => {
    setShowPassword(!showPassword);
  };

    return (
        <div id="app" class="app">
            <div class="login login-v2 fw-bold">

                <div class="login-cover">
                    <div className="login-cover-img"
                        style={{ backgroundImage: "url(../assets/img/login-bg/login-bg-14.jpg)" }}  />
                    <div class="login-cover-bg"></div>
                </div>
                <div class="login-container rounded-3 border-4 border-top border-gold rounded-top-4 border-bps pt-4 bg-white">
                    <div class="login-header">
                        <div class="brand text-dark">
                            <div class="d-flex align-items-center">
                                <img src="./assets/img/icon/bp-shop.ico" /><b className='me-2'>BPS</b> Login
                            </div>
                            <small>ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບ</small>
                        </div>
                        <div class="icon text-bps">
                            <i class="fa fa-lock"></i>
                        </div>
                    </div>

                    <div class="login-content">
                        <form  onSubmit={handleSubmit}>
                            <div class="form-floating mb-20px">
                                <input type="text" onChange={(e)=>handledChange('userEmail',e.target.value)} class="form-control fs-13px h-45px border-blue" placeholder="Email Address" required />
                                <label for="emailAddress" class="d-flex align-items-center text-gray-600 fs-13px">Email Address</label>
                            </div>
                            <div class="form-floating mb-20px">
                                <input type={showPassword ? 'text' : 'password'} onChange={(e)=>handledChange('userPass',e.target.value)} class="form-control fs-13px h-45px border-blue" placeholder="Password" required />
                                <label for="password" class="d-flex align-items-center text-gray-600 fs-13px">Password</label>
                            </div>
                            <div class="form-check mb-20px">
                            <input class="form-check-input is-invalid"  onChange={handleCheckbox}  checked={showPassword} type="checkbox"  />
                                <label class="form-check-label fs-13px text-gray-500" for="rememberMe"> ສະແດງລະຫັດຜ່ານ</label>
                            </div>
                            <div class="mb-20px">
                                <button type="submit" class="btn btn-bps d-block w-100 h-45px btn-lg" disabled={isLoading}> {isLoading===true?( <Loader size="sm" content="ກຳລັງກວດສອບ..." />):'ເຂົ້າສູ່ລະບົບ'} </button>
                            </div>
                            <div class="text-gray-500">
                                Vertion V.01
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          
        </div>
    )
}
