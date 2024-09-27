import React, { useState, useEffect } from 'react';
import { useCategory, useBrandCart } from '../../config/select-option';
import { DatePicker, SelectPicker } from 'rsuite'
import axios from 'axios';
import { Config } from '../../config/connection';
import ModalImported from './Modal-Imported';
import numeral from 'numeral';
import moment from 'moment'
function ImportedProducts() {
    const api = Config.urlApi;
    const branch_id_fk = localStorage.getItem('branch_Id');
    const shop_id_fk = localStorage.getItem('shop_id_fk');

    const itemCate = useCategory();
    const [selectedBrand, setSelectedBrand] = useState('');
    const itemBrand = useBrandCart(selectedBrand);
    const changeBrands = (name, value) => {
        setSelectedBrand(value);
        setInputs({
            ...inputs,[name]:value
        })
    }


    const [inputs, setInputs] = useState({
        branch_id_fk: branch_id_fk,
        categories_id_fk: '',
        brands_id_fk: '',
        startDate: new Date(),
        endDate: new Date(),
    })
    const [itemImported, setItemImported] = useState([]);
    const [filter, setFilter] = useState([]);
    const [loading, setLoading] = useState(true)
    const fetchDataImported = async () => {
        try {
            const response = await axios.post(api + 'recived/', inputs);
            setItemImported(response.data);
            setFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    // ============================

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemImported.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(itemImported.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleSearch=(name,value)=>{
setInputs({
    ...inputs,[name]:value
})
    }


    const [open, setOpen] = React.useState(false);
    const addInported = () => {
        setOpen(true)
    }
    useEffect(() => {
        fetchDataImported();
    }, [inputs])
    return (
        <>
            <div id="content" className="app-content p-0 bg-component">
                {/* <ol className="breadcrumb float-end fs-16px">
                    <li className="breadcrumb-item"><a href="javascript:;">ໜ້າຫຼັກ</a></li>
                    <li className="breadcrumb-item "><span className='text-green' role='button'><i className="fas fa-plus" /> ເພີ່ມສິນຄ້ານຳເຂົ້າ</span> </li>
                </ol>
                <h2 className="page-header "> ລົງຂໍ້ມູນນຳເຂົ້າ </h2> */}
                <div class="app-content-padding px-4 py-3">
                    <div class="d-lg-flex mb-lg-3 mb-2">
                        <h1 class="page-header mb-0 flex-1">ລົງຂໍ້ມູນນຳເຂົ້າ</h1>
                        <span class="d-none d-lg-flex align-items-center">
                            <button type='button' onClick={addInported} class="btn btn-blue btn-sm d-flex me-2 pe-3 rounded-3">
                                <i className="fas fa-plus fs-16px me-2 ms-n1" /> ເພີ່ມສິນຄ້ານຳເຂົ້າ
                            </button>
                            <button class="btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3">
                                Export Excel
                            </button>
                            <button class="btn btn-green btn-sm d-flex pe-3 rounded-3">
                                Reload Data
                            </button>
                        </span>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 col-6 mb-2">
                            <label htmlFor="" className='form-label'>ວັນທີ່</label>
                            <DatePicker oneTap format='dd/MM/yyyyy' value={inputs.startDate} onChange={(e)=>handleSearch('startDate',e)} block />
                        </div>
                        <div className="col-sm-3 col-6 mb-2">
                            <label htmlFor="" className='form-label'>ວັນທີ່</label>
                            <DatePicker oneTap format='dd/MM/yyyyy' value={inputs.endDate} onChange={(e)=>handleSearch('endDate',e)} block />
                        </div>
                        <div className="col-sm-3 col-6 mb-2">
                            <label htmlFor="" className='form-label'>ໝວດສິນຄ້າ</label>
                            <SelectPicker data={itemCate} onChange={(e) => changeBrands('categories_id_fk', e)} block />
                        </div>
                        <div className="col-sm-3 col-6 mb-2">
                            <label htmlFor="" className='form-label'>ປະເພດສິນຄ້າ</label>
                            <SelectPicker data={itemBrand} onChange={(e)=>handleSearch('brands_id_fk',e)} block />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table class="table table-striped table-bordered align-middle text-nowrap">
                            <thead className='thead-bps'>
                                <tr>
                                    <th class="text-center" width="1%">ລ/ດ</th>
                                    <th class="text-center">ວັນທີນຳເຂົ້າ</th>
                                    <th class="text-center">ລະຫັດ</th>
                                    <th class="">ຊື່ສິ້ນຄ້າ</th>
                                    <th class="text-end">ລາຄາຂາຍ</th>
                                    <th class="text-center">ຈຳນວນ</th>
                                    <th class="">ໝວດໝູ່</th>
                                    <th class="">ປະເພດ/ຍີ່ຫໍ້</th>
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
                                                <td className='text-center'>{moment(item.create_date).format('DD/MM/YYYY')}</td>
                                                <td className='text-center'>{item.product_code}</td>
                                                <td>{item.product_name}</td>
                                                <td className='text-end'>{numeral(item.price_sale).format('0,00')} ₭</td>
                                                <td className='text-center'>{item.quantity} /{item.unit_name}</td>
                                                <td>{item.categories_name}</td>
                                                <td>{item.brand_name}</td>
                                                <td className='text-end'>
                                                {/* <button type='button' onClick={() => editStock(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square" /></button>
                                                <button type='button' onClick={() => deleteStock(item.stock_id)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash" /></button> */}
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
                                ສະແດງ {indexOfFirstItem + 1} ຫາ {Math.min(indexOfLastItem, itemImported.length)} ຈາກທັງໝົດ {itemImported.length} ລາຍການ
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

                <ModalImported
                    show={open}
                    handleClose={() => setOpen(false)}
                    fetchData={fetchDataImported}
                />
            </div>
        </>
    )
}

export default ImportedProducts