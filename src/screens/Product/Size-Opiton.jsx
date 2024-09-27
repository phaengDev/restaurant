import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import { Input, Button } from 'rsuite';
import numeral from 'numeral';
import { Config } from '../../config/connection';
import axios from 'axios';
import { Notification } from '../../utils/Notification';
const SizeOpiton = ({ id, show, handleClose, status }) => {
    const api = Config.urlApi;
    //========== fetch opiton===========
    const [values, setValues] = useState({
        optionId: '',
        option_name: '',
        option_price: '0',
        product_id_fk: id,
    })
    const handleOption = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }
    const handleSubmitOpiton = async (event) => {
        event.preventDefault();
        try {
            axios.post(api + 'porduct/addOpton', values)
                .then(function (res) {
                    if (res.status === 200) {
                        showOption(res.data.id)
                        setCheckButton(1)
                        Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
                        setValues({
                            optionId: '',
                            option_name: '',
                            option_price: '0',
                            product_id_fk: res.data.id,
                        })
                    }
                })
        } catch (error) {
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    }

    const [itemOption, setItemOption] = useState([]);
    const showOption = async () => {
        try {
            const response = await axios.get(api + 'porduct/showpt/' + id);
            setItemOption(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);

        }
    };
    //========= delete option ==============
    const deleteOpiton = async (id, idPs) => {
        axios.delete(api + `porduct/delop/${id}`).then(function (resp) {
            if (resp.status === 200) {
                showOption(idPs);
                Notification.success('ລົບຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }
        }).catch((error) => {
            Notification.error('ລົບຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        })
    }
    const [checkButton, setCheckButton] = useState(1)

    const editOption = (item) => {
        setValues({
            optionId: item.option_id,
            option_name: item.option_name,
            option_price: item.option_price,
            product_id_fk: item.product_id_fk,
        });
        setCheckButton(2)
    }
    useEffect(() => {
        showOption()
        setValues(prevInputs => ({
            ...prevInputs,
            product_id_fk: id,
        }));
    }, [id])
    return (

        <Modal size='lg' show={show} onHide={handleClose}>
            <Modal.Header className='py-2 text-white bg-bps rounded-top' closeButton>
                <Modal.Title>ລາຍລະອຽດ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {status === 1 && (
                    <form onSubmit={handleSubmitOpiton}>
                        <div className="row mb-2">
                            <div className="col-sm-5">
                                <label htmlFor="" className='form-label'>ຊື່ສິ້ນຄ້າ</label>
                                <Input value={values.option_name} onChange={(e) => handleOption('option_name', e)} placeholder='ຊື່ສິ້ນຄ້າ' required />
                            </div>
                            <div className="col-sm-5 col-10">
                                <label htmlFor="" className='form-label'>ລາຄາຂາຍ</label>
                                <Input value={numeral(values.option_price).format('0,00')} onChange={(e) => handleOption('option_price', e)} placeholder='0,000' required />
                            </div>
                            <div className="col-2 mt-4">
                                <Button type='submit' color={checkButton === 1 ? 'blue' : 'green'} appearance="primary" >{checkButton === 1 ? 'ເພີ່ມ' : 'ແກ້ໄຂ'}</Button>
                            </div>
                        </div>
                    </form>
                )}
                <table className='table table-sm text-nowrap'>
                    <thead>
                        <tr>
                            <th className='text-center' width={'2%'}>ລ/ດ</th>
                            <th>ຊື່</th>
                            <th className='text-end'>ລາຄາ</th>
                            <th className='text-center' width={'10%'}>ຕັ້ງຄ່າ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemOption.map((item, key) =>
                            <tr>
                                <td className='text-center'>{key + 1}</td>
                                <td>{item.option_name}</td>
                                <td className='text-end'>{numeral(item.option_price).format('0,00')} ₭</td>
                                <td className='text-center'>
                                    {status === 1 && (
                                        <>
                                            <button type='button' onClick={() => editOption(item)} className='btn btn-xs btn-blue me-2'><i class="fa-solid fa-pen-to-square" /></button>
                                            <button type='button' onClick={() => deleteOpiton(item.option_id, item.product_id_fk)} className='btn btn-xs btn-danger'><i class="fa-solid fa-trash" /></button>
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

export default SizeOpiton