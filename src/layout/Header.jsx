import React from 'react'
import { useNavigate } from 'react-router-dom';
export default function Header() {
  const navigate=useNavigate()
  const userName=localStorage.getItem('username')
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user_uuid');
    localStorage.removeItem('user_Id');
    localStorage.removeItem('branch_Id');
    navigate('/login');
  }
  return (

    <div id="header" class="app-header">

      <div class="navbar-header">
        <a href="home" class="navbar-brand rounded-pill text-white"><img src="./assets/img/logo/bp-shop.png" className='rounded-pill' alt="" /> <b class="ms-2 me-1 text-white">PB</b> Shop</a>
        <button type="button" class="navbar-mobile-toggler" data-toggle="app-sidebar-mobile">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>


      <div class="navbar-nav">
        <div class="navbar-item navbar-form">
          <form action="#" method="POST" name="search">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Enter keyword" />
              <button type="submit" class="btn btn-search"><i class="fa fa-search"></i></button>
            </div>
          </form>
        </div>
        <div class="navbar-item dropdown">
          <a href="#" data-bs-toggle="dropdown" class="navbar-link dropdown-toggle icon">
            <i class="fa fa-bell"></i>
            <span class="badge">5</span>
          </a>
          <div class="dropdown-menu media-list dropdown-menu-end">
            <div class="dropdown-header">NOTIFICATIONS (5)</div>
            <a href="javascript:;" class="dropdown-item media">
              <div class="media-left">
                <i class="fa fa-bug media-object bg-gray-500"></i>
              </div>
              <div class="media-body">
                <h6 class="media-heading">Server Error Reports <i class="fa fa-exclamation-circle text-danger"></i></h6>
                <div class="text-muted fs-10px">3 minutes ago</div>
              </div>
            </a>
            <a href="javascript:;" class="dropdown-item media">
              <div class="media-left">
                <img src="../assets/img/user/user-1.jpg" class="media-object" alt="" />
                <i class="fab fa-facebook-messenger text-blue media-object-icon"></i>
              </div>
              <div class="media-body">
                <h6 class="media-heading">John Smith</h6>
                <p>Quisque pulvinar tellus sit amet sem scelerisque tincidunt.</p>
                <div class="text-muted fs-10px">25 minutes ago</div>
              </div>
            </a>
            <a href="javascript:;" class="dropdown-item media">
              <div class="media-left">
                <img src="../assets/img/user/user-2.jpg" class="media-object" alt="" />
                <i class="fab fa-facebook-messenger text-blue media-object-icon"></i>
              </div>
              <div class="media-body">
                <h6 class="media-heading">Olivia</h6>
                <p>Quisque pulvinar tellus sit amet sem scelerisque tincidunt.</p>
                <div class="text-muted fs-10px">35 minutes ago</div>
              </div>
            </a>
            <a href="javascript:;" class="dropdown-item media">
              <div class="media-left">
                <i class="fa fa-plus media-object bg-gray-500"></i>
              </div>
              <div class="media-body">
                <h6 class="media-heading"> New User Registered</h6>
                <div class="text-muted fs-10px">1 hour ago</div>
              </div>
            </a>
            <a href="javascript:;" class="dropdown-item media">
              <div class="media-left">
                <i class="fa fa-envelope media-object bg-gray-500"></i>
                <i class="fab fa-google text-warning media-object-icon fs-14px"></i>
              </div>
              <div class="media-body">
                <h6 class="media-heading"> New Email From John</h6>
                <div class="text-muted fs-10px">2 hour ago</div>
              </div>
            </a>
            <div class="dropdown-footer text-center">
              <a href="javascript:;" class="text-decoration-none">View more</a>
            </div>
          </div>
        </div>
        <div class="navbar-item navbar-user dropdown">
          <a href="#" class="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
            <img src="../assets/img/user/user-13.jpg" alt="" />
            <span>
              <span class="d-none d-md-inline">{userName}</span>
              <b class="caret"></b>
            </span>
          </a>
          <div class="dropdown-menu dropdown-menu-end me-1">
            <a href="extra_profile.html" class="dropdown-item">Edit Profile</a>
            <a href="email_inbox.html" class="dropdown-item d-flex align-items-center">
              Inbox
              <span class="badge bg-danger rounded-pill ms-auto pb-4px">2</span>
            </a>
            <a href="calendar.html" class="dropdown-item">Calendar</a>
            <a href="settings.html" class="dropdown-item">Settings</a>
            <div class="dropdown-divider"></div>
            <button onClick={handleLogout} class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Log Out</button>
          </div>
        </div>
      </div>

    </div>
  )
}
