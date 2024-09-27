import React, { useState, useEffect } from 'react'
import { Input, InputGroup, Button, Toggle, SelectPicker } from 'rsuite';
import { useProvince } from '../../config/select-option';
import { Config } from '../../config/connection';
import axios from 'axios';
import { Notification, Alert } from '../../utils/Notification'; 
import Swal from 'sweetalert2';

export default function BranchPage() {
  const api = Config.urlApi;
  const [dataNew, setDataNew] = useState(false);

const shop_id_fk=localStorage.getItem('shop_id_fk');
  const statuse = [{
    label: 'ເປິດໃຊ້ງານ', value: 1
  },
  {
    label: 'ປິດໃຊ້ງານ', value: 3
  }];
  const typeuse = [{
    label: 'ສາຂາຫຼັກ', value: 1
  },
  {
    label: 'ສາຂາແຟນຊາຍ', value: 1
  }]
  const itemPorvint = useProvince();

  const [itempv, setItempv] = useState([]);
  const showProvince = async (value) => {
    try {
      const response = await fetch(api + 'district/pv/' + value);
      const jsonData = await response.json();
      console.log(jsonData);
      setItempv(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const datadis = itempv.map(item => ({ label: item.districtName, value: item.district_id }));

  const [cascade, setCascade] = useState(false);
  const [imgQr, setImgQr] = useState('/assets/img/icon/qr.png');
  const handleQrChange = (event) => {
    const file = event.target.files[0];
    setInputs({
      ...input, qrBank: file
    })
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgQr(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const [input, setInputs] = useState({
    shop_id_fk:shop_id_fk,
    branch_Id: '',
    branchName: '',
    district_id_fk: '',
    villageName: '',
    branchTel: '',
    latitude: '',
    longitude: '',
    type_branch: 1,
    statusUse: 1,
    bank_name: '',
    account_number: '',
    qrBank: '',
    province_fk:''
  })
  const handleChange = (name, value) => {
    setInputs({
      ...input, [name]: value
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const imputData = new FormData();
    for (const key in input) {
      imputData.append(key, input[key])
    }
    try {
      axios.post(api + 'branch/create', imputData)
        .then(function (res) {
          if (res.status === 200) {
            fetchBranch()
            setDataNew(false)
            setImgQr('/assets/img/icon/qr.png');
            Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
          }else{
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
          }
        })
    } catch (error) {
      Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
    }
  }
 const [itemData,setItemData]=useState([]);
 const fetchBranch = async ()=>{
  try {
    const response = await fetch(api + 'branch/'+shop_id_fk);
    const jsonData = await response.json();
    setItemData(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
 }
const handleEdit=(item)=>{
  setInputs({
    branch_Id: item.branchId,
    branchName: item.branchName,
    district_id_fk: item.district_id_fk,
    villageName: item.villageName,
    branchTel: item.branchTel,
    latitude: item.latitude,
    longitude: item.longitude,
    type_branch: item.type_branch,
    statusUse: item.statusUse,
    bank_name: item.bank_name,
    account_number: item.account_number,
    province_fk:item.province_fk
  });
  if(item.bank_name){
    setCascade(true)
  }
  showProvince(item.province_fk);
  setDataNew(true)
}

const handleDelete=(id)=>{
  Swal.fire({
    title: "ຢືນຢັນ?",
    text: "ທ່ານຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "ລົບ",
    cancelButtonColor: "#d33",
    cancelButtonText: "ບໍ່ລົບ",
    width: 350,
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(api + `branch/${id}`).then(function(resp) {
        if (resp.status === 200) {
          fetchBranch();
            Alert.successData(resp.data.message);
        }
    })
    .catch((error) => {  // Fixed the syntax error here
        Alert.errorData('ບໍ່ສາມາດລົບຂໍ້ມູນນີ້ໄດ້', error);
    });
    }
  });
}
  useEffect(() => {
    fetchBranch()
  }, [])

  return (
    <>
      <div id="content" className="app-content">
        <ol className="breadcrumb float-end">
          <li className="breadcrumb-item"><a href="javascript:;">ໜ້າຫຼັກ</a></li>
          <li className="breadcrumb-item active">ລາຍການສາຂາ</li>
        </ol>
        <h1 className="page-header ">ຂໍ້ມູນສາຂາ </h1>
        <div className="row">
          <div className={dataNew === true ? 'col-sm-8 col-lg-7' : 'col-sm-12 col-lg-12'}>
            <div class="panel">
              <div class="panel-heading bg-white  ui-sortable-handle">
                <h3 class="panel-title fs-18px">ລາຍການສາຂາ</h3>
                <div class="panel-heading-btn">
                  <button type='button' onClick={() => setDataNew(true)} class="btn btn-bps fs-14px" ><i class="fas fa-plus" /> ເພີ່ມຂໍ້ມູນ</button>
                </div>
              </div>
              <div class="panel-body">
                <div className="table-responsive">
                  <table class="table table-striped table-bordered align-middle text-nowrap">
                    <thead className='thead-bps'>
                      <tr>
                        <th class="text-center" width="1%">ລ/ດ</th>
                        <th class="text-center">ລະຫັດ</th>
                        <th class="">ຊື່ສາຂາ</th>
                        <th class="">ເບີໂທລະສັບ</th>
                        <th class="text-center" colSpan={3}>ທີ່ຢູ່ປະຈຸບັນ</th>
                        <th class="">ລາຍລະອຽດ</th>
                        <th class="text-center">ປະເພດ</th>
                        <th class="text-center">ສະຖານະ</th>
                        <th class="text-center">ຕັ້ງຄ່າ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                          itemData.map((item, index) =>
                          <tr>
                            <td className='text-center'>{index+1}</td>
                            <td className='text-center'>{item.branchCode}</td>
                            <td>{item.branchName}</td>
                            <td>{item.branchTel}</td>
                            <td>{item.villageName}</td>
                            <td>{item.districtName}</td>
                            <td>{item.provinceName}</td>
                            <td>{item.branch_detail}</td>
                            <td className='text-center'>{item.type_branch===1?'ສາຂາຫຼັກ':'ສາຂາແຟນຊາຍ'}</td>
                            <td className='text-center'>{item.statusUse===1?'ເປິດໃຊ້ງານ':'ປິດໃຊ້ງານ'}</td>
                            <td className='text-center'>
                          <button type='button' onClick={()=>handleEdit(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square"/></button>
                          <button type='button' onClick={()=>handleDelete(item.branchId)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash"/></button>

                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
          {dataNew === true ? (
            <div className="col-sm-4 col-lg-5 ">
              <div className='navbar navbar-sticky  d-xl-block  h-100'>
                <form onSubmit={handleSubmit} className='nav'>
                  <div className="panel bg-default ">
                    <div class="panel-heading ui-sortable-handle pt-0 p-0 mb-2">
                      <div className='panel-title'>
                        <Button type='button' color="red" onClick={() => setDataNew(false)} appearance="ghost"><i class="fa-solid fa-xmark fs-4" /></Button>
                      </div>
                      <div class="panel-heading-btn">
                        <Button type='submit' color="blue" appearance="primary" startIcon={<i className='fas fa-save' />} block> ບັນທຶກ</Button>
                      </div>
                    </div>
                    <div className="panel-form">
                      <div class="panel ">
                        <div class="panel-heading bg-bps  ui-sortable-handle">
                          <h4 class="panel-title text-white fs-16px"> ສ້າງສາຂາໃໝ່</h4>
                        </div>
                        <div class="panel-body row">
                          <div className="form-group  mb-2">
                            <label htmlFor="" className='form-label'>ຊື່ສາຂາ</label>
                            <Input value={input.branchName} onChange={(e) => handleChange('branchName', e)} placeholder="ຊື່ສາຂາ" required />
                          </div>
                          <div className="form-group mb-2">
                            <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                            <InputGroup inside>
                              <InputGroup.Addon><i class="fa-solid fa-phone" /></InputGroup.Addon>
                              <Input value={input.branchTel} onChange={(e) => handleChange('branchTel', e)} placeholder="020 9999 9999" required />
                            </InputGroup>
                          </div>
                          <div className="form-group col-6 mb-2">
                            <label htmlFor="province" className='form-label'>ແຂວງ</label>
                            <SelectPicker data={itemPorvint} value={input.province_fk} onChange={(e) => showProvince(e)} block />
                          </div>
                          <div className="form-group col-6 mb-2">
                            <label htmlFor="" className='form-label'>ເມື່ອງ</label>
                            <SelectPicker block data={datadis} value={input.district_id_fk} onChange={(e) => handleChange('district_id_fk', e)} />
                          </div>
                          <div className="form-group mb-2">
                            <label htmlFor="" className='form-label'>ບ້ານ</label>
                            <Input value={input.villageName} onChange={(e) => handleChange('villageName', e)} />
                          </div>
                          <div className="form-group mb-2">
                            <label htmlFor="" className='form-label'>ລາຍລະອຽດ</label>
                            <Input as="textarea" value={input.branch_detail} onChange={(e) => handleChange('branch_detail', e)} />
                          </div>
                          <div className="form-group mb-2 col-6">
                            <label htmlFor="" className='form-label'>ປະເພດ </label>
                            <SelectPicker data={typeuse} value={input.type_branch} onChange={(e) => handleChange('type_branch', e)} block />
                          </div>
                          <div className="form-group mb-2 col-6">
                            <label htmlFor="" className='form-label'>ສະຖານະ</label>
                            <SelectPicker data={statuse} value={input.statusUse} onChange={(e) => handleChange('statusUse', e)} block />
                          </div>
                        </div>
                      </div>


                      <div class="panel ">
                        <div class="panel-heading bg-defauld ">
                          <h4 class="panel-title fs-14px">ເພີ່ມບັນຊີທະນາຄານ</h4>
                          <div class="panel-heading-btn">
                            <Toggle size={'xs'}
                              checked={cascade}
                              onChange={checked => {
                                setCascade(checked);
                              }}
                            />
                          </div>
                        </div>
                        {cascade === true ? (
                          <div class="panel-body">
                            <div className="form-group mb-2">
                              <label htmlFor="" className='form-label'>ຊື່ທະນາຄານ</label>
                              <Input block value={input.bank_name} onChange={(e) => handleChange('bank_name', e)} placeholder='ຊື່ທະນາຄານ' />
                            </div>
                            <div className="form-group mb-2">
                              <label htmlFor="" className='form-label'>ເລກບັນຊີ</label>
                              <Input block value={input.account_number} onChange={(e) => handleChange('account_number', e)} placeholder='xxx-xxxx-xxxx-xx' />
                            </div>
                            <div className="form-group text-center">
                              <label role='button'>
                                <input type="file" onChange={handleQrChange} className='hide' />
                                <img src={imgQr} className='w-150px' alt="" />
                              </label>
                            </div>
                          </div>
                        ) : ''}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : ''}
        </div>
      </div>
    </>
  )
}
