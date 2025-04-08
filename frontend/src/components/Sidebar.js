import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

function Sidebar() {
  const location = useLocation();
  const { account } = useWeb3();

  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      {/* Sidebar - Brand */}
      <Link className="sidebar-brand d-flex align-items-center" to="/" style={{ padding: '1rem' }}>
        <div className="sidebar-brand-icon">
          <img src="img/TsukiNijiMoonBow.png" alt="Logo" style={{ width: '80px', height: 'auto' }} />
        </div>
        <div className="sidebar-brand-text mx-3">Tsuki<br />Niji Labs</div>
      </Link>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Nav Item - Dashboard */}
      <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Link className="nav-link" to="/">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Heading */}
      <div className="sidebar-heading">
        NFT Management
      </div>

      {/* Nav Item - NFT Marketplace */}
      <li className={`nav-item ${location.pathname === '/marketplace' ? 'active' : ''}`}>
        <Link className="nav-link" to="/marketplace">
          <i className="fas fa-fw fa-store"></i>
          <span>NFT Marketplace</span>
        </Link>
      </li>

      {/* Nav Item - My NFTs */}
      <li className={`nav-item ${location.pathname === '/my-nfts' ? 'active' : ''}`}>
        <Link className="nav-link" to="/my-nfts">
          <i className="fas fa-fw fa-images"></i>
          <span>My NFTs</span>
        </Link>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Heading */}
      <div className="sidebar-heading">
        Revenue
      </div>

      {/* Nav Item - Revenue Distribution */}
      <li className={`nav-item ${location.pathname === '/revenue' ? 'active' : ''}`}>
        <Link className="nav-link" to="/revenue">
          <i className="fas fa-fw fa-chart-pie"></i>
          <span>Revenue Distribution</span>
        </Link>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Admin Section - Only show if connected wallet is admin */}
      {account && (
        <>
          <div className="sidebar-heading">
            Administration
          </div>

          <li className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            <Link className="nav-link" to="/admin">
              <i className="fas fa-fw fa-cog"></i>
              <span>Admin Panel</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />
        </>
      )}

      {/* Sidebar Toggler (Sidebar) */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
    </ul>
  );
}

export default Sidebar;
