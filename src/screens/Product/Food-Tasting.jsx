import React, { useEffect, useState } from 'react'
import { Config } from '../../config/connection'
import { Modal, Button } from 'react-bootstrap';
import { Input } from 'rsuite';
import numeral from 'numeral';
import axios from 'axios';
import { Notification } from '../../utils/Notification';
const FoodTasting = ({ psId, show, handleClose, status }) => {
    const api = Config.urlApi;
    const [inputs, setInputs] = useState({
        tastingId: '',
        product_id_fk: psId,
        tasting_name: '',
        tasting_price: '0'
    })
    const handleTasting = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }


    const handleSubmitTasting = async (event) => {
        event.preventDefault();
        try {
            axios.post(api + 'tasting/create', inputs)
                .then(function (res) {
                    if (res.status === 200) {
                        fetchTasting()
                        setCheckButton(1)
                        Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
                        setInputs({
                            tastingId: '',
                            product_id_fk: psId,
                            tasting_name: '',
                            tasting_price: '0'
                        })
                    }
                })
        } catch (error) {
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    }


    const [itemTasting, setItemTasting] = useState([]);
    const fetchTasting = async () => {
        try {
            const response = await axios.get(api + 'tasting/' + psId);
            setItemTasting(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);

        }
    }

    const [checkButton, setCheckButton] = useState(1)
    const editTasting = (item) => {
        setInputs({
            tastingId: item.tasting_id,
            product_id_fk: psId,
            tasting_name: item.tasting_name,
            tasting_price: item.tasting_price
        })
        setCheckButton(2)
    }

    //========= delete option ==============
    const deleteTasting = async (id, idPs) => {
        axios.delete(api + `tasting/${id}`).then(function (resp) {
            if (resp.status === 200) {
                fetchTasting();
                Notification.success('ລົບຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }
        }).catch((error) => {
            Notification.error('ລົບຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        })
    }

    useEffect(() => {
        fetchTasting();
        setInputs(prevInputs => ({
            ...prevInputs,
            product_id_fk: psId,
        }));
    }, [psId])
    return (
        <Modal size='lg' show={show} onHide={handleClose}>
            <Modal.Header className='py-2 text-white bg-bps rounded-top' closeButton>
                <Modal.Title>ລົດຊາດອາຫານ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {status === 1 && (
                    <form onSubmit={handleSubmitTasting}>
                        <div className="row mb-2">
                            <div className="col-sm-5">
                                <label htmlFor="" className='form-label'>ຊື່ລົດຊາດ</label>
                                <Input value={inputs.tasting_name} onChange={(e) => handleTasting('tasting_name', e)} placeholder='ຊື່ລົດຊາດ' required />
                            </div>
                            <div className="col-sm-5 col-10">
                                <label htmlFor="" className='form-label'>ລາຄາ</label>
                                <Input value={numeral(inputs.tasting_price).format('0,00')} onChange={(e) => handleTasting('tasting_price', e)} placeholder='0,000' required />
                            </div>
                            <div className="col-2 mt-4">
                                <Button type='submit' color='red' variant={checkButton === 1 ? 'primary' : 'success'}>{checkButton === 1 ? 'ເພີ່ມ' : 'ແກ້ໄຂ'}</Button>
                            </div>
                        </div>
                    </form>
                )}
                <table className='table table-sm text-nowrap'>
                    <thead>
                        <tr>
                            <th className='text-center' width={'2%'}>ລ/ດ</th>
                            <th>ຊື່ລົດຊາດ</th>
                            <th className='text-end'>ລາຄາ</th>
                            <th className='text-center' width={'10%'}>ຕັ້ງຄ່າ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemTasting.map((item, key) =>
                            <tr>
                                <td className='text-center'>{key + 1}</td>
                                <td>{item.tasting_name}</td>
                                <td className='text-end'>{numeral(item.tasting_price).format('0,00')} ₭</td>
                                <td className='text-center'>
                                    {status === 1 && (
                                        <>
                                        <button type='button' onClick={() => editTasting(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square" /></button>
                                        <button type='button' onClick={() => deleteTasting(item.tasting_id)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash" /></button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </Modal.Body>
        </Modal>
    )
}

export default FoodTasting