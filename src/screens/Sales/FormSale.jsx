import React, { useState, useEffect, useRef } from 'react'
import { Input, InputPicker, InputGroup, Loader } from 'rsuite';
import { Config, Urlimage } from '../../config/connection';
import { useCategory } from '../../config/select-option';
import { useLocation } from 'react-router-dom';
import { Notification } from '../../utils/Notification';
import axios from 'axios';
import numeral from 'numeral';
import ModalOrder from './ModalOrder';
import ModalPayment from './ModalPayment';
export default function FormSale() {
    const shop_id_fk = localStorage.getItem('shop_id_fk');
    const branch_id_fk = localStorage.getItem('branch_Id');
    const api = Config.urlApi
    const imgUrl = Urlimage.url;
    const inputRef = useRef(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tableId = atob(searchParams.get('id'));

    const handleBack = () => {
        window.location.href = '/sale';
    }

    const [inputs, setInputs] = useState({
        branch_id_fk: branch_id_fk,
        categoriesId_fk: '',
    })

    const itemCate = useCategory();
    const [itemBrand, setItemBrand] = useState([]);
    const [filters, setFilters] = useState([]);
    const fetchCategory = async () => {
        try {
            const response = await fetch(api + 'brand/' + shop_id_fk);
            const jsonData = await response.json();
            setItemBrand(jsonData);
            setFilters(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const hanchBranch = (event) => {
        if (event === null) {
            setItemBrand(filters); // Show all items
        } else {
            setItemBrand(
                filters.filter(n =>
                    String(n.categories_id_fk).toLowerCase().includes(String(event).toLowerCase())
                )
            );
        }
        setInputs({
            ...inputs, categoriesId_fk: event
        })
    }

    const [itemStock, setItemStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState([]);
    const fetchStock = async () => {
        try {
            const response = await axios.post(api + 'porduct/itemsale/', inputs);
            setItemStock(response.data);
            setFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }


    const handleFilter = (event) => {
        const searchValue = event.toLowerCase();
        const filteredData = filter.filter(item =>
            item.product_name.toLowerCase().includes(searchValue) ||
            item.product_code.toLowerCase().includes(searchValue)
        );
        setItemStock(filteredData);
    };


    const [itemCart, setItemCart] = useState([])
    const fetchCartOrder = async () => {
        try {
            const response = await axios.get(api + 'cart/fetchCart/' + tableId);
            setItemCart(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const hanldePlus = (id) => {
        try {
            axios.get(api + `cart/plus/${id}`).then(function (resp) {
                if (resp.status === 200) {
                    fetchCartOrder();
                    Notification.success('ບວກຈຳນວນສຳເລັດ', 'ແຈ້ງເຕືອນ');
                }
            })
        } catch (error) {
            Notification.error('ບວກຈຳນວນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    }
    const hanldeMinus = (id) => {
        try {
            axios.get(api + `cart/minusQty/${id}`).then(function (resp) {
                if (resp.status === 200) {
                    fetchCartOrder();
                    Notification.success('ລົບຈຳນວນສຳເລັດ', 'ແຈ້ງເຕືອນ');
                }
            })
        } catch (error) {
            Notification.error('ລົບຈຳນວນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    }
    const hanldeDelete = (id) => {
        try {
            axios.delete(api + `cart/delete/${id}/${tableId}`).then(function (resp) {
                if (resp.status === 200) {
                    fetchCartOrder();
                    // Notification.success('ການລົບອໍເດີສຳເລັດ', 'ແຈ້ງເຕືອນ');
                }
            })
        } catch (error) {
            Notification.error('ການລົບອໍເດີບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    }




    useEffect(() => {
        fetchCategory();
        fetchStock();
        fetchCartOrder();
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'f') {
                event.preventDefault();
                inputRef.current.focus();
            } else if (event.ctrlKey && event.key === 'e') {
                event.preventDefault();
                inputRef.current.value = '';
                inputRef.current.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

    }, [inputs]);


    let totalbalance = 0;
    let totaldiscount = 0;
    let subtotal = 0;
    let totalOption = 0;
    if (Array.isArray(itemCart)) {
        itemCart.forEach(item => {
            totalbalance += parseInt(item.price_sale * item.qty_order);
            totaldiscount += parseInt(item.qty_order * item.discount_price);
            subtotal += parseInt(item.total_price * item.qty_order);
            if (Array.isArray(item.tastingUse)) {
                item.tastingUse.forEach(tasting => {
                    if (tasting.tasting_price > 0) {
                        totalOption += parseFloat(tasting.tasting_price) * item.qty_order;
                    }
                });
            }
        });
    }

    const [openpay, setOpenPay] = React.useState(false);
    const handlePayment = () => {
        setOpenPay(true)
    }

    const [open, setOpen] = React.useState(false);
    const [itemps, setItemps] = useState({});
    const handleOrders = (data) => {
        setOpen(true)
        setItemps(data);
    }
    return (
        <div id="app" className="app app-content-full-height app-without-sidebar app-without-header" >
            <div id="content" className="app-content p-0">
                <div className="pos pos-with-menu pos-with-sidebar" id="pos">
                    <div className="pos-menu">
                        <div className="logo">
                            <a href="home">
                                <div className="logo-img">
                                    <img src="./assets/img/logo/logo.png" alt="" />
                                </div>
                                <div className="logo-text">BP Shop </div>
                            </a>
                        </div>
                        <div className="nav-container">
                            <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <span role='button' className="nav-link active" data-filter="all">
                                            <div className="nav-icon">
                                                <i className="fa fa-fw fa-utensils" />
                                            </div>
                                            <div className="nav-text">ປະເພດທັງໝົດ</div>
                                        </span>
                                    </li>
                                    {itemBrand.map((item, index) =>
                                        <li className="nav-item">
                                            <span role='button' className="nav-link" data-filter={`b-${item.brand_id}`}>
                                                <div className="nav-icon">
                                                    <i class="fa-solid fa-layer-group"></i>
                                                </div>
                                                <div className="nav-text">{item.brand_name}</div>
                                            </span>
                                        </li>
                                    )}

                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="pos-content" >
                        <div className='sticky-top bg-bps px-2 p-1 mt-1 rounded-3 me-2 ms-2 nav-container' >
                            <div className="row ">
                                <div className="col-5 col-sm-3">
                                    <InputGroup className='border-0'>
                                        <InputGroup.Button onClick={handleBack} color="blue" appearance="primary" className='me-2 rounded'>
                                            <i class="fa-solid fa-circle-arrow-left fs-4"></i>
                                        </InputGroup.Button>
                                        <InputPicker data={itemCate} onChange={(e) => hanchBranch(e)} placeholder='ໝວດໝູ່' />
                                    </InputGroup>
                                </div>
                                <div className="col-7 col-sm-9">
                                    <InputGroup inside>
                                        <Input ref={inputRef} onChange={(e) => handleFilter(e)} placeholder='ຄົ້ນຫາ ຊື່ສິນຄ້າ/ ລະຫັດສິນຄ້າ/ ລະຫັດບາໂຄດ (Ctrl+F)' />
                                        <InputGroup.Addon>
                                            <i className='fas fa-search' />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <div className="pos-content-container h-100" data-scrollbar="true">
                            <div className="product-row">
                                {loading === true ? (
                                    <Loader backdrop size='lg' content="ກຳລັງໂຫລດຂໍ້ມູນ..." vertical />
                                ) : (<>
                                    {itemStock.map((item, index) => {
                                        const cartItem = itemCart.find(cart => cart.product_id_fk === item.product_id_fk);
                                        return (
                                            <div key={index} className="product-container" data-type={`b-${item.brands_id_fk}`}>
                                                <a href="javascript:;" onClick={() => handleOrders(item)}
                                                    className="product">
                                                    <div className="img"
                                                        style={{
                                                            backgroundImage: `url(${imgUrl}pos/${item.ps_image === '' ? 'picture.jpg' : item.ps_image})`
                                                        }} >
                                                        {itemCart.some(cartItem => cartItem.product_id_fk === item.product_id_fk) && (
                                                            <span className="badge bg-green fs-14px">{cartItem.qty_order}</span>
                                                        )}
                                                    </div>

                                                    <div className="text">
                                                        <div className="title">{item.product_name}</div>
                                                        <div className="desc mb-1">{item.product_code}</div>
                                                        <div className="price "> 
                                                        { item.discount > 0 &&(<span> <s>{numeral(item.prices).format('0,00')} ₭</s> </span> )} 
                                                        <span className='float-end text-red'>{numeral(item.price_sale).format('0,00')} ₭</span>
                                                           </div>
                                                        {/* <div className="price text-end text-red">{numeral(item.prices).format('0,00')} ₭</div> */}
                                                    </div>
                                                </a>
                                            </div>
                                        )
                                    })}

                                </>)}
                            </div>
                        </div>
                    </div>
                    <div className="pos-sidebar ">
                        <div className="h-100 d-flex flex-column p-0 ">
                            <div className="pos-sidebar-header bg-bps">
                                <div className="back-btn">
                                    <button
                                        type="button"
                                        data-dismiss-class="pos-sidebar-mobile-toggled"
                                        data-target="#pos"
                                        className="btn border-0"
                                    >
                                        <i className="fa fa-chevron-left" />
                                    </button>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-plate-wheat" />
                                </div>
                                <div className="title">Table '01'</div>
                                <div className="order">
                                    Order: <b>#0056</b>
                                </div>
                            </div>
                            <div className="pos-sidebar-nav"> </div>
                            <div className="pos-sidebar-body tab-content"
                                data-scrollbar="true"
                                data-height="100%"
                            >
                                <div className="tab-pane fade h-100 show active" id="newOrderTab">
                                    <div className="pos-table">
                                        {itemCart.length > 0 ? (
                                            itemCart.map((item, index) => {
                                                const sumOption=0;
                                                item.tastingUse.forEach(tasting => {
                                                    if (tasting.tasting_price > 0) {
                                                        sumOption += parseFloat(tasting.tasting_price) * item.qty_order;
                                                    }
                                                });
                                                return (
                                                    <div key={index} className="row pos-table-row">
                                                        <div className="col-9">
                                                            <div className="pos-product-thumb">
                                                                <div
                                                                    className="img" style={{
                                                                        backgroundImage: `url(${imgUrl}pos/${item.ps_image === '' ? 'picture.jpg' : item.ps_image})`
                                                                    }} />
                                                                <div className="info">
                                                                    <div className="title">{item.product_name}</div>
                                                                    <div className="single-price">{numeral(item.price_sale).format('0,00')} ₭</div>
                                                                    <div className="desc">{item.option_name !== '' && ('(' + item.option_name) + ')'}</div>
                                                                    {item.tastingUse.length > 0 && (
                                                                        <div class="desc">
                                                                            {item.tastingUse.map((data, key) => (
                                                                                <div key={key}>
                                                                                    - {data.tasting_name}
                                                                                    {data.tasting_price > 0 && ` : ${numeral(data.tasting_price).format('0,00')}`}
                                                                                    <br />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    <div className="input-group qty">
                                                                        <div className="input-group-append">
                                                                            <button type='button' disabled={item.qty_order > 1 ? '' : 'disabled'} onClick={() => hanldeMinus(item.order_chat_id)} className="btn btn-red">
                                                                                <i className="fa fa-minus" />
                                                                            </button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={item.qty_order}
                                                                            readOnly
                                                                        />
                                                                        <div className="input-group-prepend">
                                                                            <button type='button' onClick={() => hanldePlus(item.order_chat_id)} className="btn btn-green">
                                                                                <i className="fa fa-plus" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-3 total-price">
                                                            <div className='mg-b-0'>
                                                                <button type='button' onClick={() => hanldeDelete(item.order_chat_id)} className="btn btn-red btn-xs ">
                                                                    <i class="fa-solid fa-trash" />
                                                                </button>
                                                            </div>
                                                           {item.discount_price >0 &&  <div className='text-red'>- {numeral(item.discount_price*item.qty_order).format('0,00')} ₭</div> }
                                                            {numeral((item.total_price * item.qty_order)).format('0,00')} ₭
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (<>
                                            <div className='mt-5 text-center'>
                                                <img src="./assets/img/icon/ic_no_result.svg" className='w-200px' alt="" />
                                            </div>
                                        </>)}

                                    </div>
                                </div>
                                <div className="tab-pane fade h-100" id="orderHistoryTab">
                                    <div className="h-100 d-flex align-items-center justify-content-center text-center p-20">
                                        <div>
                                            <div className="mb-3 mt-n5">
                                                <svg
                                                    width="6em"
                                                    height="6em"
                                                    viewBox="0 0 16 16"
                                                    className="text-gray-300"
                                                    fill="currentColor"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M14 5H2v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5zM1 4v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4H1z"
                                                    />
                                                    <path d="M8 1.5A2.5 2.5 0 0 0 5.5 4h-1a3.5 3.5 0 1 1 7 0h-1A2.5 2.5 0 0 0 8 1.5z" />
                                                </svg>
                                            </div>
                                            <h4>No order history found</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pos-sidebar-footer">
                                <div className="d-flex align-items-center mb-2">
                                    <div>ຍອດທັງໝົດ</div>
                                    <div className="flex-1 text-end h6 mb-0">{numeral(totalbalance + totalOption).format('0,00')} ₭</div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div>ສ່ວນຫຼຸດ </div>
                                    <div className="flex-1 text-end h6 mb-0">{numeral(totaldiscount).format('0,00')} ₭</div>
                                </div>
                                <hr className="opacity-1 my-10px" />
                                <div className="d-flex align-items-center mb-2">
                                    <div>ລວມຍອດທັງໝົດ</div>
                                    <div className="flex-1 text-end h4 mb-0">{numeral(subtotal + totalOption).format('0,00')} ₭</div>
                                </div>
                                <div className="d-flex align-items-center mt-3">
                                    <button type='button' className="btn btn-default rounded-3 text-center me-10px w-70px" >
                                        <i className="fa fa-bell d-block fs-18px my-1" /> Service
                                    </button>
                                    <button type='button' className="btn btn-default rounded-3 text-center me-10px w-70px">
                                        <i className="fa fa-receipt d-block fs-18px my-1" /> Bill
                                    </button>
                                    <button type='button' onClick={handlePayment} className="btn btn-bps rounded-3 text-center flex-1"  >
                                        <i className="fa fa-shopping-cart d-block fs-18px my-1" />
                                        ຮັບເງິນ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="#"
                    className="pos-mobile-sidebar-toggler"
                    data-toggle-class="pos-sidebar-mobile-toggled"
                    data-target="#pos" >
                    <i className="iconify display-6"
                        data-icon="solar:bag-smile-bold-duotone" />
                    <span className="badge">5</span>
                </a>
            </div>

            <ModalOrder
                open={open}
                handleClose={() => setOpen(false)}
                item={itemps}
                tableId={tableId}
                fetchCartOrder={fetchCartOrder}
            />

            <ModalPayment
                show={openpay}
                handleClose={() => setOpenPay(false)}
                itemOrder={itemCart}
            />
        </div>
    )
}
