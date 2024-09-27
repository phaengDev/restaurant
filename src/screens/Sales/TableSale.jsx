import React, { useEffect, useState } from 'react'
import { Input, InputGroup, Loader, Placeholder } from 'rsuite';
import axios from 'axios';
import numeral from 'numeral';
import { Config } from '../../config/connection'
export default function TableSale() {
  const api = Config.urlApi;
  const branchId = localStorage.getItem('branch_Id');
  const [isLoading, setIsLoading] = useState(true)
  const [itemData, setItemData] = useState([]);
  const [filter,setFilter]=useState([]);
  const fetchBranch = async () => {
    try {
      const response = await fetch(api + 'table/option/' + branchId);
      const jsonData = await response.json();
      setItemData(jsonData);
      setFilter(jsonData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setIsLoading(false)
    }
  }

const handleFilter=(value)=>{
  setItemData(filter.filter(n => n.tables_name.toLowerCase().includes(value)))
}

  const handleDoubleClick = (event) => {
    window.location.href = '/open?id=' + btoa(event);
  };

  const handleClick = (id) => {
    // alert('asfasfds'+id)
  }
  useEffect(() => {
    fetchBranch()
  }, [branchId])
  return (
    <div id="app" className="app app-content-full-height app-without-header app-without-sidebar" >
      <div id="content" className="app-content p-0">
        <div className="pos pos-with-header pos-with-sidebar" id="pos">
          <div className="pos-header bg-bps ">
            <div className="logo">
              <a href="home">
                <div className="logo-img">
                  <img src="./assets/img/logo/bp-shop.png" className='rounded-pill' alt="" />
                </div>
                <div className="logo-text text-white">BPS &amp; ຮ້ານອາຫາ </div>
              </a>
            </div>
            <div className="time" id="time">
              <InputGroup inside >
                <InputGroup.Addon>
                  <i className='fas fa-search' />
                </InputGroup.Addon>
                <Input onChange={(e)=>handleFilter(e)} placeholder='ເບີໂຕະ' />
              </InputGroup>
            </div>
            <div className="nav">
              <div className="nav-item">
                <a href="pos_kitchen_order.html" className="nav-link">
                  <i className="far fa-clock nav-icon" />
                </a>
              </div>
              <div className="nav-item">
                <a href="pos_table_booking.html" className="nav-link">
                  <i className="far fa-calendar-check nav-icon" />
                </a>
              </div>
              <div className="nav-item">
                <a href="pos_menu_stock.html" className="nav-link">
                  <i className="fa fa-chart-pie nav-icon" />
                </a>
              </div>
            </div>
          </div>
          <div className="pos-content">
            <div className="pos-content-container">
              <div className="d-md-flex align-items-center mb-2">
                <div className="pos-booking-title flex-1">
                  <div className="fs-24px mb-1">ຈຳນວນໂຕະທັງໝົດ (13/20)</div>
                  <div className="mb-2 mb-md-0 d-flex">
                    <div className="d-flex align-items-center me-3">
                      <i className="fa fa-circle fa-fw text-gray-500 fs-9px me-1" />
                      ໂຕະຫວ່າງ
                    </div>
                    <div className="d-flex align-items-center me-3">
                      <i className="fa fa-circle fa-fw text-warning fs-9px me-1" />
                      ໂຕະເປີດ
                    </div>
                    <div className="d-flex align-items-center me-3">
                      <i className="fa fa-circle fa-fw text-theme fs-9px me-1" />
                      Table Available
                    </div>
                  </div>
                </div>
              </div>
              <div className="pos-table-row">

                {isLoading === true ? (
                  <>
                    <Placeholder.Paragraph rows={8} />
                    <Loader center size='lg' content="ກຳລັງໂຫລດ..." vertical />
                  </>
                ) : (
                  itemData.length > 0 ? (
                    <>
                      {itemData.map((item, index) =>
                        <div className="pos-table in-use ">
                          <a href="javascript:;" onClick={() => handleClick(item.tables_id)} onDoubleClick={() => handleDoubleClick(item.tables_id)}
                            className="pos-table-container border"
                            data-toggle="select-table" >
                            <div className="pos-table-status" />
                            <div className={`pos-table-name text-white ${item.useSale === 1 ? 'bg-bps' : 'bg-green'}`}>
                              <div className="name">ເບີໂຕະ</div>
                              <div className="no">{item.tables_name}</div>
                              <div className="order">
                                <span>{item.qtu_order} ລາຍການ</span>
                              </div>
                            </div>
                            <div class="pos-table-info-row">
                              <div class="pos-table-info-col">
                                <div class="pos-table-info-container">
                                  <span className="icon opacity-50 d-sm-block d-none">
                                    <i class="fa-solid fa-cart-plus" />
                                  </span>
                                  <span class="text">ຍອດອໍເດີ</span>
                                  <span class="icon text-red"><i class="fa-solid fa-turn-down" /></span>
                                </div>
                              </div>
                              <div class="pos-table-info-col">
                                <div class="pos-table-info-container">
                                  <span className="icon opacity-50 d-sm-block d-none">
                                    <i className="fa fa-receipt" />
                                  </span>
                                  <span class="text">ເຊັກບິນ</span>
                                  <span class="icon text-green"><i class="fa-solid fa-turn-down" /></span>
                                </div>
                              </div>
                            </div>
                            <div className="pos-table-info-row">
                              <div className="pos-table-info-col">
                                <div className="pos-table-info-container">
                                  <span className="text text-end">{numeral(item.balance_order).format('0,00')}</span>
                                </div>
                              </div>
                              <div className="pos-table-info-col">
                                <div className="pos-table-info-container">
                                  <span className="text text-end">0</span>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <></>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="pos-sidebar">
            <div className="pos-sidebar-header">
              <div className="back-btn">
                <button
                  type="button"
                  data-dismiss-class="pos-sidebar-mobile-toggled"
                  data-target="#pos"
                  className="btn"
                >
                  <i className="fa fa-chevron-left" />
                </button>
              </div>
              <div className="icon">
                <i className="fa fa-plate-wheat" />
              </div>
              <div className="title">Table 01</div>
              <div className="order">
                Order: <b>#0001</b>
              </div>
            </div>
            <div className="pos-sidebar-body">
              <div className="pos-table" data-id="pos-table-info">
                <div className="row pos-table-row">
                  <div className="col-8">
                    <div className="pos-product-thumb">
                      <div
                        className="img"
                        style={{
                          backgroundImage: "url(../assets/img/pos/product-2.jpg)"
                        }}
                      />
                      <div className="info">
                        <div className="title">Grill Pork Chop</div>
                        <div className="desc">- size: large</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 total-qty">x1</div>
                  <div className="col-3 total-price">$12.99</div>
                </div>
                <div className="row pos-table-row">
                  <div className="col-8">
                    <div className="pos-product-thumb">
                      <div
                        className="img"
                        style={{
                          backgroundImage: "url(../assets/img/pos/product-8.jpg)"
                        }}
                      />
                      <div className="info">
                        <div className="title">Orange Juice</div>
                        <div className="desc">
                          - size: large
                          <br />- less ice
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 total-qty">x2</div>
                  <div className="col-3 total-price">$10.00</div>
                </div>
                <div className="row pos-table-row">
                  <div className="col-8">
                    <div className="pos-product-thumb">
                      <div
                        className="img"
                        style={{
                          backgroundImage: "url(../assets/img/pos/product-13.jpg)"
                        }}
                      />
                      <div className="info">
                        <div className="title">Vanilla Ice-cream</div>
                        <div className="desc">
                          - scoop: 1 <br />- flavour: vanilla
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 total-qty">x1</div>
                  <div className="col-3 total-price">$3.99</div>
                </div>
                <div className="row pos-table-row">
                  <div className="col-8">
                    <div className="pos-product-thumb">
                      <div
                        className="img"
                        style={{
                          backgroundImage: "url(../assets/img/pos/product-1.jpg)"
                        }}
                      />
                      <div className="info">
                        <div className="title">Grill chicken chop</div>
                        <div className="desc">
                          - size: large
                          <br />- spicy: medium
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 total-qty">x1</div>
                  <div className="col-3 total-price">$10.99</div>
                </div>
                <div className="row pos-table-row">
                  <div className="col-8">
                    <div className="pos-product-thumb">
                      <div
                        className="img"
                        style={{
                          backgroundImage: "url(../assets/img/pos/product-10.jpg)"
                        }}
                      />
                      <div className="info">
                        <div className="title">Mushroom Soup</div>
                        <div className="desc">
                          - size: large
                          <br />- more cheese
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 total-qty">x1</div>
                  <div className="col-3 total-price">$3.99</div>
                </div>
                <div className="row pos-table-row">
                  <div className="col-8">
                    <div className="pos-product-thumb">
                      <div
                        className="img"
                        style={{
                          backgroundImage: "url(../assets/img/pos/product-5.jpg)"
                        }}
                      />
                      <div className="info">
                        <div className="title">Hawaiian Pizza</div>
                        <div className="desc">
                          - size: large
                          <br />- more onion
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 total-qty">x1</div>
                  <div className="col-3 total-price">$15.00</div>
                </div>
                <div className="row pos-table-row">
                  <div className="col-8">
                    <div className="pos-product-thumb">
                      <div
                        className="img"
                        style={{
                          backgroundImage: "url(../assets/img/pos/product-15.jpg)"
                        }}
                      />
                      <div className="info">
                        <div className="title">Perfect Yeast Doughnuts</div>
                        <div className="desc">
                          - size: 1 set
                          <br />- flavour: random
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 total-qty">x1</div>
                  <div className="col-3 total-price">$2.99</div>
                </div>
                <div className="row pos-table-row">
                  <div className="col-8">
                    <div className="pos-product-thumb">
                      <div
                        className="img"
                        style={{
                          backgroundImage: "url(../assets/img/pos/product-14.jpg)"
                        }}
                      />
                      <div className="info">
                        <div className="title">Macarons</div>
                        <div className="desc">
                          - size: 1 set
                          <br />- flavour: random
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 total-qty">x1</div>
                  <div className="col-3 total-price">$4.99</div>
                </div>
              </div>
              <div
                className="h-100 d-none align-items-center justify-content-center text-center p-20"
                data-id="pos-table-empty"
              >
                <div>
                  <div className="mb-3">
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
                  <h4>No table selected</h4>
                </div>
              </div>
            </div>
            <div className="pos-sidebar-footer">
              <div className="d-flex align-items-center mb-2">
                <div>Subtotal</div>
                <div className="flex-1 text-end h6 mb-0">$64.94</div>
              </div>
              <div className="d-flex align-items-center">
                <div>Taxes (6%)</div>
                <div className="flex-1 text-end h6 mb-0">$3.90</div>
              </div>
              <hr className="opacity-1 my-10px" />
              <div className="d-flex align-items-center mb-2">
                <div>Total</div>
                <div className="flex-1 text-end h4 mb-0">$68.84</div>
              </div>
              <div className="d-flex align-items-center mt-3">
                <a
                  href="#"
                  className="btn btn-default w-80px rounded-3 text-center me-10px"
                >
                  <i className="fab fa-paypal d-block fs-18px my-1" />
                  E-Wallet
                </a>
                <a
                  href="#"
                  className="btn btn-default w-80px rounded-3 text-center me-10px"
                >
                  <i className="fab fa-cc-visa d-block fs-18px my-1" />
                  CC
                </a>
                <a href="#" className="btn btn-theme rounded-3 text-center flex-1">
                  <i className="fa fa-wallet d-block fs-18px my-1" />
                  Pay by Cash
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
