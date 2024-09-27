import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { Input, RadioTile, RadioTileGroup, InputGroup } from 'rsuite';
import { useCurrency } from '../../config/select-option';
import numeral from 'numeral';
import { Urlimage } from '../../config/connection';
const ModalPayment = ({ itemOrder, show, handleClose, fetchCartOrder }) => {
    const imgUrl = Urlimage.url;
    const [startBalance, setStartlBalance] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [totalOption, setTotalOption] = useState(0);


    let tempTotalBalance = 0;
    let tempTotalDiscount = 0;
    let tempSubtotal = 0;
    let tempTotalOption = 0;
    if (Array.isArray(itemOrder)) {
        itemOrder.forEach(item => {
            tempTotalBalance += parseInt(item.price_sale * item.qty_order);
            tempTotalDiscount += parseInt(item.qty_order * item.discount_price);
            tempSubtotal += parseInt(item.total_price * item.qty_order);
            if (Array.isArray(item.tastingUse)) {
                item.tastingUse.forEach(tasting => {
                    if (tasting.tasting_price > 0) {
                        tempTotalOption += parseFloat(tasting.tasting_price) * item.qty_order;
                    }
                });
            }
        });
    }


    const [inputs, setInputs] = useState({
        cash_balance: 0,
        transfer_balance: 0,
        discount_balance: 0,
        return_balance: 0
    })
    const [readonlys, setReadonlys] = useState(false)
    const [cashBalance, setCashBalance] = useState(0)
    const [transferBalance, setTransferBalance] = useState(0)
    const [discountBalance, setDiscountBalance] = useState(0)
    const [retrunBalance, setRetrunBalance] = useState(0)

    useEffect(() => {
        setStartlBalance(tempSubtotal + tempTotalOption)
        setTotalBalance(tempTotalBalance);
        setTotalDiscount(tempTotalDiscount);
        setSubtotal(tempSubtotal + tempTotalOption);
        setTotalOption(tempTotalOption);
    }, [itemOrder])

    const { item: currency } = useCurrency();
    const [activeRate, setActiveRate] = useState(22001);
    const [genus, setGenus] = useState('₭');
    const [ratePrice, setRatePrice] = useState(1)
    const handleRateChange = (newValue) => {
        setActiveRate(newValue);
        const useRate = currency.find(item => item.currency_id === newValue);
        if (useRate) {
            setGenus(useRate.genus_lg);
            setRatePrice(useRate.reate_price);
            setSubtotal((tempSubtotal + tempTotalOption) / useRate.reate_price);
        }

        setCashBalance(0)
        setTransferBalance(0)
        setDiscountBalance(0)
        setRetrunBalance(0)
    }

    const handleGetmoneyCash = (value) => {
        const newCash = parseFloat(value.replace(/,/g, ''));
        setCashBalance(newCash);
        setInputs({
            ...inputs, cash_balance: newCash
        });
        if (newCash >= subtotal) {
            setTransferBalance(0);
            setRetrunBalance(((newCash + transferBalance + discountBalance) - subtotal) * ratePrice);
            setReadonlys(true)
        } else {
            setRetrunBalance(0);
            setReadonlys(false)
        }

    }

    const handleGetmoneyTransfer = (value) => {
        const newTransfer = parseFloat(value.replace(/,/g, ''));
        setTransferBalance(newTransfer);
        setInputs({
            ...inputs, transfer_balance: newTransfer
        });
        if ((cashBalance + newTransfer) > subtotal) {
            setRetrunBalance(((cashBalance + newTransfer + discountBalance) - subtotal) * ratePrice);
        } else {
            setRetrunBalance(0);
        }


    }

    const handleGetmoneyDiscount = (value) => {
        const newDiscount = parseFloat(value.replace(/,/g, ''));
        setDiscountBalance(newDiscount);
        setInputs({
            ...inputs, discount_balance: newDiscount
        });

        if ((cashBalance + transferBalance + newDiscount) > subtotal) {
            setRetrunBalance(((cashBalance + transferBalance) + (newDiscount) - subtotal));
        } else {
            setRetrunBalance(((cashBalance + transferBalance) - subtotal));
        }
    }
    return (
        <Modal show={show} onHide={handleClose} size='xl' className='modal-pos'>
            <Modal.Body className='modal-body p-0'>
                <a href="javascript:;" onClick={handleClose} class="btn-close position-absolute top-0 end-0 m-4"></a>
                <div class="modal-pos-product ">
                    <div class="modal-pos-product-img p-0">
                        <div className="table-responsive">
                            <table class="table table-striped table-bordered align-middle text-nowrap">
                                <thead className='thead-bps'>
                                    <tr>
                                        <th className='text-center'>ລ/ດ</th>
                                        <th colSpan={2}>ລາຍການສິນຄ້າ</th>
                                        <th className='text-end'>ລາຄາຂາຍ</th>
                                        <th className='text-end'>ສ່ວນຫຼຸດ</th>
                                        <th className='text-center'>ຈຳນວນ</th>
                                        <th className='text-end'>ລວມເງິນ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemOrder.map((item, index) =>
                                        <tr key={index}>
                                            <td className='text-center'>{index + 1}</td>
                                            <td className='text-center with-img' width={'5%'}>
                                                <img src={`${imgUrl}pos/${item.ps_image === '' ? 'picture.jpg' : item.ps_image}`} className='rounded h-30px my-n1 mx-n1' alt="" />
                                            </td>
                                            <td>
                                                {item.product_name} {item.option_name !== '' && '(' + item.option_name + ')'}
                                                {item.tastingUse.map((data, key) => (
                                                    <div key={key}>
                                                        - {data.tasting_name}
                                                        {data.tasting_price > 0 && ` : +${numeral(data.tasting_price).format('0,00')}`}
                                                        <br />
                                                    </div>
                                                ))}
                                            </td>
                                            <td className='text-end'>{numeral(item.price_sale).format('0,00')} ₭</td>
                                            <td className='text-end'>{numeral(item.discount_price).format('0,00')} ₭</td>
                                            <td className='text-center'>{item.qty_order} {item.unit_name}</td>
                                            <td className='text-end'>{numeral(item.total_price * item.qty_order).format('0,00')} ₭</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-pos-product-info">
                        <div class="fs-4 fw-bold">
                            <span className='fs-22px p-1 px-5 bg-blue text-white rounded'>{numeral(startBalance).format('0,00')} ₭ </span>
                            {ratePrice > 1 && (<>
                                <i class="fa-solid fa-arrow-right-long fs-3 ms-2 me-2" />
                                <span className='fs-22px text-white p-1 px-5 bg-bps rounded'>{numeral(subtotal).format('0,00.00')} {genus}</span>
                            </>)}</div>
                        <hr className='mb-2' />
                        <RadioTileGroup defaultValue={activeRate} inline='lg' onChange={handleRateChange} aria-label="1" className='py-1 '>
                            {currency.map((rate, key) =>
                                <RadioTile icon={<img src={`./assets/img/flag/${rate.genus_icon}`} className='w-30px' />} label={rate.currency_name + '(' + rate.genus_lg + ')'} value={rate.currency_id} className='my-1 py-1 '>
                                    {numeral(rate.reate_price).format('0,00')}
                                </RadioTile>
                            )}
                        </RadioTileGroup>
                        <hr className='mt-1' />
                        <div className="row">
                            <div className="col-sm-6">
                                <label htmlFor="" className='form-label'>ຮັບເງິນສົດ</label>
                                <InputGroup inside className='bg-lime-200'>
                                    <Input size='lg' onChange={(e) => handleGetmoneyCash(e)} value={numeral(cashBalance).format('0,00')} className='bg-lime-200' />
                                    <InputGroup.Addon>{genus}</InputGroup.Addon>
                                </InputGroup>
                            </div>
                            <div className="col-sm-6">
                                <label htmlFor="" className='form-label'>ຮັບເງິນໂອນ</label>
                                <InputGroup inside className='bg-lime-200'>
                                    <Input size='lg' onChange={(e) => handleGetmoneyTransfer(e)} value={numeral(transferBalance).format('0,00')} className='bg-lime-200' readOnly={readonlys} />
                                    <InputGroup.Addon>{genus}</InputGroup.Addon>
                                </InputGroup>
                            </div>
                            <div className="col-sm-6 mt-2">
                                <label htmlFor="" className='form-label'>ສ່ວນຫຼຸດ</label>
                                <InputGroup inside className='bg-orange-200'>
                                    <Input size='lg' onChange={(e) => handleGetmoneyDiscount(e)} value={numeral(discountBalance).format('0,00')} className='bg-orange-200' />
                                    <InputGroup.Addon>₭</InputGroup.Addon>
                                </InputGroup>
                            </div>
                            <div className="col-sm-6 mt-2">
                                <label htmlFor="" className='form-label'>ເງິນທອນ</label>
                                <InputGroup inside className='bg-black-200 ' >
                                    <Input size='lg' value={numeral(retrunBalance).format('0,00')} className='bg-black-200 text-white' readOnly />
                                    <InputGroup.Addon className='text-white'>₭</InputGroup.Addon>
                                </InputGroup>
                            </div>
                        </div>
                        <hr />
                        <div class="row gx-3">
                            <div class="col-4">
                                <button type='button' class="btn btn-danger fs-14px rounded-3 fw-bold mb-0 d-block py-3 w-100" onClick={handleClose}>ຍົກເລີກ</button>
                            </div>
                            <div class="col-8">
                                <button type='button' class="btn btn-theme fs-14px rounded-3 fw-bold d-flex justify-content-center align-items-center py-3 m-0 w-100">ບັນທຶກການຈ່າຍ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalPayment