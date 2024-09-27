import React, { useState, useEffect } from 'react'
import { SelectPicker, InputGroup, Input, Button } from 'rsuite';
import { useUnite, useCategory } from '../../config/select-option';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Config, Urlimage } from '../../config/connection';
import ModalSetpos from './Modal-setpos';
import numeral from 'numeral';
import SizeOpiton from './Size-Opiton';
import FoodTasting from './Food-Tasting';
import EditStock from './Edit-Stock';
export default function StockProducts() {
    const api = Config.urlApi;
    const imgurl = Urlimage.url;
    const branch_id_fk = localStorage.getItem('branch_Id');
    const shop_id_fk = localStorage.getItem('shop_id_fk');

    const itemUnit = useUnite();
    const itemCate = useCategory();
    const handleFilter = () => {

    }
    const [dataSearch, setDataSearch] = useState({
        shop_id_fk: shop_id_fk,
        branch_id_fk: branch_id_fk,
        categoriesId_fk: '',
        brandsId_fk: '',
        unitsId_fk: ''
    })
    const [itemStock, setItemStock] = useState([]);
    const [filter, setFilter] = useState([]);
    const [loading, setLoading] = useState(true)
    const fetchDataStock = async () => {
        try {
            const response = await axios.post(api + 'porduct/stock/', dataSearch);
            setItemStock(response.data);
            setFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleShearch = (name, value) => {
        setDataSearch({
            ...dataSearch, [name]: value
        })
    }

    //==============================
    const [showEdit, setShowEdit] = useState(false);
    const [itemst, setItemst] = useState({})
    const editStock = (item) => {
        setItemst(item);
        setShowEdit(true)
    }
    const deleteStock = (id) => {

    }
    // ============================

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    // Calculate the current items to display based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemStock.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(itemStock.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    //======================
    const handleCloseModal = () => setShowModal(false);
    const [posId, setPosId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const handleOpenSetps = (id, index) => {
        setPosId(id)
        setShowModal(index);
    };
    // ================
    const [option, setOption] = useState(false)
    const handleOptpion = (val) => {
        setOption(true);
        setPsId(val)

    }
    //=============================
    const [show, setShow] = useState(false);
    const [psId, setPsId] = useState('')
    const handleSize = (id) => {
        setPsId(id)
        setShow(true)
    }


    useEffect(() => {
        fetchDataStock();
    }, [dataSearch])
    const navigate = useNavigate();
    const handleAddstock = () => {
        navigate('/add-stock');
    };
    return (

        <div id="content" class="app-content p-0 bg-component" >
            <div class="app-content-padding px-4 py-3">
                <div class="d-lg-flex mb-lg-3 mb-2">
                    <h1 class="page-header mb-0 flex-1">ສະຕ໋ອກສິນຄ້າທັງໝົດ</h1>
                    <span class="d-none d-lg-flex align-items-center">
                        <a href="#" class="btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3 fs-14px">
                            <i class="fa-solid fa-file-pdf fs-16px me-2 ms-n1" /> Export Pdf
                        </a>
                        <a href="#" class="btn btn-green btn-sm d-flex me-2 pe-3 rounded-3 fs-14px">
                            <i class="fa-solid fs-16px fa-file-excel me-2 ms-n1" /> Export Excel
                        </a>
                        <button type='button' onClick={handleAddstock} class="btn btn-blue btn-sm d-flex pe-3 rounded-3 fs-14px">
                            <span class="fas fa-plus fs-18px me-2 ms-n1"></span>
                            ເພີ່ມສິນຄ້າເຂົ້າ
                        </button>
                    </span>
                </div>
            </div>
            <div class="p-2 mb-n2">
                <div className="row mb-3">
                    <div className="col-sm-4 col-lg-3">
                        <label htmlFor="" className='form-label'>ໝວດໝູ່ສິນຄ້າ</label>
                        <SelectPicker data={itemCate} onChange={(e) => handleShearch('categoriesId_fk', e)} block />
                    </div>
                    <div className="col-sm-4 col-lg-3 col-6">
                        <label htmlFor="" className='form-label'>ປະເພດ / ຍີ່ຫໍ້</label>
                        <SelectPicker onChange={(e) => handleShearch('brandsId_fk', e)} block />
                    </div>
                    <div className="col-sm-4 col-lg-2  col-6">
                        <label htmlFor="" className='form-label'>ຫົວໜ່ວຍ</label>
                        <SelectPicker data={itemUnit} onChange={(e) => handleShearch('unitsId_fk', e)} block />
                    </div>
                    <div className="col-sm-3 col-lg-3 col-10">
                        <label htmlFor="" className='form-label'>ຄົ້ນຫາ</label>
                        <InputGroup inside >
                            <InputGroup.Addon><i className="fas fa-search" /> </InputGroup.Addon>
                            <Input block onChange={(e) => handleFilter(e)} placeholder='ຄົ້ນຫາ / ຊື່ສິ້ນຄ້າ/ລະຫັດ' />
                        </InputGroup>
                    </div>
                    <div className="col-2 col-sm-1 mt-4">
                        <Button appearance="primary" className='btn-add dropdown-toggle' data-bs-toggle="dropdown"><i class="fa-solid fa-grip fs-3"></i></Button>
                        <div class="dropdown-menu dropdown-menu-end">
                            <a href="javascript:;" class="dropdown-item">Action 1</a>
                            <a href="javascript:;" class="dropdown-item">Action 2</a>
                            <a href="javascript:;" class="dropdown-item">Action 3</a>
                            <div class="dropdown-divider"></div>
                            <a href="javascript:;" class="dropdown-item">Action 4</a>
                        </div>
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
                                <th class="text-end">ລາຄາຂາຍ</th>
                                <th class="text-center">ສ່ວນຫຼຸດ</th>
                                <th class="text-center">ຈຳນວນ</th>
                                <th class="">ໝວດໝູ່</th>
                                <th class="">ປະເພດ/ຍີ່ຫໍ້</th>
                                <th class="">ສະຕ໋ອກ</th>
                                <th class="text-center">#</th>
                                <th class="text-center">ເປິດ/ປິດ</th>
                                <th class="text-center">ຕັ້ງຄ່າ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading === true ? (<></>) : (
                                <>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item, index) => (
                                            <tr>
                                                <td className='text-center'>{index + 1}</td>
                                                <td class="with-img text-center">
                                                    <img src={`${imgurl}pos/${item.ps_image === '' ? 'picture.jpg' : item.ps_image}`} class="rounded h-30px my-n1 mx-n1" />
                                                </td>
                                                <td className='text-center'>{item.product_code}</td>
                                                <td>{item.product_name}</td>
                                                <td className='text-end'>{numeral(item.prices).format('0,00')} ₭</td>
                                                <td className='text-end'>{numeral(item.discount).format('0,00')} ₭</td>
                                                <td className='text-center'>{item.quantity} /{item.unit_name}</td>
                                                <td>{item.categories_name}</td>
                                                <td>{item.brand_name}</td>
                                                <td className='text-center'>{item.status_stock === 1 ? 'ຕັດສະຕ໋ອກ' : 'ບໍ່ຕັດສະຕ໋ອກ'}</td>
                                                <td className='text-center'>
                                                    <button type='button' onClick={() => handleOpenSetps(item.product_id_fk, true)} className='btn btn-xs btn-green me-2'>ເຊັດ</button>
                                                    <button type='button' onClick={() => handleSize(item.product_id_fk, true)} className='btn btn-xs btn-orange me-2'>ຂະໜາດ</button>
                                                    <button type='button' onClick={() => handleOptpion(item.product_id_fk, true)} className='btn btn-xs btn-blue me-2'>ລົດຊາດ</button>
                                                </td>
                                                <td className='text-center'>{item.status_use === 1 ? 'ໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}</td>
                                                <td className='text-end'>
                                                    <button type='button' onClick={() => editStock(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square" /></button>
                                                    <button type='button' onClick={() => deleteStock(item.stock_id)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash" /></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={13} className='text-center text-red'> ບໍມີລາຍການສິຄ້າ</td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                    <div className="d-md-flex align-items-center">
                        <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
                            ສະແດງ {indexOfFirstItem + 1} ຫາ {Math.min(indexOfLastItem, itemStock.length)} ຈາກທັງໝົດ {itemStock.length} ລາຍການ
                        </div>
                        <ul className="pagination mb-0 justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href="#!" onClick={() => handlePageChange(currentPage - 1)}><i class="fa-solid fa-angle-left" /> ຍ້ອນກັບ</a>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <a className="page-link" href="#!" onClick={() => handlePageChange(i + 1)}>{i + 1}</a>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <a className="page-link" href="#!" onClick={() => handlePageChange(currentPage + 1)}>ໜ້າໃໝ່ <i class="fa-solid fa-angle-right" /></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <ModalSetpos
                dataId={posId}
                show={showModal}
                handleClose={handleCloseModal}
                itemData={itemStock}
            />

            <SizeOpiton
                id={psId}
                show={option}
                handleClose={() => setOption(false)}
                status={2}
            />

            <FoodTasting
                show={show}
                handleClose={() => setShow(false)}
                psId={psId}
                status={2}
            />
            <EditStock
                show={showEdit}
                handleClose={() => setShowEdit(false)}
                item={itemst}
                fetchDataStock={fetchDataStock}
            />
        </div>
    )
}
