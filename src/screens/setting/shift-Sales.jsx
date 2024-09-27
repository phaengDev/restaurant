import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button, Form, Input, DatePicker, Grid, Row, Col, SelectPicker } from 'rsuite';
import {Notification, Alert } from '../../utils/Notification';
import axios from 'axios';
import { Config } from '../../config/connection';
import Swal from 'sweetalert2';
import { useBranch } from '../../config/select-option';
export default function ShiftSales() {
    const api = Config.urlApi;
    const [open, setOpen] = React.useState(false);
    const shop_id_fk=localStorage.getItem('shop_id_fk');
    const itemBrand=useBranch();
    const handleOpen = (index) => {
        setOpen(index);
        if(index){
            setInputs({
                shiftId:'',
                shift_name:'',
                time_in:'',
                time_out: '',
                branch_id_fk:''
            });
        }
    }
    const [inputs, setInputs] = useState({
        shiftId: '',
        shift_name: '',
        time_in: new Date(),
        time_out: new Date(),
        branch_id_fk:''
    })
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }
   

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            axios.post(api + 'shift/create', inputs)
                .then(function (res) {
                    if (res.status === 200) {
                        fetchShift()
                        setOpen(false);
                        Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
                        setInputs({
                            shiftId:'',
                            shift_name:'',
                            time_in:'',
                            time_out: '',
                            branch_id_fk:''
                        });
                    } else {
                        Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
                    }
                })
        } catch (error) {
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    }
    const [itemData, setItemData] = useState([]);
    const fetchShift = async () => {
        try {
            const response = await fetch(api + 'shift/'+shop_id_fk);
            const jsonData = await response.json();
            setItemData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleEdit = (item) => {
        setInputs({
            shiftId: item.shift_id,
            shift_name: item.shift_name,
            time_in: item.time_in,
            time_out: item.time_out,
            branch_id_fk:item.branch_id_fk
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
            confirmButtonText: "ຕົກລົງ",
            cancelButtonColor: "#d33",
            cancelButtonText: "ບໍ່ລົບ",
            width: 350,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(api + `shift/${id}`).then(function (resp) {
                    if (resp.status === 200) {
                        fetchShift();
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
        fetchShift()
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
                                <li class="active"><Link to={'/shift'}><i class="fa-solid fa-clock fa-fw me-2"></i> ກະການຂາຍ</Link></li>
                                <li><Link to={'/rate'}><img src="assets/img/icon/ic_currency.svg" className='w-20px fa-fw me-2' alt="" />ຕັ້ງຄ່າເລດເງິນ</Link></li>
                                <li><Link to={'/rights'}><i class="fa-solid fa-screwdriver-wrench fa-fw me-2"></i> ສິດນຳໃຊ້ລະບົບ</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="mailbox-content">
                    <div class="mailbox-content-header">
                        <div class="btn-toolbar">
                            <h5>ຂໍ້ມູນກະການຂາຍ</h5>
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
                                            <th class="">ສາຂາ</th>
                                            <th class="">ຊື່ກະ</th>
                                            <th class="">ເວລາເຂົ້າ</th>
                                            <th class="">ເວລາອອກ</th>
                                            <th class="text-center" width="10%">ຕັ້ງຄ່າ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                          {
                                            itemData.length > 0?(
                                            itemData.map((item, index) =>
                                                <tr>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td>{item.branchName}</td>
                                                    <td>{item.shift_name}</td>
                                                    <td>{item.time_in}</td>
                                                    <td>{item.time_out}</td>
                                                    <td className='text-center'>
                                                        <button type='button' onClick={() => handleEdit(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square" /></button>
                                                        <button type='button' onClick={() => handleDelete(item.shift_id)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash" /></button>

                                                    </td>
                                                </tr>
                                            )):(
                                                <tr>
                                                    <td colSpan={6} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການບັນທຶກ</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={open} onClose={() => handleOpen(false)}>
                <Modal.Header>
                    <Modal.Title className='py-2'>ຂໍ້ມູນກະການຂາຍ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form fluid >
                            <Grid fluid>
                                <Row>
                                <Col xs={24} className='mb-2'>
                                        <Form.Group controlId="name">
                                            <Form.ControlLabel>ສາຂາ</Form.ControlLabel>
                                            <SelectPicker data={itemBrand} value={inputs.branch_id_fk} onChange={(e) => handleChange('branch_id_fk', e)} block  />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={24} className='mb-2'>
                                        <Form.Group controlId="name">
                                            <Form.ControlLabel>ຊື່ກະ</Form.ControlLabel>
                                            <Form.Control value={inputs.shift_name} onChange={(e) => handleChange('shift_name', e)} placeholder='ຊື່ກະ' />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={24} sm={12} md={12} className='mb-2'>
                                        <Form.Group controlId="name">
                                            <Form.ControlLabel>ເວລາເຂົ້າ</Form.ControlLabel>
                                            <DatePicker format="HH:mm:ss"  value={inputs.time_in} onChange={(e) => handleChange('time_in', e)} block placeholder='ເວລາເຂົ້າ' />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={24} sm={12} md={12} className='mb-2'>
                                        <Form.Group controlId="name">
                                            <Form.ControlLabel>ເວລາອອກ</Form.ControlLabel>
                                            <DatePicker format="HH:mm:ss"  value={inputs.time_out} onChange={(e) => handleChange('time_out', e)} block placeholder='ເວລາອອກ' />
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
