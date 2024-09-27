import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Input, InputGroup, InputPicker, Modal } from 'rsuite';
import { Config } from '../../config/connection';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import numeral from 'numeral';
import { Notification } from '../../utils/Notification';
import ModalAddStock from './Modal-addStock';
export default function AddToStock() {
    const api = Config.urlApi;
    const [open, setOpen] = React.useState(false);
    const branch_id_fk = localStorage.getItem('branch_Id');
    const shop_id_fk = localStorage.getItem('shop_id_fk');
    const type = [
        { label: 'ຄົ້ນຫາສິນຄ້າ', value: '1' },
        { label: 'ເລືອກຫຼາຍສິນຄ້າ', value: '2' },
        { label: 'ສະແກນບາໂຄດ', value: '3' },
        { label: 'ເລີ່ມໃໝ່', value: '4' },
    ]
    const [useAdd, setUseAdd] = useState('1')
    const handleCheck = (index) => {
        setUseAdd(index)
        if (index === '2') {
            setOpen(true);

        }
    }
    const [values, setValues] = useState({
        productName: '',
        branch_id_fk: branch_id_fk,
        shop_id_fk: shop_id_fk
    });

    const [itemData, setItemData] = useState([]);
    const fetchDataPos = async () => {
        try {
            const response = await axios.post(api + 'actionps/fetch', values);
            const jsonData = response.data;
            setItemData(jsonData);
            console.log(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    // =============



    const handleChengePorduct = (name, event) => {
        setValues({
            ...values, [name]: event
        })
    }

    // ======================
    const [cartItems, setCartItems] = useState([]); // Array of items added to the cart
    const addToCart = (item) => {
        // setCartItems([...cartItems, item]);
        const itemExists = cartItems.some(cartItem => cartItem.product_name === item.product_name);
        if (!itemExists) {
            const itemWithDefaults = {
                ...item,
                quantity: 1,
                status_use: 1,
            };

            setCartItems([...cartItems, itemWithDefaults]);
        }
        setValues({
            ...values, productName: ''
        })
    };

    const handleMoveCaht = (itemToRemove) => {
        const updatedCartItems = cartItems.filter(item => item.product_code !== itemToRemove.product_code);
        setCartItems(updatedCartItems);
    };


    const handleChange = (name, event, index) => {
        const updatedCartItems = cartItems.map((item, idx) => {
            if (idx === index) {
                switch (name) {
                    case 'prices':
                        return { ...item, price_sale: parseFloat(event.replace(/,/g, '')) };
                    case 'discount':
                        return { ...item, discount_sale: parseFloat(event.replace(/,/g, '')) };
                    case 'quantity':
                        return { ...item, quantity: parseInt(event, 10) };
                    default:
                        return item;
                }
            }
            return item;
        });
        setCartItems(updatedCartItems);
    }

    const handleCheckboxChange = (event, index) => {
        const { checked } = event.target;
        const updatedCartItems = cartItems.map((item, idx) => {
            if (idx === index) {
                return { ...item, status_use: checked ? 1 : 0 };
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
                        setCartItems([])
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
        fetchDataPos()
        if (!values.productName) {
            setItemData([]);
        }
    }, [values])
    const navigate = useNavigate();
const handleBack=()=>{
    navigate('/stock')
}
    return (
        <div id="content" class="app-content p-0 bg-component">
            <div class="app-content-padding  px-4 py-3">
                <div class="d-lg-flex mb-lg-3 row mb-2">
                    <div className="col-2 col-sm-1">
                    <Button size='lg' onClick={handleBack} color='red' appearance="primary">
                    <i class="fa-solid fa-arrow-left"/>
                    </Button>
                    </div>
                    <div class="col-sm-3 col-6 page-header mb-2 ">
                      <InputPicker  block data={type} onChange={(e) => handleCheck(e)} defaultValue={'1'} />
                    </div>
                    <div class="col-sm-6 col-9  mb-2 ">
                        {useAdd === '3' ? (
                            <Input block placeholder='|||||||||||||||||' className='fs-16px text-center' />
                        ) : (
                            <InputGroup inside>
                                <InputGroup.Addon><i className='fas fa-search' /> </InputGroup.Addon>
                                <Input block value={values.productName} onChange={(e) => handleChengePorduct('productName', e)} placeholder='ຊື່ສິນຄ້າ/ລະຫັດສິນຄ້າ' className='fs-16px' />
                            </InputGroup>)}
                        {itemData.length > 0 ? (
                            <div class="dropdown-menu show  w-40 dropdown-menu-end" data-scrollbar="true">
                                {itemData.map((item, index) => (
                                    <>
                                        <button onClick={() => addToCart(item)} class="dropdown-item">
                                            {item.product_name}
                                            <div>{item.product_code}</div>
                                        </button>
                                    </>
                                ))}
                            </div>
                        ) : (
                            values.productName && (
                                <div class="dropdown-menu show text-center w-40 dropdown-menu-end">
                                    <img src="./assets/img/icon/ic_no_result.svg" className='w-150px' alt="No results" />
                                </div>
                            )
                        )}

                    </div>
                    <div class="col-sm-2 col-3">
                        <Button color="blue" onClick={handleAddStock} appearance="primary" startIcon={<i className='fas fa-check' />} disabled={cartItems <= 0 && 'disabled'}> ຢືນຢັນ</Button>
                    </div>
                </div>
            </div>
            <div className="p-3 pt-1">



                {cartItems.length > 0 ? (
                    <div className="table-responsive">
                        <table class="table table-sm table-striped table-bordered align-middle text-nowrap">
                            <thead className='thead-bps'>
                                <tr className=' py-3'>
                                    <th class="text-center" width="1%">#</th>
                                    <th class="text-center" width="1%">ລ/ດ</th>
                                    <th class="text-center">ລະຫັດ</th>
                                    <th class="">ຊື່ສິ້ນຄ້າ</th>
                                    <th class="" width='20%'>ລາຄາຂາຍ</th>
                                    <th class="" width='15%'>ສ່ວນຫຼຸດ</th>
                                    <th class="text-center" width='13%'>ຈຳນວນ</th>
                                    <th class="text-center" width='5%'>ສະຖານະ</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className='text-center'><button type='buttpm' onClick={() => handleMoveCaht(item)} className='btn btn-xs text-red'><i class="fa-solid fa-trash"></i></button></td>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-center'>{item.product_code}</td>
                                        <td>{item.product_name}</td>
                                        <td>
                                            <InputGroup inside size="sm" >
                                                <Input block value={numeral(item.price_sale).format('0,00')} onChange={(e) => handleChange('prices', e, index)} placeholder='0' />
                                                <InputGroup.Addon>₭ </InputGroup.Addon>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup inside size="sm" >
                                                <Input block value={numeral(item.discount_sale).format('0,00')} onChange={(e) => handleChange('discount', e, index)} placeholder='0' />
                                                <InputGroup.Addon>₭ </InputGroup.Addon>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup inside size="sm" >
                                                <Input type='number' block value={item.quantity} onChange={(e) => handleChange('quantity', e, index)} placeholder='0' />
                                                <InputGroup.Addon>{item.unit_name} </InputGroup.Addon>
                                            </InputGroup>
                                        </td>
                                        <td className='text-center'>
                                            <div className="form-check form-switch text-center">
                                                <input class="form-check-input" type="checkbox" checked={item.status_use === 1}
                                                    onChange={(e) => handleCheckboxChange(e, index)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center">
                        <img src="./assets/img/icon/ic_no_result.svg" className='w-200px' alt="No results" />
                    </div>
                )}
            </div>
            <ModalAddStock
                open={open}
                handleClose={() => setOpen(false)}
            />

        </div>

    )
}
