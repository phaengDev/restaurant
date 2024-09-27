import React from 'react'
import { Link } from 'react-router-dom';
export default function SettingSystem() {
    return (

        <div id="content" class="app-content p-0">
            <div class="mailbox">
                <div class="mailbox-sidebar">
                    <div class="mailbox-sidebar-header d-flex justify-content-center">
                        <a href="#emailNav" data-bs-toggle="collapse" class="btn btn-dark btn-sm me-auto d-block d-lg-none">
                            <i class="fa fa-cog"></i>
                        </a>
                       <h5> ລາຍການ</h5>
                    </div>
                    <div class="mailbox-sidebar-content collapse d-lg-block" id="emailNav">
                        <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                            <div class="nav-title"><b>FOLDERS</b></div>
                            <ul class="nav nav-inbox">
                                <li class="active"><Link to={'/system'}><i class="fa fa-hdd fa-lg fa-fw me-2"></i> ຂໍ້ມູນເລີ່ມຕົ້ນ</Link></li>
                                <li><Link to={'/depart'}><i class="fa-solid fa-object-ungroup fa-fw me-2"></i> ພະແນກ</Link></li>
                                <li><Link to={'/shift'}><i class="fa-solid fa-clock fa-fw me-2"></i> ກະການຂາຍ</Link></li>
                                <li><Link to={'/rate'}><img src="assets/img/icon/ic_currency.svg" className='w-20px fa-fw me-2' alt="" />ຕັ້ງຄ່າເລດເງິນ</Link></li>
                                <li><Link to={'/rights'}><i class="fa-solid fa-screwdriver-wrench fa-fw me-2"></i> ສິດນຳໃຊ້ລະບົບ</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="mailbox-content">
                    <div class="mailbox-content-header">
                        <div class="btn-toolbar">
                           <h5>asdladfj</h5>
                        </div>
                    </div>
                    <div class="mailbox-content-body">
                        <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}
