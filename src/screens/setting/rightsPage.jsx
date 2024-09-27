import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button, Form, Grid, Row, Col } from 'rsuite'
import { Config } from '../../config/connection';
import axios from 'axios';
import { Notification, Alert } from '../../utils/Notification';
import Swal from 'sweetalert2';
export default function RightsPage() {
    const api = Config.urlApi;
    const [open, setOpen] = React.useState(false);
    const handleOpen = (index) => {
        setOpen(index);
    }
    const [inputs, setInputs] = useState({
        rightsId: '',
        rights_name: '',
        status_use: 1,
        status_edit: 1,
        status_delete: 1
    })
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const res = await axios.post(api + 'rights/create', inputs);
          if (res.status === 200) {
                fetchRights();
                setOpen(false);
                Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
                setInputs({
                    rightsId: '',
                    rights_name: '',
                    status_use: 1,
                    status_edit: 1,
                    status_delete: 1
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
    const fetchRights = async () => {
        try {
            const response = await fetch(api + 'rights/');
            const jsonData = await response.json();
            setItemData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleEdit = (item) => {
        setInputs({
            rightsId: item.rights_id,
            rights_name: item.rights_name,
            status_use: item.status_use,
            status_edit: item.status_edit,
            status_delete: item.status_delete
        });
        setOpen(true);
    }

    const handleDelete = (id) => {
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
                axios.delete(api + `rights/${id}`).then(function (resp) {
                    if (resp.status === 200) {
                        fetchRights();
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
        fetchRights()
    }, [])

    return (
        <div id="content" class="app-content p-0">
            <div class="mailbox">
                <div class="mailbox-sidebar">
                    <div class="mailbox-sidebar-header d-flex justify-content-center">
                        <a href="#emailNav" data-bs-toggle="collapse" class="btn btn-dark btn-sm me-auto d-block d-lg-none">
                            <i class="fa fa-cog"></i>
                        </a>
                        <h5> ລາຍການ</h5>
                    </div>
                    <div class="mailbox-sidebar-content collapse d-lg-block" id="emailNav">
                        <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                            <ul class="nav nav-inbox">
                                <li><Link to={'/system'}><i class="fa fa-hdd fa-lg fa-fw me-2"></i> ຂໍ້ມູນເລີ່ມຕົ້ນ</Link></li>
                                <li><Link to={'/depart'}><i class="fa-solid fa-object-ungroup fa-fw me-2"></i> ພະແນກ</Link></li>
                                <li ><Link to={'/shift'}><i class="fa-solid fa-clock fa-fw me-2"></i> ກະການຂາຍ</Link></li>
                                <li><Link to={'/rate'}><img src="assets/img/icon/ic_currency.svg" className='w-20px fa-fw me-2' alt="" />ຕັ້ງຄ່າເລດເງິນ</Link></li>
                                <li class="active"><Link to={'/rights'}><i class="fa-solid fa-screwdriver-wrench fa-fw me-2"></i> ສິດນຳໃຊ້ລະບົບ</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="mailbox-content">
                    <div class="mailbox-content-header">
                        <div class="btn-toolbar">
                            <h5>ຂໍ້ມູນສິດທິການນຳໃຊ້</h5>
                            <a href="javascript:;" onClick={() => handleOpen(true)} class="ms-auto"><i class="fa fa-fw fa-plus"></i>ເພີ່ມຂໍ້ມູນ</a>
                        </div>
                    </div>
                    <div class="mailbox-content-body">
                        <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                            <div className="table-responsive">
                                <table class="table table-striped table-bordered align-middle text-nowrap">
                                    <thead className='thead-bps'>
                                        <tr>
                                            <th class="text-center" width="1%">ລ/ດ</th>
                                            <th class="">ຊື່</th>
                                            <th class="text-center">ສະຖານະ</th>
                                            <th class="text-center">ແກ້ໄຂຂໍ້ມູນ</th>
                                            <th class="text-center">ລົບຂໍ້ມູນ</th>
                                            <th class="text-center" width="10%">ຕັ້ງຄ່າ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemData.length > 0 ? (
                                            itemData.map((item, key) => (
                                                <tr key={key}>
                                                    <td className='text-center'>{key + 1}</td>
                                                    <td>{item.rights_name}</td>
                                                    <td className='text-center'>
                                                        {item.status_use === 1 ? 'Admin1' : item.status_use === 2 ? 'Admin2' : 'User'}
                                                    </td>
                                                    <td className='text-center'>
                                                        {item.status_edit === 1 ? 'ແກ້ໄຂໄດ້' : 'ແກ້ໄຂບໍ່ໄດ້'}
                                                    </td>
                                                    <td className='text-center'>
                                                        {item.status_delete === 1 ? 'ລົບໄດ້' : 'ລົບບໍ່ໄດ້'}
                                                    </td>
                                                    <td className='text-center'>
                                                        <button
                                                            type='button'
                                                            onClick={() => handleEdit(item)}
                                                            className='btn btn-xs btn-blue me-2' >
                                                            <i className='fa-solid fa-pen-to-square' />
                                                        </button>
                                                        <button
                                                            type='button'
                                                            onClick={() => handleDelete(item.rights_id)}
                                                            className='btn btn-xs btn-danger' >
                                                            <i className='fa-solid fa-trash' />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className='text-center'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການບັນທຶກ</td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={open} onClose={() => handleOpen(false)}>
                <Modal.Header>
                    <Modal.Title>ຂໍ້ມູນສິດທິການນຳໃຊ້</Modal.Title>
                </Modal.Header>
                <form  onSubmit={handleSubmit}>
                    <Modal.Body>
                    <Form fluid>
                        <Grid fluid>
                            <Row>
                                <Col xs={24} className='mb-2'>
                                    <Form.Group controlId="name">
                                        <Form.ControlLabel>ຊື່ປະເພດ</Form.ControlLabel>
                                        <Form.Control value={inputs.rights_name} onChange={(e) => handleChange('rights_name', e)} placeholder='ຊື່ປະເພດ' required />
                                    </Form.Group>
                                </Col>
                                <Col xs={24} sm={8} md={8} className='mb-2'>
                                    <Form.Group controlId="name">
                                        <Form.ControlLabel>ສະຖານະ</Form.ControlLabel>
                                        <select value={inputs.status_use} onChange={(e) => handleChange('status_use', e.target.value)} className='form-select'>
                                            <option value="1">Admin 1</option>
                                            <option value="2">Admin 2</option>
                                            <option value="3">User</option>
                                        </select>
                                    </Form.Group>
                                </Col>
                                <Col xs={24} sm={8} md={8} className='mb-2'>
                                    <Form.Group controlId="name">
                                        <Form.ControlLabel>ແກ້ໄຂ</Form.ControlLabel>
                                        <select value={inputs.status_edit} onChange={(e) => handleChange('status_edit', e.target.value)} className='form-select'>
                                            <option value="1">ແກ້ໄຂໄດ້</option>
                                            <option value="2">ແກ້ໄຂບໍ່ໄດ້</option>
                                        </select>
                                    </Form.Group>
                                </Col>
                                <Col xs={24} sm={8} md={8} className='mb-2'>
                                    <Form.Group controlId="name">
                                        <Form.ControlLabel>ລົບ</Form.ControlLabel>
                                        <select value={inputs.status_delete} onChange={(e) => handleChange('status_delete', e.target.value)} className='form-select'>
                                            <option value="1">ລົບໄດ້</option>
                                            <option value="2">ລົບບໍ່ໄດ້</option>
                                        </select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Grid>
                </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary"> ບັນທຶກ</Button>
                        <Button color='red' onClick={() => handleOpen(false)} appearance="primary">
                            ຍົກເລີກ
                        </Button>
                    </Modal.Footer>
                    </form>
            </Modal>
        </div>
    )
}
