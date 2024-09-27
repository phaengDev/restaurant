import { values } from 'lodash';
import React, { useState, useEffect } from 'react'
import { Input, Button, SelectPicker, InputPicker, InputGroup, Placeholder, Loader,IconButton } from 'rsuite';
import axios from 'axios';
import { Config } from '../../config/connection';
import { Notification, Alert } from '../../utils/Notification';
import Swal from 'sweetalert2';
import { useProvince } from '../../config/select-option';
export default function VendorsPages() {
    const api = Config.urlApi;
    const itemPv = useProvince();
    const [dataNew, setDataNew] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const shop_id_fk=localStorage.getItem('shop_id_fk')
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    const [itemDistrict, setItemDistrict] = useState([]);
    const handleShowdist = async (value) => {
        try {
            const response = await axios.get(api + `district/pv/${value}`);
            setItemDistrict(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const dataDis = itemDistrict.map(item => ({ label: item.districtName, value: item.district_id }));

    const [inputs, setInputs] = useState({
        supplierId: '',
        supplier_name: '',
        supplier_tel: '',
        provintId:'',
        district_id_fk: '',
        village_name: '',
        postal_code: '',
        road_number: '',
        supplier_detail: '',
        email: '',
        whatsapp: '',
        line: '',
        facebook: '',
        shop_id_fk:shop_id_fk,
    })
    const handleChange = (name, values) => {
        setInputs({
            ...inputs, [name]: values
        })
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(api + 'supplier/create', inputs);
            if (res.status === 200) {
                fetchVendors();
                setDataNew(false);
                Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
                setInputs({
                    supplierId: '',
                    supplier_name: '',
                    supplier_tel: '',
                    district_id_fk: '',
                    village_name: '',
                    postal_code: '',
                    road_number: '',
                    supplier_detail: '',
                    email: '',
                    whatsapp: '',
                    line: '',
                    facebook: '',
                    shop_id_fk:shop_id_fk
                })
            } else {
                Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }
        } catch (error) {
            console.error('Error while saving data:', error);
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    }
    const [itemData, setItemData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState([]);
    const fetchVendors = async () => {
        try {
            const response = await fetch(api + 'supplier/'+shop_id_fk);
            const jsonData = await response.json();
            setItemData(jsonData);
            setFilter(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally  {
            setIsLoading(false)
        }
    }

    const Filter = (event) => {
        setItemData(filter.filter(n => n.supplier_name.toLowerCase().includes(event)))
      }


    const handleEdit = (item) => {
        handleShowdist(item.province_fk)
        setInputs({
            supplierId: item.supplier_id,
            supplier_name: item.supplier_name,
            supplier_tel: item.supplier_tel,
            provintId:item.province_fk,
            district_id_fk: item.district_id_fk,
            village_name: item.village_name,
            postal_code: item.postal_code,
            road_number: item.road_number,
            supplier_detail: item.supplier_detail,
            email: item.email,
            whatsapp: item.whatsapp,
            line: item.line,
            facebook: item.facebook
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
                axios.delete(api + `supplier/${id}`).then(function (resp) {
                    if (resp.status === 200) {
                        fetchVendors();
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
        fetchVendors()
    }, [])

    return (
        <div id="content" className="app-content">
            <ol className="breadcrumb float-end">
                <li className="breadcrumb-item"><a href="javascript:;">ໜ້າຫຼັກ</a></li>
                <li className="breadcrumb-item active">ລາຍການຜູ້ສະໜອງສິນຄ້າ</li>
            </ol>
            <h1 className="page-header flex-grow-1">ຂໍ້ມູນຜູ້ສະໜອງສິນຄ້າ </h1>
            <div className="row">
                <div className={dataNew === true ? 'col-sm-7 col-lg-7' : 'col-sm-12 col-lg-12'}>
                    <div class="panel">
                        <div class="panel-heading bg-white  ui-sortable-handle">
                            <h3 class="panel-title fs-18px">ລາຍການສາງສິນຄ້າ</h3>
                            {!dataNew && (
                                <div class="panel-heading-btn">
                                    <button type='button' onClick={() => setDataNew(true)} class="btn btn-bps fs-14px" ><i class="fas fa-plus" /> ເພີ່ມຂໍ້ມູນ</button>
                                </div>
                            )}
                        </div>
                        <div class="panel-body">
                            <div className="table-responsive">
                                <div class="panel-heading">
                                    <div class="panel-title">
                                      <select  className='form-select w-80px'>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                        <option value="150">150</option>
                                        <option value="250">250</option>
                                        <option value="1000">1000</option>
                                        </select> 
                                    </div>
                                    <div class="panel-heading-btn">
                                        <InputGroup inside>
                                            <InputGroup.Addon><i className='fas fa-search' /></InputGroup.Addon>
                                            <Input block onChange={(e)=>Filter(e)} placeholder='ຄົ້ນຫາ' />
                                        </InputGroup>
                                    </div>
                                </div>
                                <table class="table table-striped table-bordered align-middle text-nowrap">
                                    <thead className='thead-bps'>
                                        <tr>
                                            <th class="text-center" width="1%">ລ/ດ</th>
                                            <th class="">ລະຫັດ</th>
                                            <th class="">ຊື່ຜູ້ປຜະລິດ</th>
                                            <th class="">ເບິໂທລະສັບ</th>
                                            <th class="">ບ້ານ</th>
                                            <th class="">ເມືອງ</th>
                                            <th class="">ແຂວງ</th>
                                            <th class="">ລາຍລະອຽດ</th>
                                            <th class="text-center">ຕັ້ງຄ່າ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading === true ? (
                                            <tr>
                                                <td colSpan={9} className='text-center'>
                                                    <Placeholder.Grid rows={5} columns={6} active />
                                                    <Loader size='lg' center content="ກຳລັງໂຫລດ..." />
                                                </td>
                                            </tr>
                                        ) : (
                                            itemData.length > 0 ? (
                                                <>
                                                    {itemData.map((item, index) =>
                                                        <tr>
                                                            <td className='text-center'>{index + 1}</td>
                                                            <td>{item.supplier_code}</td>
                                                            <td>{item.supplier_name}</td>
                                                            <td>{item.supplier_tel}</td>
                                                            <td>{item.village_name}</td>
                                                            <td>{item.districtName}</td>
                                                            <td>{item.provinceName}</td>
                                                            <td>{item.supplier_detail}</td>
                                                            <td className='text-center'>
                                                            <IconButton size='sm' color="blue" onClick={()=>handleEdit(item)} appearance="primary" className='me-1' icon={<i class="fa-solid fa-pen-to-square"/>} />
                                                            <IconButton size='sm' color="red"  onClick={()=>handleDelete(item.supplier_id)} appearance="primary" icon={<i class="fa-solid fa-trash" />} />
                                                           
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ) : (
                                                <tr>
                                                    <td colSpan={10} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການບັນທຶກ</td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
                {dataNew && (
                    <div className="col-sm-5 col-lg-5 ">
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
                                    <div className=" panel-form">
                                        <div class="panel">
                                            <div class="panel-heading bg-bps  ui-sortable-handle">
                                                <h4 class="panel-title text-white fs-16px"><i class="fa-solid fa-boxes-packing" /> ຂໍ້ມູນຜູ້ຜະລິດ</h4>
                                            </div>
                                            <div class="panel-body row">
                                                <div className="form-group  mb-2">
                                                    <label htmlFor="" className='form-label'>ຊື່ຜູ້ປຜະລິດ </label>
                                                    <Input value={inputs.supplier_name} onChange={(e) => handleChange('supplier_name', e)} placeholder="ຊື່ຜູ້ປຜະລິດ" required />
                                                </div>
                                                <div className="form-group  mb-2">
                                                    <label htmlFor="" className='form-label'>ເບິໂທລະສັບ</label>
                                                    <Input value={inputs.supplier_tel} onChange={(e) => handleChange('supplier_tel', e)} placeholder="ເບິໂທລະສັບ" required />
                                                </div>
                                                <div className="form-group col-sm-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ແຂວງ</label>
                                                    <SelectPicker block data={itemPv} defaultValue={inputs.provintId} onChange={(event) => handleShowdist(event)} placeholder='ເລືອກແຂວງ' />
                                                </div>
                                                <div className="form-group col-sm-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ເມືອງ</label>
                                                    <SelectPicker block data={dataDis} value={inputs.district_id_fk} onChange={(e) => handleChange('district_id_fk', e)} placeholder='ເລືອກເມືອງ' required />
                                                </div>
                                                <div className="form-group  mb-2">
                                                    <label htmlFor="" className='form-label'>ບ້ານ</label>
                                                    <Input value={inputs.village_name} onChange={(e) => handleChange('village_name', e)} block placeholder='ບ້ານ' required />
                                                </div>
                                                <div className="form-group col-sm-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ຖະໜົນເລກທີ</label>
                                                    <Input value={inputs.postal_code} onChange={(e) => handleChange('postal_code', e)} block placeholder='ຖະໜົນເລກທີ' />
                                                </div>
                                                <div className="form-group col-sm-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ໄປສະໜີ</label>
                                                    <Input value={inputs.road_number} onChange={(e) => handleChange('road_number', e)} block placeholder='ໄປສະໜີ' />
                                                </div>
                                                <div className="form-group  mb-2">
                                                    <label htmlFor="" className='form-label'>ລາຍລະອຽດ</label>
                                                    <Input as='textarea' value={inputs.supplier_detail} onChange={(e) => handleChange('supplier_detail', e)} block placeholder='............' />
                                                </div>
                                            </div>
                                        </div>


                                        <div class="panel rounded-top-3">
                                            <div class="panel-heading bg-white  ui-sortable-handle">
                                                <h4 class="panel-title fs-16px">ຂໍ້ມູນຊອງທາງຕິດຕໍ່</h4>
                                                <div class="panel-heading-btn">
                                                    <div class="form-check form-switch mb-2">
                                                        <input class="form-check-input" type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class={`panel-body row  accordion-collapse collapse ${isChecked && 'show'}`} data-bs-parent="#accordion">
                                                <div className="form-group col-sm-6 mb-2">
                                                    <label htmlFor="" className='form-label'>Email</label>
                                                    <Input value={inputs.email} onChange={(e) => handleChange('email', e)} block placeholder='**** @gmail.com' />
                                                </div>
                                                <div className="form-group col-sm-6 mb-2">
                                                    <label htmlFor="" className='form-label'>Whatsapp</label>
                                                    <Input value={inputs.whatsapp} onChange={(e) => handleChange('whatsapp', e)} block placeholder='020 ' />
                                                </div>
                                                <div className="form-group col-sm-6 mb-2">
                                                    <label htmlFor="" className='form-label'>Line</label>
                                                    <Input value={inputs.line} onChange={(e) => handleChange('line', e)} block placeholder='ID Line' />
                                                </div>
                                                <div className="form-group col-sm-6 mb-2">
                                                    <label htmlFor="" className='form-label'>Facebook</label>
                                                    <Input value={inputs.facebook} onChange={(e) => handleChange('facebook', e)} block placeholder='Facebook' />
                                                </div>
                                            </div>
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
