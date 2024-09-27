import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Input } from 'rsuite';
import { Config, Urlimage } from '../../config/connection';
import { Notification } from '../../utils/Notification';
import axios from 'axios';
const ModalSetpos = ({ dataId, itemData, show, handleClose }) => {
    const url = Urlimage.url;
    const api = Config.urlApi;
    const branch_id_fk = localStorage.getItem('branch_Id');

    const [valueName, setValueName] = useState("");
    const [filterDate, setFilterDate] = useState([]);
    const [cart, setCart] = useState([]);

    const [inputs, setInputs] = useState({
        porduct_main_fk: dataId,
        branch_id_fk: branch_id_fk,
        datalist: [],
    });

    const handleInputChange = (value) => {
        setValueName(value);
        if (value) {
            setFilterDate(itemData.filter(n =>
                n.product_name.toLowerCase().includes(value.toLowerCase()) ||
                n.product_code.toLowerCase().includes(value.toLowerCase())
            ));
        } else {
            setFilterDate([]);
        }
    };

    const addToCart = (product) => {
        setFilterDate([]);
        setValueName('');
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.product_id_fk === product.product_id_fk);
            if (existingProduct) {
                Notification.error('ມີການແອັດແລ້ວ ກະລຸນາເລືອກລາຍການໃໝ່', 'ແຈ້ງເຕືອນ');
                return prevCart;
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });

        setInputs((prevInputs) => {
            const updatedDataList = [
                ...prevInputs.datalist.filter(item => item.product_id_fk !== product.product_id_fk),
                { product_id_fk: product.product_id_fk, quantity: 1 }
            ];
            return { ...prevInputs, datalist: updatedDataList };
        });
    };

    const removeFromCart = (product) => {
        setCart((prevCart) => prevCart.filter(item => item.product_id_fk !== product.product_id_fk));
        setInputs((prevInputs) => {
            const updatedDataList = prevInputs.datalist.filter(item => item.product_id_fk !== product.product_id_fk);
            return { ...prevInputs, datalist: updatedDataList };
        });
    };

    const addQuantity = (name, value, product_id) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.product_id_fk === product_id ? { ...item, quantity: parseFloat(value) } : item
            )
        );

        setInputs((prevInputs) => {
            const updatedDataList = [
                ...prevInputs.datalist.filter(item => item.product_id_fk !== product_id),
                { product_id_fk: product_id, quantity: parseFloat(value) }
            ];
            return { ...prevInputs, datalist: updatedDataList };
        });
    };


    const datasp = {
        product_id: dataId,
        branch_id_fk: branch_id_fk
    };
    const [itemSet, setItemSet] = useState([]);
    const fetchSetPos = async () => {
        try {
            const response = await axios.post(api + 'actionps/setps/', datasp);
            setItemSet(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const handleSubmitSetps = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(api + 'porduct/set', inputs);
            if (res.status === 200) {
                setCart([])
                fetchSetPos();
                Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
            } else {
                Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }
        } catch (error) {
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    };
   

    const handleDelSet = async (id) => {
        axios.delete(`${api}porduct/del/${id}`).then(function (resp) {
            if (resp.status === 200) {
                fetchSetPos();
                Notification.success('ລົບຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }
        }).catch((error) => {
            Notification.error('ລົບຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        })
    }

    useEffect(() => {
        fetchSetPos();
        setInputs(prevInputs => ({
            ...prevInputs,
            porduct_main_fk: dataId,
        }));
    }, [dataId]);
    return (
        <>
            <Modal show={show} onHide={handleClose} size='lg '>
                <Modal.Header className='py-2 bg-bps text-white rounded-top' closeButton>
                    <Modal.Title>ຈັດເຊັດສິນຄ້າ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmitSetps}>
                    <Modal.Body>
                        <div className="form-group">
                            <label htmlFor="" className='form-label'>ເລືອກລາຍການສິນຄ້າ</label>
                            <Input
                                block
                                value={valueName}
                                onChange={(e) => handleInputChange(e)}
                                placeholder='ເລືອກສິນຄ້າ'
                            />
                            {filterDate.length > 0 ? (
                                <ul className="autocomplete-suggestions">
                                    {filterDate.map((item, index) => (
                                        <li key={index} onClick={() => addToCart(item)} className="autocomplete-suggestion">
                                            {item.product_name}
                                            <div>{item.product_code}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                valueName && (
                                    <div className="text-center">
                                        <img src="./assets/img/icon/ic_no_result.svg" className='w-150px' alt="No results" />
                                    </div>
                                )
                            )}
                        </div>
                        <div className="table-responsive mt-3">
                            {cart.length > 0 ? (
                                <table className='table text-nowrap'>
                                    <thead>
                                        <tr>
                                            <th width='1%'>ລ/ດ</th>
                                            <th colSpan={2}>ລາຍການ</th>
                                            <th width='20%'>ອັດຕາສ່ວນ</th>
                                            <th width='5%' className='text-center'>ຈັດການ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((item, index) => (
                                            <tr key={item.product_id_fk}>
                                                <td className='text-center'>{index + 1}</td>
                                                <td width={'1%'} className='text-center'>
                                                    <img src={item.ps_image === '' ? '/assets/img/icon/picture.jpg' : `${url}pos/${item.ps_image}`} className="rounded h-30px" alt="product" />
                                                </td>
                                                <td>{item.product_name}</td>
                                                <td>
                                                    <Input
                                                        type='number'
                                                        value={item.quantity}
                                                        onChange={(e) => addQuantity('quantity', e, item.product_id_fk)}
                                                        size='sm'
                                                        block
                                                    />
                                                </td>
                                                <td className='text-center'>
                                                    <span role='button' onClick={() => removeFromCart(item)} className='text-red'>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <table className='table text-nowrap'>
                                    <thead>
                                        <tr>
                                            <th width='1%'>ລ/ດ</th>
                                            <th colSpan={2}>ລາຍການ</th>
                                            <th width='20%'>ອັດຕາສ່ວນ</th>
                                            <th width='5%' className='text-center'>ຈັດການ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemSet.map((role, key) => (
                                            <tr key={key}>
                                                <td className='text-center'>{key + 1}</td>
                                                <td width={'1%'} className='text-center'>
                                                    <img src={role.imgPos === '' ? '/assets/img/icon/picture.jpg' : `${url}pos/${role.imgPos}`} className="rounded h-30px" alt="product" />
                                                </td>
                                                <td>{role.product_name}</td>
                                                <td>{role.quantity} {role.unit_name}</td>
                                                <td className='text-center'>
                                                    <span role='button' onClick={() => handleDelSet(role.set_pos_id)} className='text-red'>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </Modal.Body>
                    {cart.length > 0 && (
                        <Modal.Footer className='py-1'>
                            <Button type='submit' variant="primary" > ບັນທຶກ</Button>
                            <Button variant="danger" onClick={handleClose}> ຍົກເລີກ</Button>
                        </Modal.Footer>
                    )}
                </form>
            </Modal>

            {/* <Modal size="sm" show={showQtyModal} onHide={() => setShowQtyModal(false)}>
                <Modal.Body className='calculator'>
                    <div className="screen">
                        <span className='float-start' onClick={handleClear} role='button'><i className="fa-solid fa-circle-xmark"></i></span>
                        <span id="result">{qty}</span>
                    </div>
                    <div className="cal-buttons">
                        <table width={'100%'} id="buttons">
                            <tbody>
                                <tr>
                                    <td onClick={() => handleKey(7)}>7</td>
                                    <td onClick={() => handleKey(8)}>8</td>
                                    <td onClick={() => handleKey(9)}>9</td>
                                </tr>
                                <tr>
                                    <td onClick={() => handleKey(4)}>4</td>
                                    <td onClick={() => handleKey(5)}>5</td>
                                    <td onClick={() => handleKey(6)}>6</td>
                                </tr>
                                <tr>
                                    <td onClick={() => handleKey(3)}>3</td>
                                    <td onClick={() => handleKey(2)}>2</td>
                                    <td onClick={() => handleKey(1)}>1</td>
                                </tr>
                                <tr>
                                    <td onClick={() => handleKey(0)}>0</td>
                                    <td onClick={handleUseQty} className='bg-green'>ok</td>
                                    <td onClick={handleDeleteText} className='bg-red-400'><i className="fa-solid fa-delete-left"></i></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>

            </Modal> */}
        </>
    );
};

export default ModalSetpos;
