import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button, Input, InputGroup, InputPicker } from 'rsuite';
import Select from 'react-select';
import { Notification, Alert } from '../../utils/Notification';
import axios from 'axios';
import { Config } from '../../config/connection';
import { useCategory, usePage } from '../../config/select-option';
import Swal from 'sweetalert2';
export default function BrandPage() {
  const api = Config.urlApi;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const shop_id_fk = localStorage.getItem('shop_id_fk')
  const handleShow = (index) => {
    setShow(index);
    if (index) {
      setInputs({
        brandId: '',
        categories_id_fk: '',
        brand_name: '',
        brand_detail: ''
      })
    }
  }
  const itemCates = useCategory();
  const [inputs, setInputs] = useState({
    brandId: '',
    categories_id_fk: '',
    brand_name: '',
    brand_detail: ''
  })
  const handleChange = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(inputs);return;
    try {
      axios.post(api + 'brand/create', inputs)
        .then(function (res) {
          if (res.status === 200) {
            fetchCategories()
            setShow(false);
            Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
          } else {
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
          }
        })
    } catch (error) {
      Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
    }
  }
  const [itemData, setItemData] = useState([]);
  const [filter, setFilter] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(25);

  const fetchCategories = async () => {
    try {
      const response = await fetch(api + 'brand/' + shop_id_fk);
      const jsonData = await response.json();
      setItemData(jsonData);
      setFilter(jsonData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const handleFilter = (event) => {
    const searchValue = event.toLowerCase();
    const filteredData = itemData.filter(item =>
      item.brand_name.toLowerCase().includes(searchValue) ||
      item.brand_code.toLowerCase().includes(searchValue)
    );
    setFilter(filteredData);
    setCurrentPage(1);
  };

  const handlePage = (event) => {
    setItemPerPage(event)
  }

  const handleEdit = (item) => {
    setInputs({
      brandId: item.brand_id,
      categories_id_fk: item.categories_id_fk,
      brand_name: item.brand_name,
      brand_detail: item.brand_detail
    });
    setShow(true);
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
        axios.delete(api + `brand/${id}`).then(function (resp) {
          if (resp.status === 200) {
            fetchCategories();
            Alert.successData(resp.data.message);
          }
        })
          .catch((error) => {
            Alert.errorData('ບໍ່ສາມາດລົບຂໍ້ມູນນີ້ໄດ້', error);
          });
      }
    });
  }

  const itemPage = usePage(itemData.length)
  useEffect(() => {
    fetchCategories()
  }, []);
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the displayed items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filter.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filter.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div id="content" className="app-content">
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item"><a href="javascript:;">ໜ້າຫຼັກ</a></li>
        <li className="breadcrumb-item active">ລາຍການຍີ່ຫໍ້ສິນຄ້າ</li>
      </ol>
      <h1 className="page-header ">ຂໍ້ມູນຍີ່ຫໍ້ສິນຄ້າ </h1>
      <div class="panel panel-inverse" data-sortable-id="ui-general-1">
        <div class="panel-heading bg-white">
          <h4 class="panel-title text-dark fs-16px">ລາຍການຍີ່ຫໍ້ສິນຄ້າ</h4>
          <div class="panel-heading-btn">
            <button type='button' onClick={() => handleShow(true)} class="btn  btn-bps fs-14px" ><i class="fas fa-plus fs-4" /> ເພີ່ມຂໍ້ມູນ</button>
          </div>
        </div>
        <div class="panel-body">
          <div class="app-content-padding p-0 mb-2">

            <div class="d-lg-flex align-items-center">
              <div class="d-lg-flex  align-items-center text-nowrap">
                ສະແດງ:
                <InputPicker data={itemPage} onChange={(e) => handlePage(e)} style={{ width: 100 }} defaultValue={25} className='ms-1' />
              </div>
              <div class="d-lg-block  ms-2 text-body text-opacity-50">
                ລາຍການ
              </div>
              <div class="  mb-0 ms-auto justify-content-center ">
                <InputGroup inside>
                  <InputGroup.Button>
                    <i className='fas fa-search' />
                  </InputGroup.Button>
                  <Input placeholder='ຄົ້ນຫາ...' onChange={(e) => handleFilter(e)} style={{ width: 250 }} />
                </InputGroup>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table class="table table-striped table-bordered align-middle text-nowrap">
              <thead className='thead-bps'>
                <tr>
                  <th class="text-center" width="1%">ລ/ດ</th>
                  <th class="">ລະຫັດ</th>
                  <th class="">ຊື່ປະເພດ/ ຍີ່ຫໍ້</th>
                  <th class="">ໝວດໝູ່</th>
                  <th class="">ລາຍລະອຽດ</th>
                  <th class="text-center">ຕັ້ງຄ່າ</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) =>
                    <tr key={index}>
                      <td className='text-center'>{item.idAuto}</td>
                      <td>{item.brand_code}</td>
                      <td>{item.brand_name}</td>
                      <td>{item.categories_name}</td>
                      <td>{item.brand_detail}</td>
                      <td className='text-center'>
                        <button type='button' onClick={() => handleEdit(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square" /></button>
                        <button type='button' onClick={() => handleDelete(item.brand_id)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash" /></button>

                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={6} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການບັນທຶກ</td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
          <div className="d-md-flex align-items-center">
            <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
              ສະແດງ {indexOfFirstItem + 1} ຫາ {indexOfLastItem} ຈາກທັງໝົດ {filter.length} ລາຍການ
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ເພີ່ມຍີ່ຫໍ້ສິນຄ້າ</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form >
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>ຊື່ຍີ່ຫໍ້ສິນຄ້າ</Form.Label>
                <Form.Control type="text" value={inputs.brand_name} onChange={(e) => handleChange('brand_name', e.target.value)} placeholder="ຊື່ຍີ່ຫໍ້" autoFocus />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>ໝວດໝູ່ສິນຄ້າ</Form.Label>
                <Select options={itemCates} value={itemCates.find(option => option.value === inputs.categories_id_fk)} onChange={(e) => handleChange('categories_id_fk', e.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" >
                <Form.Label>ລາຍລະອຽດ</Form.Label>
                <Form.Control as="textarea" value={inputs.brand_detail} onChange={(e) => handleChange('brand_detail', e.target.value)} rows={3} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button color='red' appearance="primary" onClick={() => handleShow(false)}> ຍົກເລີກ</Button>
            <Button type='submit' color='blue' appearance="primary" startIcon={<i className='fas fa-save' />}> ບັນທຶກ</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}
