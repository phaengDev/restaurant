import React, { useState, useEffect } from 'react'
import { Input, InputGroup, Button, SelectPicker, Placeholder, Loader } from 'rsuite';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { useRights, useBranch, useDepart } from '../../config/select-option';
import axios from 'axios';
import { Notification, Alert } from '../../utils/Notification';
import { Config, Urlimage } from '../../config/connection';
import Swal from 'sweetalert2';
export default function StaffPages() {
  const api = Config.urlApi;
  const url = Urlimage.url;
  const [dataNew, setDataNew] = useState(false);
  const shop_id_fk=localStorage.getItem('shop_id_fk');
  const openForm =(index)=>{
    setEdit(false)
    setDataNew(index)
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('/assets/img/icon/user.jpg');
  const itemRigth = useRights();
  const itemBranch = useBranch();
  const itemDepart = useDepart();

  const handleQrChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setInputs({
        ...inputs, profile: file
      })
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleClearImage = () => {
    setSelectedFile(null);
    setImageUrl('/assets/img/icon/user.jpg')
    document.getElementById('fileInput').value = '';
    setInputs({
      ...inputs, profile: ''
    })
  };
 
  const [edit,setEdit]=useState(false);


  const [visible, setVisible] = React.useState(false);
  const handleShow = () => {
    setVisible(!visible);
  };
  const [inputs, setInputs] = useState({
    staff_id_fk: '',
    branch_id_fk: '',
    rights_id_fk: '',
    useremail: '',
    userPassword: '',
    depart_id_fk: '',
    profile: '',
    first_name: '',
    last_name: '',
    age: '0',
    tel_mobile: '',
    address: '',
    commitsion: '0',
  })
  const handleChange = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const imputData = new FormData();
    for (const key in inputs) {
      imputData.append(key, inputs[key])
    }
    try {
      axios.post(api + 'staff/create', imputData)
        .then(function (res) {
          if (res.status === 200) {
            fetchStaff()
            setDataNew(false);
            setEdit(false)
            Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
          } else {
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
          }
        })
    } catch (error) {
      Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
    }
  }
  const [isLoading, setLoading] = useState(true);
  const [itemData, setItemData] = useState([]);
  const fetchStaff = async () => {
    try {
      const response = await fetch(api + 'staff/'+shop_id_fk);
      const jsonData = await response.json();
      setItemData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (item) => {
    setInputs({
      staff_id_fk: item.staff_id,
      branch_id_fk: item.branch_id_fk,
      rights_id_fk: item.rights_id_fk,
      depart_id_fk: item.depart_id_fk,
      profile: '',
      first_name: item.first_name,
      last_name: item.last_name,
      age: item.age,
      tel_mobile: item.tel_mobile,
      address: item.address,
      commitsion: item.commitsion,
      userPassword:'',
      useremail:'',
    });
    setDataNew(true);
    setEdit(true)
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "ຢືນຢັນ?",
      text: "ທ່ານຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "ຕົກລົງ",
      cancelButtonColor: "#d33",
      cancelButtonText: "ບໍ່ລົບ",
      width: 350,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(api + `staff/${id}`).then(function (resp) {
          if (resp.status === 200) {
            fetchStaff();
            Alert.successData(resp.data.message);
          }
        })
          .catch((error) => {
            Alert.errorData('ບໍ່ສາມາດລົບຂໍ້ມູນນີ້ໄດ້', error);
          });
      }
    });
  }
  useEffect(() => {
    fetchStaff()
  }, [])


  return (
    <div id="content" className="app-content">
      <div className="row">
        <div className={dataNew === true ? 'col-sm-8 col-lg-7' : 'col-sm-12 col-lg-12'}>
          <div class="panel">
            <div class="panel-heading bg-white  ui-sortable-handle">
              <h3 class="panel-title fs-18px">ລາຍການສາງສິນຄ້າ</h3>
              <div class="panel-heading-btn">
                <Link to={'/rights'} class="btn btn-blue me-2 fs-14px" ><i class="fa-solid fa-users-gear" /> ສິດທິພະນັກງານ</Link>
                {dataNew === false ? (
                <button type='button' onClick={() => openForm(true)} class="btn btn-bps fs-14px" ><i class="fas fa-plus" /> ເພີ່ມ</button>
                ):''}
              </div>
            </div>
            <div class="panel-body">
              <div className="table-responsive">
                <table class="table table-striped table-bordered align-middle text-nowrap">
                  <thead className='thead-bps'>
                    <tr>
                      <th class="text-center" width="1%">ລ/ດ</th>
                      <th class="text-center">ໂປຣໄຟລ໌</th>
                      <th class="text-center">ລະຫັດ</th>
                      <th class="">ຊື່ ແລະ ນາມສະກຸນ</th>
                      <th class="text-center">ອາຍຸ</th>
                      <th class="">ເບີໂທລະສັບ</th>
                      <th class="">ທີ່ຢູ່ປະຈຸບັນ</th>
                      <th class="">ສາຂາ</th>
                      <th class="">ພະແນກ</th>
                      <th class="text-center">ເປິເຊັນຂາຍ</th>
                      <th class="">ຂໍ້ມູນເຂົ້າລະບົບ</th>
                      <th class="text-center">ຕັ້ງຄ່າ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading === true ? (
                      <tr>
                        <td colSpan={12} className='text-center'>
                          <Placeholder.Grid rows={5} columns={6} active />
                          <Loader size='lg' center content="loading" />
                        </td>
                      </tr>
                    ) : (
                      <>
                        {itemData.length > 0 ? (
                          itemData.map((item, key) =>
                            <tr key={key}>
                              <td className='text-center'>{key + 1}</td>
                              <td className='text-center'>
                                <img src={item.profile===''?'assets/img/icon/user.png':url+'porfile/'+item.profile} class="rounded h-30px" />
                                </td>
                              <td className='text-center'>{item.staff_code}</td>
                              <td className=''>{item.first_name + '' + item.last_name}</td>
                              <td className='text-center'>{item.age}</td>
                              <td className=''>{item.tel_mobile}</td>
                              <td className=''>{item.address}</td>
                              <td className=''>{item.branchName}</td>
                              <td className=''>{item.departName}</td>
                              <td className='text-center'>{item.commitsion} %</td>
                              <td className='text-blue' role='button'><i class="fa-solid fa-user-lock"></i> ຜູ້ເຂົ້າໃຊ້</td>
                              <td className='text-center'>
                                <button type='button' onClick={() => handleEdit(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square" /></button>
                                <button type='button' onClick={() => handleDelete(item.staff_id)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash" /></button>

                              </td>
                            </tr>
                          )) : (
                          <tr>
                            <td colSpan={12} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການບັນທຶກ</td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {dataNew === true ? (
          <div className="col-sm-4 col-lg-5 px-2" >
            <div className=" navbar navbar-sticky  h-100">
              <form onSubmit={handleSubmit} className='nav'>
                <div className="panel bg-default ">
                  <div className='sticky-top-form' >
                    <div className="breadcrumb float-end">
                      <Button type='submit' color="blue" appearance="primary" startIcon={<i className='fas fa-save' />} > ບັນທຶກ</Button>
                    </div>
                    <div className="page-header">
                      <Button type='button' color="red" onClick={() => openForm(false)} appearance="ghost"><i class="fa-solid fa-xmark fs-4" /></Button>
                    </div>
                  </div>
                  <div class="panel-form pt-0">
                    {!edit &&(
                    <div class="panel ">
                      <div class="panel-heading bg-bps  ui-sortable-handle">
                        <h4 class="panel-title text-white fs-14px"><i class="fa-solid fa-id-card-clip"></i> ສ້າງບັນຊີຜູ້ໃຊ້</h4>
                      </div>
                      <div class="panel-body  row">
                        <div className="form-group mb-2">
                          <label htmlFor="" className='form-label'>ຊື່ຜູ້ໃຊ້</label>
                          <InputGroup inside>
                            <InputGroup.Addon><i class="fa-solid fa-envelope" /></InputGroup.Addon>
                            <Input value={inputs.useremail} onChange={(e) => handleChange('useremail', e)} placeholder="****@gmail.com" required />
                          </InputGroup>
                        </div>
                        <div className="form-group mb-2">
                          <label htmlFor="" className='form-label'>ລະຫັດຜ່ານ</label>
                          <InputGroup inside >
                            <Input type={visible ? 'text' : 'password'} value={inputs.userPassword} onChange={(e) => handleChange('userPassword', e)} placeholder='*******'  readOnly={edit} />
                            <InputGroup.Button onClick={handleShow}>
                              {visible ? <i class="fa-solid fa-eye" /> : <i class="fa-solid fa-eye-slash" />}
                            </InputGroup.Button>
                          </InputGroup>
                        </div>
                        <div className="form-group col-6 mb-2">
                          <label htmlFor="" className='form-label'>ສິດທິພະນັກງານ</label>
                          <SelectPicker data={itemRigth} onChange={(e) => handleChange('rights_id_fk', e)} block />
                        </div>
                        <div className="form-group col-6 mb-2">
                          <label htmlFor="" className='form-label'>ສາຂາ</label>
                          <SelectPicker data={itemBranch} value={inputs.branch_id_fk} onChange={(e) => handleChange('branch_id_fk', e)} block />
                        </div>
                      </div>
                    </div>
 )}
                    <div class="panel rounded-top-3">
                      <div class="panel-heading bg-defauld ">
                        <h4 class="panel-title fs-16px"> <i class="fa-solid fa-user" /> ຂໍ້​ມູນ​ສ່ວນ​ຕົວ</h4>
                      </div>
                      <div class="panel-body row">
                        <div class="text-center position-relative">
                          <label role='button'>
                            <input type="file" id="fileInput" onChange={handleQrChange} accept="image/*" className='hide' />
                            <img src={imageUrl} class="w-150px rounded-3" />
                          </label>
                          {selectedFile && (
                            <span role='button' onClick={handleClearImage} class=" d-flex align-items-center justify-content-center badge bg-danger text-white position-absolute end-40 top-0 rounded-pill mt-n2 me-n5"><i class="fa-solid fa-xmark"></i></span>
                          )}
                        </div>
                        <div className="form-group mb-2 ">
                          <label htmlFor="" className='form-label'>ຊື່ພະນັກງານ</label>
                          <Input value={inputs.first_name} onChange={(e) => handleChange('first_name', e)} placeholder="ຊື່ພະນັກງານ" required />
                        </div>
                        <div className="form-group col-sm-8 mb-2">
                          <label htmlFor="" className='form-label'>ນາມສະກຸນ</label>
                          <Input value={inputs.last_name} onChange={(e) => handleChange('last_name', e)} placeholder="ນາມສະກຸນ" required />
                        </div>
                        <div className="form-group col-sm-4 mb-2">
                          <label htmlFor="" className='form-label'>ອາຍຸ</label>
                          <Input type='number' value={inputs.age} onChange={(e) => handleChange('age', e)} placeholder="ອາຍຸ" />
                        </div>
                        <div className="form-group mb-2">
                          <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                          <InputGroup inside>
                            <InputGroup.Addon><i class="fa-solid fa-phone" /></InputGroup.Addon>
                            <Input value={inputs.tel_mobile} onChange={(e) => handleChange('tel_mobile', e)} placeholder="020 9999 9999" required />
                          </InputGroup>
                        </div>
                        <div className="form-group mb-2">
                          <label htmlFor="" className='form-label'>ທີ່ຢູ່ປະຈຸບັນ</label>
                          <Input as="textarea" value={inputs.address} onChange={(e) => handleChange('address', e)} required />
                        </div>
                        <div className="form-group col-sm-6 mb-2">
                          <label htmlFor="" className='form-label'>ພະແນກ {inputs.depart_id_fk}</label>
                          <SelectPicker data={itemDepart} value={inputs.depart_id_fk} onChange={(e) => handleChange('depart_id_fk', e)} placement="autoVerticalStart" block />
                        </div>
                        <div className="form-group col-sm-6 mb-2">
                          <label htmlFor="" className='form-label'>ຍອດຂາຍ (ຄ່າຄອມ)</label>
                          <InputGroup inside >
                            <Input value={inputs.commitsion} onChange={(e) => handleChange('commitsion', e)} />
                            <InputGroup.Addon> %</InputGroup.Addon>
                          </InputGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : ''}
      </div>
    </div>
  )
}
