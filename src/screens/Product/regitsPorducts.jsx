import React, { useState, useEffect } from 'react'
import { Input, InputGroup, Button, SelectPicker, Placeholder, Loader, InputPicker } from 'rsuite';

import axios from 'axios';
import { Notification, Alert } from '../../utils/Notification';
import { Config, Urlimage } from '../../config/connection';
import Swal from 'sweetalert2';
import numeral from 'numeral';
import '../../Calculator.css';
import Modal from 'react-bootstrap/Modal';

import { usePage,useUnite,useCategory } from '../../config/select-option';
import FormAddProduct from './formAdd-Product';
import FoodTasting from './Food-Tasting';
import SizeOpiton from './Size-Opiton';
export default function RegitsPorducts() {
    const api = Config.urlApi;
    const url = Urlimage.url;
    const itemUnit = useUnite();
    const itemCate = useCategory();
    const [dataNew, setDataNew] = useState(false);
    const shopId = localStorage.getItem('shop_id_fk');
    const openForm = (index) => {
        setDataNew(index)
    }

   


    const [query, setQuery] = useState({
        shopId_fk: shopId,
        categories_id_fk: '',
        brands_id_fk: '',
        units_id_fk: '',
    })
    const handleShearch = (naem, value) => {
        setQuery({
            ...query, [naem]: value
        })
    }

    const [isLoading, setLoading] = useState(true);
    const [itemData, setItemData] = useState([]);
    const [filter, setFilter] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemPerPage] = useState(50);
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.post(api + 'porduct/', query);
            setItemData(response.data);
            setFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (event) => {
        setItemData(filter.filter(n =>
            n.product_name.toLowerCase().includes(event) ||
            n.product_code.toLowerCase().includes(event)
        ));
    }


    const [itemPs, setItemPs] = useState(null);
    const handleEdit = (item) => {
        setItemPs(item);
        setDataNew(true);  
    };

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
                axios.delete(api + `porduct/${id}`).then(function (resp) {
                    if (resp.status === 200) {
                        fetchProducts();
                        Alert.successData(resp.data.message);
                    }
                })
                    .catch((error) => {
                        Alert.errorData('ບໍ່ສາມາດລົບຂໍ້ມູນນີ້ໄດ້', error);
                    });
            }
        });
    }

    
    //================ use Optio ===========
    const [option, setOption] = useState(false)
    const handleOpenOptpion = (val, index) => {
        setOption(index);
        setPsId(val)
       
    }
   
    const handleOffOn = async (productId, currentStatus) => {
        const newStatus = currentStatus === 1 ? 2 : 1;
        try {
            const response = await axios.post(api + 'porduct/offOn/', { productId, statusUse: newStatus });
            if (response.status === 200) {
                // fetchProducts();
                setItemData(prevItemData =>
                    prevItemData.map(item =>
                        item.product_id === productId ? { ...item, statusUse: newStatus } : item
                    )
                );
                Notification.success('ການດຳເນິນງານສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Notification.error('ການດຳເນິນງານບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    };

   
    //=============================
    const [show, setShow] = useState(false);
    const[psId,setPsId]=useState('')
    const handleSize=(id)=>{
        setPsId(id)
        setShow(true)
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    const itemPage = usePage(itemData.length)
    const handlePage = (event) => {
        setItemPerPage(event)
    }
    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate the displayed items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemData.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(itemData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div id="content" className="app-content p-2 ">
            <ol className="breadcrumb float-end">
                <li className="breadcrumb-item"><a href="javascript:;">ໜ້າຫຼັກ</a></li>
                <li className="breadcrumb-item active">ລາຍການສິນຄ້າທັງໝົດ</li>
            </ol>
            <h1 className="page-header ">ຂໍ້ມູນສິນຄ້າ </h1>
            <div className="row">
                <div className={dataNew === true ? 'col-sm-8 col-lg-7' : 'col-sm-12 col-lg-12'}>
                    <div class="panel ">
                        <div class="panel-heading bg-white  ui-sortable-handle">
                            <h3 class="panel-title fs-18px">ລາຍການສິນຄ້າທັງໝົດ</h3>
                           
                        </div>
                        <div class="panel-body">
                            <div className="row mb-3">
                                <div className="col-sm-4 col-lg-3 mb-2">
                                    <label htmlFor="" className='form-label'>ໝວດໝູ່ສິນຄ້າ</label>
                                    <SelectPicker data={itemCate} onChange={(e) => handleShearch('categories_id_fk', e)} block />
                                </div>
                                <div className="col-sm-4 col-lg-3 col-6 mb-2">
                                    <label htmlFor="" className='form-label'>ປະເພດ / ຍີ່ຫໍ້</label>
                                    <SelectPicker onChange={(e) => handleShearch('brands_id_fk', e)} block />
                                </div>
                                <div className="col-sm-4 col-lg-2  col-6 mb-2">
                                    <label htmlFor="" className='form-label'>ຫົວໜ່ວຍ</label>
                                    <SelectPicker data={itemUnit} onChange={(e) => handleShearch('units_id_fk', e)} block />
                                </div>
                                
                                <div className="col-6 col-sm-3 mt-4">
                                    {!dataNew && (
                                    <button type='button' onClick={() => openForm(true)} class="btn btn-bps fs-14px me-2" ><i class="fas fa-plus" /> ເພີ່ມຂໍ້ມູນ</button>
                                    )}
                                    <Button appearance="primary" className='btn-add dropdown-toggle' data-bs-toggle="dropdown"><i class="fa-solid fa-grip fs-3"></i></Button>
                                    <div class="dropdown-menu dropdown-menu-start">
                                        <a href="javascript:;" class="dropdown-item">Action 1</a>
                                        <a href="javascript:;" class="dropdown-item">Action 2</a>
                                        <a href="javascript:;" class="dropdown-item">Action 3</a>
                                        <div class="dropdown-divider"></div>
                                        <a href="javascript:;" class="dropdown-item">Action 4</a>
                                    </div>
                                </div>
                            </div>

                            <div class="d-lg-flex align-items-center mb-2">
                                <div class="d-lg-flex d-none align-items-center text-nowrap">
                                    ສະແດງ:
                                    <InputPicker data={itemPage} onChange={(e)=>handlePage(e)} defaultValue={50} style={{ width: 100 }} />
                                </div>
                                <div class="d-lg-block  ms-2 text-body text-opacity-50">
                                    ລາຍການ
                                </div>
                                <div class=" mb-0 ms-auto justify-content-center">
                                    <InputGroup inside >
                                        <InputGroup.Addon><i className="fas fa-search" /> </InputGroup.Addon>
                                        <Input block onChange={(e) => handleFilter(e)} placeholder='ຄົ້ນຫາ / ຊື່ສິ້ນຄ້າ/ລະຫັດ' style={{ width: 250 }} />
                                    </InputGroup>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table class="table table-striped table-bordered align-middle text-nowrap">
                                    <thead className='thead-bps'>
                                        <tr>
                                            <th class="text-center" width="1%">ລ/ດ</th>
                                            <th class="text-center" width="1%">ຮູບສິນຄ້າ</th>
                                            <th class="text-center">ລະຫັດ</th>
                                            <th class="">ຊື່ສິ້ນຄ້າ</th>
                                            <th class="text-end">ລາຄາຊື້</th>
                                            <th class="text-end">ລາຄາຂາຍ</th>
                                            <th class="text-end">ສ່ວນຫຼຸດ</th>
                                            <th class="">ໝວດໝູ່</th>
                                            <th class="">ປະເພດ/ຍີ່ຫໍ້</th>
                                            <th class="">ສະຕ໋ອກ</th>
                                            <th class="text-center">#</th>
                                            <th class="text-center">ເປິດ/ປິດ</th>
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
                                                {currentItems.length > 0 ? (
                                                    currentItems.map((item, key) =>
                                                        <tr key={key}>
                                                            <td className='text-center'>{key + 1}</td>
                                                            <td className='text-center'>
                                                                <img src={item.imgPos === '' ? '/assets/img/icon/picture.jpg' : url + 'pos/' + item.imgPos} class="rounded h-30px" />
                                                            </td>
                                                            <td className='text-center'>{item.product_code}</td>
                                                            <td className=''>{item.product_name}</td>
                                                            <td className='text-end'>{numeral(item.price_buy).format('0,00')}</td>
                                                            <td className='text-end'>{numeral(item.price_sale).format('0,00')}</td>
                                                            <td className='text-end'>{numeral(item.discount_sale).format('0,00')}</td>
                                                            <td className=''>{item.categories_name}</td>
                                                            <td className=''>{item.brand_name}</td>
                                                            <td className=''>{item.status_stock === 1 ? 'ຕັດສະຕ໋ອກ' : 'ບໍ່ຕັດສະຕ໋ອກ'}</td>
                                                            <td className='text-center'>
                                                                <button type='button' onClick={() => handleOpenOptpion(item.product_id, true)} className='btn btn-xs btn-blue me-2' >Size</button>
                                                                <button type='button' onClick={() => handleSize(item.product_id)} className='btn btn-xs btn-green me-2'>ລົດຊາດ</button>
                                                                {/* {item.dataList.length > 0 ? (
                                                                    <button type='button' onClick={() => handleOpenSetps(item.product_id, true)} className='btn btn-xs btn-green me-2'><i class="fa-solid fa-s" /></button>
                                                                ) : (
                                                                    <button type='button' onClick={() => handleOpenSetps(item.product_id, true)} className='btn btn-xs btn-orange me-2'><i class="fa-solid fa-e" /></button>
                                                                )} */}
                                                            </td>
                                                            <td className='text-center'>
                                                                <div class="form-switch">
                                                                    <input class="form-check-input" type="checkbox" checked={item.statusUse === 1} onChange={() => handleOffOn(item.product_id, item.statusUse)} key={key} />
                                                                </div>
                                                            </td>
                                                            <td className='text-center'>
                                                                <button type='button' onClick={() => handleEdit(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square" /></button>
                                                                <button type='button' onClick={() => handleDelete(item.product_id)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash" /></button>

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
                            <div className="d-md-flex align-items-center">
                                <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
                                    ສະແດງ {indexOfFirstItem + 1} ຫາ {indexOfLastItem} ຈາກທັງໝົດ {itemData.length} ລາຍການ
                                </div>
                                <ul className="pagination mb-0 justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <a className="page-link" onClick={() => handleClick(currentPage - 1)}>Previous</a>
                                    </li>
                                    {pageNumbers.map(number => (
                                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                            <a onClick={() => handleClick(number)} className="page-link">{number}</a>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                                        <a className="page-link" onClick={() => handleClick(currentPage + 1)}>Next</a>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>

                {dataNew === true && (
                  <FormAddProduct
                  openForm={dataNew}
                  hileForm={() => setDataNew(false)}
                  data={itemPs}
                  fetchData={fetchProducts}
              />
                )}
            </div>

<SizeOpiton 
id={psId}
show={option}
handleClose={()=>setOption(false)}
status={1}
/>

<FoodTasting
show={show}
handleClose={()=>setShow(false)}
psId={psId}
status={1}
/>
        </div>
    )
}
