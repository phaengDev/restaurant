import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, InputGroup } from 'rsuite'
import { Config } from '../../config/connection';
import numeral from 'numeral';
import axios from 'axios';
import { Notification } from '../../utils/Notification';
const ModalAddStock = ({ open, handleClose }) => {
    const api = Config.urlApi;
    const branch_id_fk = localStorage.getItem('branch_Id');
    const shop_id_fk = localStorage.getItem('shop_id_fk');
    const values = {
        branch_id_fk: branch_id_fk,
        shop_id_fk: shop_id_fk
    };
    const [itemPorduct, setItemProduct] = useState([]);
    const fetchDataPorduct = async () => {
        try {
            const response = await axios.post(api + 'actionps/fetchMt', values);
            const jsonData = response.data;
            setItemProduct(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const [cartItems, setCartItems] = useState([]);

    const handleCheckboxChange = (row, index) => {
        const updatedItems = itemPorduct.map((item, idx) => {
            if (idx === index) {
                const isChecked = item.checkuse === 1;
                // Toggle the checkuse status
                const updatedItem = { ...item, checkuse: isChecked ? 0 : 1 };
                // If unchecked, remove the item from the cart
                if (isChecked) {
                    setCartItems(cartItems.filter(cartItem => cartItem.product_name !== item.product_name));
                } else {
                    // If checked, add the item to the cart
                    const itemExists = cartItems.some(cartItem => cartItem.product_name === item.product_name);
                    if (!itemExists) {
                        const itemWithDefaults = {
                            ...updatedItem,
                            quantity: 0,
                            status_use: 1,
                        };
                        setCartItems([...cartItems, itemWithDefaults]);
                    }
                }
                return updatedItem;
            }
            return item;
        });

        setItemProduct(updatedItems);
    };



    const handleChange = (name, event, index) => {
        const updatedCartItems = cartItems.map((item, idx) => {
            if (item.product_id === itemPorduct[index].product_id) {
                let updatedValue;
                if (name === 'quantity') {
                    updatedValue = parseInt(event, 10); // Convert to integer for quantity
                } else {
                    updatedValue = parseFloat(event.replace(/,/g, '')); // Convert to float for price and discount
                }
    
                return { ...item, [name]: isNaN(updatedValue) ? 0 : updatedValue }; // Update the corresponding field
            }
            return item;
        });
    
        setCartItems(updatedCartItems);
    };

    const formData = {
        branch_id_fk: branch_id_fk,
        productList: cartItems
    }
    const handleAddStock = () => {
        try {
            axios.post(api + 'porduct/addStock', formData)
                .then(function (res) {
                    if (res.status === 200) {
                        fetchDataPorduct();
                        handleClose()
                        Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
                    } else {
                        Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
                    }
                })
                .catch(function (error) {
                    Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
                });
        } catch (error) {
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    };

    useEffect(() => {
        fetchDataPorduct();
    }, [])
    return (
        <Modal overflow={true} open={open} size={'lg'} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title className='py-1'>ເພີ່ມລາຍການສິນ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <table class="table table-sm table-striped table-bordered align-middle text-nowrap">
                        <thead className='thead-bps'>
                            <tr className=' py-3'>
                                <th class="text-center" width="5%">#</th>
                                <th class="text-center" width="5%">ລ/ດ</th>
                                <th class="text-center">ລະຫັດ</th>
                                <th class="">ຊື່ສິ້ນຄ້າ</th>
                                <th class="text-end" width='20%'>ລາຄາຂາຍ</th>
                                <th class="text-end" width='15%'>ສ່ວນຫຼຸດ</th>
                                <th class="text-end" width='15%'>ຈຳນວນ</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {itemPorduct.map((row, index) => {
                                // Find the corresponding cart item by product_code
                                const cartItem = cartItems.find(item => item.product_id === row.product_id);

                                return (
                                    <tr>
                                        <td className='text-center'><input class="form-check-input" type="checkbox" checked={row.checkuse === 1}
                                            onChange={() => handleCheckboxChange(row, index)} /></td>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-center'>{row.product_code}</td>
                                        <td>{row.product_name}</td>
                                        <td className='text-end'>
                                            {row.checkuse === 1 ? (
                                                <InputGroup inside size="sm" >
                                                    <Input block value={numeral(cartItem.price_sale ).format('0,00')} onChange={(e) => handleChange('price_sale', e, index)} placeholder='0' />
                                                    <InputGroup.Addon>₭ </InputGroup.Addon>
                                                </InputGroup>
                                            ) : (
                                                numeral(row.price_sale).format('0,00')
                                            )}
                                        </td>
                                        <td className='text-end'>
                                            {row.checkuse === 1 ? (
                                                <InputGroup inside size="sm" >
                                                    <Input block value={numeral(cartItem.discount_sale ).format('0,00')} onChange={(e) => handleChange('discount_sale', e, index)} placeholder='0' />
                                                    <InputGroup.Addon>₭ </InputGroup.Addon>
                                                </InputGroup>
                                            ) : (
                                                numeral(row.discount_sale).format('0,00')
                                            )}
                                        </td>
                                        <td className='text-end'>
                                            {row.checkuse === 1 && (
                                                <InputGroup inside size="sm" >
                                                    <Input type='number' block onChange={(e) => handleChange('quantity', e, index)} placeholder='0' />
                                                    <InputGroup.Addon>{row.unit_name} </InputGroup.Addon>
                                                </InputGroup>
                                            )}
                                        </td>
                                    </tr>
                                );
} 
)}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleAddStock} appearance="primary" disabled={cartItems.length <= 0 && 'disabled'}> ບັນທຶກ</Button>
                <Button onClick={handleClose} appearance="primary" color='red'> ຍົກເລີກ</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAddStock