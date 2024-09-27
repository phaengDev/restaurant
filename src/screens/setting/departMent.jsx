import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button, Form, Input } from 'rsuite'
import {Notification, Alert } from '../../utils/Notification';
import axios from 'axios';
import { Config } from '../../config/connection';
import Swal from 'sweetalert2';
export default function DepartMent() {
    const api = Config.urlApi;
    const [open, setOpen] = React.useState(false);
   const shop_id_fk=localStorage.getItem('shop_id_fk');
    const handleOpen = (index) => {
        setOpen(index);
        if(index){
            setInputs({
        departId: '',
        departName: ''
            })
        }
    }
    const [inputs, setInputs] = useState({
        departId: '',
        departName: '',
        shop_id_fk:shop_id_fk
    })
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            axios.post(api + 'depart/create', inputs)
                .then(function (res) {
                    if (res.status === 200) {
                        fetchDepart()
                        setOpen(false);
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
    const fetchDepart = async () => {
        try {
            const response = await fetch(api + 'depart/'+shop_id_fk);
            const jsonData = await response.json();
            setItemData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleEdit = (item) => {
        setInputs({
            departId: item.depart_id,
            departName: item.departName,
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
                axios.delete(api + `depart/${id}`).then(function (resp) {
                    if (resp.status === 200) {
                        fetchDepart();
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
        fetchDepart()
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
                                <li class="active"><Link to={'/depart'}><i class="fa-solid fa-object-ungroup fa-fw me-2"></i> ພະແນກ</Link></li>
                                <li><Link to={'/shift'}><i class="fa-solid fa-clock fa-fw me-2"></i> ກະການຂາຍ</Link></li>
                                <li><Link to={'/rate'}><img src="assets/img/icon/ic_currency.svg" className='w-20px fa-fw me-2' alt="" />ຕັ້ງຄ່າເລດເງິນ</Link></li>
                                <li><Link to={'/rights'}><i class="fa-solid fa-screwdriver-wrench fa-fw me-2"></i> ສິດນຳໃຊ້ລະບົບ</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="mailbox-content">
                    <div class="mailbox-content-header">
                        <div class="btn-toolbar">
                            <h5>ຂໍ້ມູນພະແນກ</h5>
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
                                            <th class="">ຊື່ພະແນກ</th>
                                            <th class="text-center" width="10%">ຕັ້ງຄ່າ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            itemData.length>0?(
                                            itemData.map((item, index) =>
                                                <tr>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td>{item.departName}</td>
                                                    <td className='text-center'>
                                                        <button type='button' onClick={() => handleEdit(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square" /></button>
                                                        <button type='button' onClick={() => handleDelete(item.depart_id)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash" /></button>

                                                    </td>
                                                </tr>
                                            )
                                        ):(
                                            <tr>
                                                <td colSpan={3} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການບັນທຶກ</td>
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
                    <Modal.Title>ຂໍ້ມູນພະແນກ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form fluid >
                        <Form.Group controlId="departName">
                            <Form.ControlLabel>ຊື່ພະແນກ</Form.ControlLabel>
                            <Form.Control value={inputs.departName} onChange={(e) => handleChange('departName', e)} placeholder='ຊື່ພະແນກ' />
                        </Form.Group>
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
