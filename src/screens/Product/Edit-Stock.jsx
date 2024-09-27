import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Input, InputGroup } from 'rsuite';
import { Config, Urlimage } from '../../config/connection';
import numeral from 'numeral';
import axios from 'axios';
import { Notification } from '../../utils/Notification';
const EditStock = ({ item, show, handleClose,fetchDataStock }) => {
    const api = Config.urlApi;
    const urlImg = Urlimage.url;
    const [values, setValues] = useState({
        stock_id: item.stock_id,
        quantity: item.quantity,
        discount: item.discount,
        prices: item.prices,
        status_use: item.status_use,
        image: '',
        imageps: item.ps_image
    })

    const handleChange = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }


const handleSubmit= async (event)=>{
    event.preventDefault();
    const inputData = new FormData();
    for (const key in values) {
        inputData.append(key, values[key]);
    }
    try {
        const res = await axios.post(api + 'actionps/editstok', inputData);
        if (res.status === 200) {
            fetchDataStock();
            handleClose()
                Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
         
        }
    } catch (error) {
        Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
    }
}



    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const handleQrChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setValues({
                ...values, image: file
            })
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    useEffect(() => {
        setValues({
            stock_id: item.stock_id,
            quantity: item.quantity,
            discount: item.discount,
            prices: item.prices,
            status_use: item.status_use,
            image: '',
            imageps: item.ps_image
        })
        setImageUrl(item.ps_image === '' ? '/assets/img/icon/picture.jpg' : urlImg + 'pos/' + item.ps_image)
    }, [item])
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='py-2 rounded-top text-white text-center bg-bps' closeButton>
                    <Modal.Title >ແກ້ໄຂສະຕ໋ອກສິນຄ້າ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-12 mb-2">
                            <label htmlFor="" className='form-label'>ຊື່ສິ້ນຄ້າ</label>
                            <Input defaultValue={item.product_name} readOnly />
                        </div>
                        <div className="col-sm-6 mb-2">
                            <label htmlFor="" className='form-label'>ລາຄາຂາຍ</label>
                            <InputGroup inside>
                                <Input value={numeral(values.prices).format('0,00')} onChange={(event) => handleChange('prices', event)} />
                                <InputGroup.Addon>/{item.unit_name}</InputGroup.Addon>
                            </InputGroup>
                        </div>
                        <div className="col-sm-6 mb-2">
                            <label htmlFor="" className='form-label'>ສ່ວນຫຼຸດ</label>
                            <InputGroup >
                                <Input value={numeral(values.discount).format('0,00')} onChange={(event) => handleChange('discount', event)} />
                            </InputGroup>
                        </div>
                        <div className="col-sm-8 mb-2">
                            <label htmlFor="" className='form-label'>ຈຳນວນ</label>
                            <InputGroup inside>
                                <Input type='number' value={values.quantity} onChange={(event) => handleChange('quantity', event)} />
                                <InputGroup.Addon>{item.unit_name}</InputGroup.Addon>
                            </InputGroup>
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="" className='form-label'>ສະຖານະ</label>
                            <Form.Select aria-label="" value={values.status_use} onChange={(event) => handleChange('status_use', event.value)}>
                                <option value="1">ເປິດໃຊ້ງານ</option>
                                <option value="2">ປິດໃຊ້ງານ</option>
                            </Form.Select>
                        </div>

                        <div className="col-sm-12 text-center mt-3">
                            <img src={imageUrl} class="w-150px h-150px rounded-3" />
                            <br />
                            <label className='btn btn-success mt-1'>
                                <input type="file" className='hide' onChange={handleQrChange} accept="image/*" />
                                {selectedFile === null ? (
                                    <><i class="fa-solid fa-camera" /> ຮູບສິນຄ້າ...</>
                                ) : (
                                    <><i class="fa-regular fa-image" /> ປ່ຽນຮູບ...</>
                                )}
                            </label>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer className='py-1'>
                    <Button type='submit' variant="primary" >
                        ແກ້ໄຂຂໍ້ມູນ
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        ຍົກເລີກ
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default EditStock;