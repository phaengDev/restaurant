import React,{useState,useEffect} from 'react'
import { Button,Input,SelectPicker,InputPicker,InputGroup } from 'rsuite';
import numeral from 'numeral';
import axios from 'axios';
import { Config,Urlimage } from '../../config/connection';
import { useUnite, useCategory } from '../../config/select-option';
import { Notification, Alert } from '../../utils/Notification';
const FormAddProduct=({openForm,hileForm,data,fetchData})=> {
const api=Config.urlApi;
const url = Urlimage.url;
const shopId = localStorage.getItem('shop_id_fk');

    const [inputs, setInputs] = useState({
        // productId: '',
        // shop_id_fk: shopId,
        // imgPos: '',
        // product_name: '',
        // barcode: '',
        // brands_id_fk: '',
        // units_id_fk: '',
        // price_buy: '0',
        // price_sale: '0',
        // discount_sale: '0',
        // status_stock: 1,
        // qty_alert: '5',
        // statusUse: '1',
        // categories_id_fk: '',
        productId:data? data.product_id:'',
    shop_id_fk: shopId,
    imgPos: '',
    product_name:data !=='' ? data.product_name:'',
    barcode:data!==''? data.barcode:'',
    brands_id_fk:data!==''? data.brands_id_fk:'',
    units_id_fk:data!==''? data.units_id_fk:'',
    price_buy:data!==''? data.price_buy:'',
    price_sale:data!==''? data.price_sale:'',
    discount_sale:data!==''? data.discount_sale:'',
    status_stock:data!==''? data.status_stock:'',
    qty_alert:data!==''? data.qty_alert:'',
    statusUse:data!==''? data.statusUse:'',
    categories_id_fk:data!==''? data.categories_id_fk:''
    })
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }

    // const [dataNew, setDataNew] = useState(false);
    // ===============
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('/assets/img/icon/picture.jpg');
    const itemUnit = useUnite();
    const itemCate = useCategory();

    const stock = [{
        label: 'ຕັດສະຕ໋ອກ', value: 1
    }, {
        label: 'ບໍ່ສຳກັດ', value: 2
    }]

    const handleQrChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setInputs({
                ...inputs, imgPos: file
            })
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleClearImage = () => {
        setSelectedFile(null);
        setImageUrl('/assets/img/icon/picture.jpg')
        document.getElementById('fileInput').value = '';
        setInputs({
            ...inputs, imgPos: ''
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const inputData = new FormData();
        for (const key in inputs) {
            inputData.append(key, inputs[key]);
        }
        try {
            const res = await axios.post(api + 'porduct/create', inputData);
            if (res.status === 200) {
                if (res.status === 200) {
                    fetchData()
                    hileForm();
                    setInputs({
                        productId: '',
                        shop_id_fk: shopId,
                        imgPos: '',
                        product_name: '',
                        barcode: '',
                        brands_id_fk: '',
                        units_id_fk: '',
                        price_buy: '0',
                        price_sale: '0',
                        stt_discout: '0',
                        discount_sale: '0',
                        status_stock: 1,
                        qty_alert: '5',
                        statusUse: '1',
                        categories_id_fk: '',
                    })
                    Notification.success('ການບັນທຶກຂໍ້ມູນສຳເລັດ', 'ແຈ້ງເຕືອນ');
                } else {
                    Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
                }
            }
        } catch (error) {
            Notification.error('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    }



//===============
const [isDiscountShown, setIsDiscountShown] = useState(false);
const [isBarcodeShown, setIsBarcodeShown] = useState(false);
const [isNotificShown, setIsNotificShown] = useState(true);

// Handle toggle for Discount panel
const handleOpenDiscount = () => {
    setIsDiscountShown(!isDiscountShown);
};

// Handle toggle for Barcode panel
const handleOpenBarcode = () => {
    setIsBarcodeShown(!isBarcodeShown);
};
// Handle toggle for product panel
const handleOpenNotific = () => {
    setIsNotificShown(!isNotificShown);
};



      //===========================
      const [itemBrand, setItemBrand] = useState([]);
      const handleShowCart = async (name,value) => {
          try {
              const response = await fetch(api + 'brand/cate/' + value);
              const jsonData = await response.json();
              setItemBrand(jsonData);
          } catch (error) {
              console.error('Error fetching data:', error);
          }

          setInputs({
            ...inputs, [name]: value
        })
      }
      const dataBrand = itemBrand.map(item => ({ label: item.brand_name, value: item.brand_id }));
  
// if (data !=='' || null) {
//     setInputs({
//       productId: data.product_id,
//       shop_id_fk: shopId,
//       imgPos: '',
//       product_name: data.product_name,
//       barcode: data.barcode,
//       brands_id_fk: data.brands_id_fk,
//       units_id_fk: data.units_id_fk,
//       price_buy: data.price_buy,
//       price_sale: data.price_sale,
//       stt_discout: data.stt_discout,
//       discount_sale: data.discount_sale,
//       status_stock: data.status_stock,
//       qty_alert: data.qty_alert,
//       statusUse: data.statusUse,
//       categories_id_fk: data.categories_id_fk
//     });
//     handleShowCart(data.categories_id_fk);

//     if (data.imgPos) {
//       setImageUrl(url + 'pos/' + data.imgPos);
//     }
//   }

useEffect(() => {
    if (data && data !== '') {
    
      handleShowCart('categories_id_fk',data.categories_id_fk);
  
      if (data.imgPos) {
        setImageUrl(url + 'pos/' + data.imgPos);
      }
    }
  }, [data]);
  return (
    <div className="col-sm-4 col-lg-5 px-2" >
    <div className=" navbar navbar-sticky  h-100">
        <form onSubmit={handleSubmit} className='nav'>
            <div className="panel bg-default ">
                <div className='sticky-top-form' >
                    <div className="breadcrumb float-end">
                        <Button type='submit' color="blue" appearance="primary" startIcon={<i className='fas fa-save' />} > ບັນທຶກ</Button>
                    </div>
                    <div className="page-header">
                        <Button type='button' color="red" onClick={hileForm} appearance="ghost"><i class="fa-solid fa-xmark fs-4" /></Button>
                    </div>
                </div>
                <div class="panel-form pt-0">
                    <div class="panel ">
                        <div class="panel-heading bg-bps  ui-sortable-handle">
                            <h4 class="panel-title text-white fs-14px"><i class="fa-solid fa-id-card-clip"></i> ສ້າງບັນຊີຜູ້ໃຊ້ </h4>
                        </div>
                        <div class="panel-body  row">
                            <div className="form-group mb-2">
                                <label htmlFor="" className='form-label'>ຊື່ສິ້ນຄ້າ {inputs.product_name}</label>
                                <Input value={data.product_name} onChange={(e) => handleChange('product_name', e)} placeholder="ຊື່ສິ້ນຄ້າ" required />
                            </div>
                            <div className="form-group col-lg-6 mb-2">
                                <label htmlFor="" className='form-label'>ລາຄາຊື້</label>
                                <Input value={numeral(inputs.price_buy).format('0,00')} onChange={(e) => handleChange('price_buy', e)} block />
                            </div>
                            <div className="form-group col-lg-6 mb-2">
                                <label htmlFor="" className='form-label'>ລາຄາຂາຍ</label>
                                <Input value={numeral(inputs.price_sale).format('0,00')} onChange={(e) => handleChange('price_sale', e)} block />
                            </div>
                            <hr />
                            <div className="form-group col-sm-12 col-lg-6 mb-2">
                                <label htmlFor="" className='form-label'>ໝວດໝູ່</label>
                                <SelectPicker data={itemCate} value={inputs.categories_id_fk} onChange={(e) => handleShowCart('categories_id_fk',e)} block placement="autoVerticalStart" placeholder='ເລືອກ' required />
                            </div>
                            <div className="form-group col-sm-12 col-lg-6 mb-2">
                                <label htmlFor="" className='form-label'>ປະເພດ/ຍີ່ຫໍ້</label>
                                <SelectPicker data={dataBrand} value={inputs.brands_id_fk} onChange={(e) => handleChange('brands_id_fk', e)} block placement="autoVerticalStart" placeholder='ເລືອກ' required />
                            </div>
                            <hr />
                            <div className="form-group col-sm-8 mb-2">
                                <label htmlFor="" className='form-label'>ຫົວໜ່ວຍ</label>
                                <SelectPicker data={itemUnit} value={inputs.units_id_fk} onChange={(e) => handleChange('units_id_fk', e)} block placement="autoVerticalStart" placeholder='ເລືອກ' />
                            </div>
                            <div className="form-group col-sm-4 mb-2">
                                <label htmlFor="" className='form-label'>ສະຕ໋ອກ</label>
                                <InputPicker data={stock} value={inputs.status_stock} onChange={(e) => handleChange('status_stock', e)} block placeholder='ເລືອກ' />
                            </div>
                        </div>
                    </div>
                    <div class="panel rounded-top-3">
                        <div class="panel-heading bg-defauld ">
                            <h4 class="panel-title fs-16px"> <i class="fa-solid fa-image"></i> ຮູບສິນຄ້າ</h4>
                        </div>
                        <div class="panel-body row">
                            <div class="text-center position-relative">
                                <label role='button'>
                                    <input type="file" id="fileInput" onChange={handleQrChange} accept="image/*" className='hide' />
                                    <img src={imageUrl} class="w-150px rounded-3" />
                                </label>
                                {selectedFile && (
                                    <span role='button' onClick={handleClearImage} class=" d-flex align-items-center justify-content-center badge bg-danger text-white position-absolute end-40 top-0 rounded-pill mt-n2 me-n5"><i class="fa-solid fa-xmark"></i></span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div class="panel rounded-3 border border-2">
                        <div class="panel-heading bg-default ">
                            <h4 class="panel-title fs-16px"><i class="fa-solid fa-barcode"></i>  ບາໂຄດ (ກຳຫນົດເອງ)</h4>
                            <div class="panel-heading-btn">
                                <div class="form-check form-switch mb-2">
                                    <input class="form-check-input" type="checkbox" checked={isBarcodeShown} onChange={handleOpenBarcode} />
                                </div>
                            </div>
                        </div>
                        <div class={`accordion-collapse collapse ${isBarcodeShown ? 'show' : ''}`} data-bs-parent="#accordion1">
                            <div class="panel-body">
                                <div className="form-group text-dark">
                                    <label htmlFor="" className='form-label text-dark'>ລະຫັດບາໂຄດທີ່ຕ້ອງການກຳໜົດເອງ</label>
                                    <InputGroup inside >
                                        <InputGroup.Addon><i className='fa-solid fa-barcode' /> </InputGroup.Addon>
                                        <Input block value={inputs.barcode} onChange={(e) => handleChange('barcode', e)} placeholder='|||||||||||||||||||||||||' />
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel rounded-3 border border-2" >
                        <div class="panel-heading bg-default ">
                            <h4 class="panel-title text fs-16px"><i class="fa-solid fa-tag"></i> ສ່ວນຫຼຸດ</h4>
                            <div class="panel-heading-btn">
                                <div class="form-check form-switch mb-2">
                                    <input class="form-check-input" type="checkbox" checked={isDiscountShown} onChange={handleOpenDiscount} />
                                </div>
                            </div>
                        </div>
                        <div class={`accordion-collapse collapse ${isDiscountShown ? 'show' : ''}`} data-bs-parent="#accordion2">
                            <div class="panel-body" >
                                <div class="form-group">
                                    <Input block value={inputs.discount_sale} onChange={(e) => handleChange('discount_sale', e)}  placeholder='0' />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="panel border border-2" >
                        <div class="panel-heading bg-default">
                            <h4 class="panel-title fs-16px"><i class="fa-solid fa-bell"></i> ແຈ້ງເຕືອນສິນຄ້າໃກ້ໝົດ</h4>
                            <div class="panel-heading-btn">
                                <div class="form-check form-switch mb-2">
                                    <input class="form-check-input" type="checkbox" checked={isNotificShown} onChange={handleOpenNotific} />
                                </div>
                            </div>
                        </div>
                        <div class={`accordion-collapse collapse ${isNotificShown ? 'show' : ''}`} data-bs-parent="#accordion5">
                            <div class="panel-body row">
                                <div className="form-group col-6">
                                    <label htmlFor="" className='form-label'>ແຈ້ງເຕືອນ <i class="fa-solid fa-angle-left" /> ນ້ອຍກວ່າ </label>
                                    <Input type='number' defaultValue={inputs.qty_alert} onChange={(e) => handleChange('qty_alert', e)} block />
                                </div>
                                <div className="form-group col-6">
                                    <label htmlFor="" className='form-label'>ສະຖານະໃຊ້ງານ  </label>
                                    <select value={inputs.statusUse} onChange={(e) => handleChange('statusUse', e)} className='form-select' >
                                        <option value="1" selected>ພ້ອມໃຊ້ງານ</option>
                                        <option value="2">ບໍ່ພ້ອມໃຊ້ງານ</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
  )
}

export default FormAddProduct