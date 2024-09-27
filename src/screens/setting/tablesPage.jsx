import { value } from 'fluture';
import React, { useState, useEffect } from 'react'
import { Input, Button, InputPicker, SelectPicker } from 'rsuite';
import { useBranch } from '../../config/select-option'
import { Config } from '../../config/connection';
import { Alert, Notification } from '../../utils/Notification';
import axios from 'axios';
import Swal from 'sweetalert2'
export default function TablesPage() {
  const api = Config.urlApi;
  const itemBranch = useBranch();
  const [dataNew, setDataNew] = useState(false);
  const shop_id_fk=localStorage.getItem('shop_id_fk');
  const statuse = [{
    label: 'ເປິດໃຊ້ງານ', value: 1
  }, {
    label: 'ປິດໃຊ້ງານ', value: 2
  }];

  const openForm=(index)=>{
    setDataNew(index)
    if(index){
      setInputs({
        tablesId: '',
        tables_name: '',
        branch_id_fk: '',
        statsu_use: 1
      })
    }
  }
  const [inputs, setInputs] = useState({
    tablesId: '',
    tables_name: '',
    branch_id_fk: '',
    statsu_use: 1
  });

  const handleChange = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(api + 'table/create', inputs);
      if (res.status === 200) {
        fetchWarehoues();
        setDataNew(false);
        Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
        setInputs({
          tablesId: '',
          tables_name: '',
          branch_id_fk: '',
          statsu_use: 1
        })
      } else {
        Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
      }
    } catch (error) {
      console.error('Error while saving data:', error);
      Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
    }
  };



  const [itemData, setItemData] = useState([]);
  const fetchWarehoues = async () => {
    try {
      const response = await fetch(api + 'table/'+shop_id_fk);
      const jsonData = await response.json();
      setItemData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const handleEdit = (item) => {
    setInputs({
      tablesId: item.tables_id,
      tables_name: item.tables_name,
      branch_id_fk: item.branch_id_fk,
      statsu_use: item.statsu_use
    });
    setDataNew(true);
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
        axios.delete(api + `table/${id}`).then(function (resp) {
          if (resp.status === 200) {
            fetchWarehoues();
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
    fetchWarehoues()
  }, [])


  return (
    <div id="content" className="app-content">
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item"><a href="javascript:;">ໜ້າຫຼັກ</a></li>
        <li className="breadcrumb-item active">ລາຍການໂຕະຂາຍ</li>
      </ol>
      <h1 className="page-header ">ຂໍ້ມູນໂຕະຂາຍ </h1>
      <div className="row">
        <div className={dataNew === true ? 'col-sm-8 col-lg-8' : 'col-sm-12 col-lg-12'}>
          <div class="panel">
            <div class="panel-heading bg-white  ui-sortable-handle">
              <h3 class="panel-title fs-18px">ລາຍການໂຕະຂາຍ</h3>
              {!dataNew && (
                <div class="panel-heading-btn">
                  <button type='button' onClick={() => openForm(true)} class="btn btn-bps fs-14px" ><i class="fas fa-plus" /> ເພີ່ມຂໍ້ມູນ</button>
                </div>
              )}
            </div>
            <div class="panel-body">
              <div className="table-responsive">
                <table class="table table-striped table-bordered align-middle text-nowrap">
                  <thead className='thead-bps'>
                    <tr>
                      <th class="text-center" width="1%">ລ/ດ</th>
                      <th class="text-center">ລະຫັດ</th>
                      <th class="">ເບີໂຕະ</th>
                      <th class="">ສາຂາ</th>
                      <th class="text-center">ສະຖານະ</th>
                      <th class="text-center" width='10%'>ຕັ້ງຄ່າ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemData.length > 0 ? (
                      itemData.map((item, index) =>
                        <tr>
                          <td className='text-center'>{index + 1}</td>
                          <td className='text-center'>{item.tables_code}</td>
                          <td className=''>{item.tables_name}</td>
                          <td className=''>{item.branchName}</td>
                          <td className='text-center'>{item.statsu_use === 1 ? 'ເປິດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}</td>
                          <td className='text-center'>
                          <button type='button' onClick={()=>handleEdit(item)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-pen-to-square"></i></button>
                          <button type='button' onClick={() => handleDelete(item.tables_id)} class="btn btn-red btn-xs"><i class="fa-solid fa-trash"></i></button>
                        </td>
                        </tr>
                      )
                    ) : (
                      <tr>
                        <td colSpan={6} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການບັນທຶກ</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
        {dataNew && (
          <div className="col-sm-4 col-lg-4 ">
            <div className='navbar navbar-sticky  d-xl-block  h-100'>
              <form onSubmit={handleSubmit} className='nav'>
                <div class="panel ">
                  <div class="panel-heading bg-bps  ui-sortable-handle">
                    <h4 class="panel-title text-white fs-16px">ເພີ່ມໂຕະໃໝ່</h4>
                    <div class="panel-heading-btn">
                      <a href="javascript:;" onClick={() => openForm(false)} class="btn btn-xs btn-icon btn-orange"><i class="fa fa-times"></i></a>
                    </div>
                  </div>
                  <div class="panel-body row">
                    <div className="form-group  mb-2">
                      <label htmlFor="" className='form-label'>ເບີໂຕະ</label>
                      <Input value={inputs.tables_name} onChange={(e) => handleChange('tables_name', e)} placeholder="ເບີໂຕະ" required />
                    </div>
                    <div className="form-group mb-2">
                      <label htmlFor="" className='form-label'>ສາຂາ</label>
                      <SelectPicker data={itemBranch} value={inputs.branch_id_fk} onChange={(e) => handleChange('branch_id_fk', e)} placeholder='ເລືອກສາຂາ' className='col-11' />
                    </div>

                    <div className="form-group mb-2">
                      <label htmlFor="" className='form-label'>ສະຖານະ</label>
                      <InputPicker data={statuse} value={inputs.statsu_use} onChange={(e) => handleChange('statsu_use', e)} className='col-11' />
                    </div>
                    <div className="col-6 mt-3">
                      <Button  color="red" appearance="primary" startIcon={<i className="fa-solid fa-rotate" />} block> ເລີ່ມໃໝ່</Button>
                    </div>
                    <div className="col-6  mt-3">
                      <Button type='submit' color="blue" appearance="primary" startIcon={<i className='fas fa-save' />} block> ບັນທຶກ</Button>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
