import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { Urlimage } from '../../config/connection';
import numeral from 'numeral';
import { Input } from 'rsuite';
import { Notification } from '../../utils/Notification';
import axios from 'axios';
import { Config } from '../../config/connection';
const ModalOrder = ({ open, handleClose, item, tableId,fetchCartOrder }) => {
    const imgUrl = Urlimage.url;
    const api=Config.urlApi;
    const branch_id_fk = localStorage.getItem('branch_Id');
    const user_Id = localStorage.getItem('user_Id');

    const [dataOrder, setDataOrder] = useState({
        branch_id_fk: branch_id_fk,
        user_id_fk: user_Id,
        table_id_fk: tableId,
        product_id_fk: item.product_id_fk,
        qty_order: 1,
        price_sale: item.prices,
        discount_price: item.discount,
        total_price:item.price_sale,
        size_id_fk:null,
        option_name: '',
        order_detail: '',
        tasting_list:[]
    })

    const handleUseTasting = (data) => {
        setDataOrder(prevState => {
            const isAlreadySelected = prevState.tasting_list.some(tasting => tasting.tasting_id === data.tasting_id);
            
            let updatedTastingList;
            if (isAlreadySelected) {
                updatedTastingList = prevState.tasting_list.filter(tasting => tasting.tasting_id !== data.tasting_id);
            } else {
                updatedTastingList = [...prevState.tasting_list, data];
            }
    
            return {
                ...prevState,
                tasting_list: updatedTastingList
            };
        });
    };

    const handleQty = (change) => {
        setDataOrder((prevState) => {
            const newQty = prevState.qty_order + change;
            return {
                ...prevState,
                qty_order: newQty > 0 ? newQty : 1, // Ensure qty_order doesn't go below 1
            };
        });
    };

    const handleChange=(name,value)=>{
        setDataOrder((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

const handleUseSize=(data)=>{
    setDataOrder((prevState) => ({
        ...prevState,
        size_id_fk: data.option_id,
        price_sale: data.option_price,
        total_price: data.option_price-item.discount,
        option_name:data.option_name
    }));
}

const AddOrders=()=>{
    // console.log(dataOrder);return;
    try {
        axios.post(api + 'cart/create', dataOrder)
          .then(function (res) {
            if (res.status === 200) {
                handleClose()
                fetchCartOrder()
              Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }else{
              Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }
          })
      } catch (error) {
        Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
      }
}

    useEffect(() => {
        setDataOrder(prevInputs => ({
            ...prevInputs,
            branch_id_fk: branch_id_fk,
            user_id_fk: user_Id,
            table_id_fk: tableId,
            product_id_fk: item.product_id_fk,
            qty_order: 1,
            price_sale: item.prices,
            discount_price: item.discount,
            total_price:item.price_sale,
            size_id_fk:null,
            option_name: '',
            order_detail: '',
            tasting_list:[]
        }));
    }, [item])
    return (
        <Modal show={open} onHide={handleClose} size='lg' className='modal-pos'>
            <Modal.Body className='modal-body p-0'>
                <a href="javascript:;" onClick={handleClose} class="btn-close position-absolute top-0 end-0 m-4"></a>
                <div class="modal-pos-product ">
                    <div class="modal-pos-product-img p-0">
                        <div class="img" style={{ backgroundImage: `url(${imgUrl}pos/${item.ps_image === '' ? 'picture.jpg' : item.ps_image})` }}></div>
                    </div>
                    <div class="modal-pos-product-info">
                        <div class="fs-4 fw-bold">{item.product_name}</div>
                        <div class="fs-6 text-body text-opacity-50 mb-2">
                            {item.product_code} 
                        </div>
                        <div class="fs-3 fw-bolder mb-3">{numeral(item.price_sale).format('0,00')} ₭</div>
                        <div class="option-row">
                            <div class="d-flex mb-3">
                                <button type='button' class="btn btn-red  d-flex align-items-center" onClick={()=>handleQty(-1)}><i class="fa fa-minus"></i></button>
                                <input type="text" class="form-control w-50px fw-bold fs-5 px-0 mx-2 text-center border-0" onChange={(e)=>handleChange('qty_order',e)}  value={dataOrder.qty_order} />
                                <button type='button' class="btn btn-green  d-flex align-items-center" onClick={()=>handleQty(+1)}><i class="fa fa-plus"></i></button>
                            </div>
                        </div>

                        {item && item.priceList && item.priceList.length > 0 && (
                            <>
                                <hr />
                                <div class="mb-3">
                                    <div class="fw-bold fs-6">ຂະໜາດ / Size</div>
                                    <div class="option-list">
                                        {item.priceList.map((val, index) => (
                                            <div class="option">
                                                <input type="radio" id={index + 1} onChange={()=>handleUseSize(val)} name="size" class="option-input" />
                                                <label class="option-label" for={index + 1}>
                                                    <span class="option-text">{val.option_name}</span>
                                                    <span class="option-price">{numeral(val.option_price).format('0,00')}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {item && item.foodTasting && item.foodTasting.length > 0 ? (
                            <div class="mb-3">
                                <div class="fw-bold fs-6">ລົດຊາດ </div>
                                <div class="option-list">
                                    {item.foodTasting.map((role, key) => (
                                        <div class="option" key={key}>
                                            <input type="checkbox" onClick={() => handleUseTasting(role)}  value={role.tasting_id} class="option-input" id={`food-${key + 1}`} />
                                            <label class="option-label" for={`food-${key + 1}`}>
                                                <span class="option-text">{role.tasting_name}</span>
                                                <span class="option-price">+ {numeral(role.tasting_price).format('0,00')}</span>
                                            </label>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        ):(
                            <div className="form-group">
                                <label htmlFor="" className='form-label'> ໝາຍເຫດ</label>
                                <Input as='textarea' onChange={(e)=>handleChange('order_detail',e)} placeholder='ໝາຍເຫດ....' />
                            </div>
                        )} 
                        <hr />
                        <div class="row gx-3">
                            <div class="col-4">
                                <button type='button' class="btn btn-danger fs-14px rounded-3 fw-bold mb-0 d-block py-3 w-100" onClick={handleClose}>ຍົກເລີກ</button>
                            </div>
                            <div class="col-8">
                                <button type='button' onClick={AddOrders} class="btn btn-theme fs-14px rounded-3 fw-bold d-flex justify-content-center align-items-center py-3 m-0 w-100">ເພີ່ມລົງກະຕ່າ</button>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal.Body>
        </Modal >
    )
}

export default ModalOrder