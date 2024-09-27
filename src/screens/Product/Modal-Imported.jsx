import React, { useEffect, useState } from 'react'
import { Modal, Button, SelectPicker, Input, InputGroup } from 'rsuite';
import { Config } from '../../config/connection';
import axios from 'axios';
import numeral from 'numeral';
import { useCategory, useBrandCart } from '../../config/select-option';
import { Notification } from '../../utils/Notification';
const ModalImported = ({ show, handleClose, fetchData }) => {
    const api = Config.urlApi;
    const shopId = localStorage.getItem('shop_id_fk');
    const branch_id_fk = localStorage.getItem('branch_Id');
    const [query, setQuery] = useState({
        shopId_fk: shopId,
        categories_id_fk: '',
        brands_id_fk: '',
        units_id_fk: '',
    })

    const itemCate = useCategory();
    const [selectedBrand, setSelectedBrand] = useState('');
    const itemBrand = useBrandCart(selectedBrand);
    const handleShearch = (name, value) => {
        if (name === 'categories_id_fk') {
            setSelectedBrand(value);
        }
        setQuery({
            ...query, [name]: value
        })
    }



    const [isLoading, setLoading] = useState(true);
    const [itemData, setItemData] = useState([]);
    const [filter, setFilter] = useState([]);
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.post(api + 'porduct/', query);
            setItemData(response.data);
            setFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleFilter = (event) => {
        setItemData(filter.filter(n =>
            n.product_name.toLowerCase().includes(event) ||
            n.product_code.toLowerCase().includes(event)
        ));
    }

    const [dataList, setDataList] = useState([]);

    const handleCheckboxChange = (product) => {
        setDataList((prevDataList) => {
            const itemIndex = prevDataList.findIndex(item => item.product_id === product.product_id);
            if (itemIndex !== -1) {
                return prevDataList.filter(item => item.product_id !== product.product_id);
            } else {
                return [
                    ...prevDataList,
                    { product_id: product.product_id, price_sale: product.price_sale, quantity: 1 }
                ];
            }
        });
    };

    const handleQtyChange = (productId, name, value) => {
        setDataList((prevDataList) => {
            return prevDataList.map(item =>
                item.product_id === productId
                    ? { ...item, [name]: value }
                    : item
            );
        });
    };
    const formData = {
        branch_id_fk: branch_id_fk,
        productList: dataList
    }
    const handleImported = async () => {
        try {
            const res = await axios.post(api + 'recived/create', formData);
            if (res.status === 200) {
                fetchData();
                handleClose();
                setDataList([])
                fetchProducts();
                Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
            } else {
                Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }
        } catch (error) {
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [query])
    return (
        <>
            <Modal open={show} size={'lg'} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title className='my-1'>ລາຍການສິນຄ້າ</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div className='row mb-2'>
                        <div className="col-sm-3 col-6">
                            <label htmlFor="" className='form-label'> ໝວດໝູ່ສິນຄ້າ</label>
                            <SelectPicker data={itemCate} onChange={(e) => handleShearch('categories_id_fk', e)} block />
                        </div>
                        <div className="col-sm-3 col-6">
                            <label htmlFor="" className='form-label'> ປະເພດສິນຄ້າ</label>
                            <SelectPicker data={itemBrand} onChange={(e) => handleShearch('brands_id_fk', e)} block />
                        </div>
                        <div className="col-sm-6 col-6">
                            <label htmlFor="" className='form-label'> ຄົ້ນຫາຊື່ສິນຄ້າ</label>
                            <InputGroup inside>
                                <InputGroup.Addon>
                                    <i className='fas fa-search' />
                                </InputGroup.Addon>
                                <Input block onChange={(e) => handleFilter(e)} placeholder='ຄົ້ນຫາຊື່ສິນຄ້າ' />
                            </InputGroup>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table class="table table-striped table-bordered align-middle text-nowrap">
                            <thead className='thead-bps'>
                                <tr>
                                    <th class="text-center" width="1%">ລ/ດ</th>
                                    <th class="text-center" width="1%">ຕັ້ງຄ່າ</th>
                                    <th class="text-center">ລະຫັດ</th>
                                    <th class="">ຊື່ສິ້ນຄ້າ</th>
                                    <th class="text-end" width='20%'>ລາຄາຂາຍ</th>
                                    <th class="text-center" width='15%'>ຈຳນວນ</th>
                                    <th class="">ໝວດໝູ່</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemData.length > 0 ? (
                                    itemData.map((item, key) => {
                                        const itemDataInList = dataList.find(data => data.product_id === item.product_id);
                                        return (
                                            <tr key={key}>
                                                <td className='text-center'>{key + 1}</td>
                                                <td className='text-center'> <input class="form-check-input" type="checkbox" checked={!!dataList.find(data => data.product_id === item.product_id)}
                                                    onChange={() => handleCheckboxChange(item)} /></td>
                                                <td className='text-center'>{item.product_code}</td>
                                                <td className=''>{item.product_name}</td>
                                                <td className='text-end'>
                                                    {itemDataInList ? (
                                                        <Input type='tel' size='sm'
                                                            value={numeral(itemDataInList.price_sale).format('0,00')} 
                                                            onChange={(e) => handleQtyChange(item.product_id, 'price_sale', (e))} />
                                                    ) : (
                                                        numeral(item.price_sale).format('0,00')  // formatted when not editable
                                                    )}
                                                </td>
                                                <td className='text-center'>
                                                    {itemDataInList ? (
                                                        <Input
                                                            type='number'
                                                            size='sm'
                                                            value={itemDataInList.quantity || 1}
                                                            onChange={(e) => handleQtyChange(item.product_id, 'quantity', parseInt(e))}
                                                        />
                                                    ) : (
                                                        '0'
                                                    )}
                                                </td>
                                                <td className=''>{item.categories_name}</td>
                                            </tr>
                                        )
                                    }
                                    )) : (
                                    <tr>
                                        <td colSpan={7} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການບັນທຶກ</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleImported} appearance="primary" disabled={dataList.length > 0 ? false : true}> ບັນທຶກນຳເຂົ້າ</Button>
                    <Button onClick={handleClose} color='red' appearance="primary"> ຍົກເລີກ </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalImported
