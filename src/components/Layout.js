import React, { useState } from 'react';
import { Nav, Badge, Toast, ToastContainer, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTask } from '../context/TaskContext';
import CreateTaskModal from './CreateTaskModal';

const Layout = ({ children }) => {
  const location = useLocation();
  const { tasks, toast, hideToast, getStats } = useTask();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const stats = getStats();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/kanban', label: 'Tableau Kanban', icon: 'bi-kanban' },
    { path: '/registry', label: 'Registre des Tâches', icon: 'bi-list-ul' },
    { path: '/analytics', label: 'Analyses', icon: 'bi-graph-up' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="d-flex">
      {/* Sidebar Desktop */}
      <div className={`sidebar d-none d-lg-flex flex-column ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header Sidebar */}
        <div className="sidebar-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-kanban text-primary fs-4 me-2"></i>
              {!sidebarCollapsed && <span className="fw-bold fs-5">TaskFlow</span>}
            </div>
            <button 
              className="btn btn-link text-muted p-1"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Étendre' : 'Réduire'}
            >
              <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <Nav className="flex-column sidebar-nav">
          {menuItems.map((item) => (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <i className={`${item.icon} sidebar-icon`}></i>
              {!sidebarCollapsed && <span className="sidebar-text">{item.label}</span>}
            </Nav.Link>
          ))}
        </Nav>

        {/* Bouton Nouvelle Tâche */}
        <div className="sidebar-action">
          <button
            className={`btn btn-primary w-100 ${sidebarCollapsed ? 'btn-sm' : ''}`}
            onClick={() => setShowCreateModal(true)}
            title={sidebarCollapsed ? 'Nouvelle tâche' : ''}
          >
            <i className="bi bi-plus-lg me-1"></i>
            {!sidebarCollapsed && 'Nouvelle tâche'}
          </button>
        </div>

        {/* Statistiques Sidebar */}
        {!sidebarCollapsed && (
          <div className="sidebar-stats">
            <h6 className="text-muted mb-3">Statistiques</h6>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value text-primary">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-success">{stats.done}</div>
                <div className="stat-label">Terminées</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-warning">{stats.inProgress}</div>
                <div className="stat-label">En cours</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-danger">{stats.highPriority}</div>
                <div className="stat-label">Priorité haute</div>
              </div>
            </div>
          </div>
        )}

        {/* Profil utilisateur */}
        <div className="sidebar-footer">
          <div className={`user-profile ${sidebarCollapsed ? 'text-center' : ''}`}>
            <div className="user-avatar">
              <i className="bi bi-person-fill"></i>
            </div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <div className="user-name">Hector Mbakama</div>
                <div className="user-role">Administrateur</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Mobile */}
      <Offcanvas show={showMobileSidebar} onHide={() => setShowMobileSidebar(false)} placement="start">
        <Offcanvas.Header closeButton className="bg-primary text-white">
          <Offcanvas.Title>
            <i className="bi bi-kanban me-2"></i>
            TaskFlow
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Nav className="flex-column">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`d-flex align-items-center px-4 py-3 border-bottom ${isActive(item.path) ? 'bg-primary text-white' : ''}`}
                onClick={() => setShowMobileSidebar(false)}
              >
                <i className={`${item.icon} me-3`}></i>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
          
          <div className="p-4">
            <button
              className="btn btn-primary w-100 mb-4"
              onClick={() => {
                setShowCreateModal(true);
                setShowMobileSidebar(false);
              }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Nouvelle tâche
            </button>
            
            <h6 className="fw-bold mb-3">Statistiques rapides</h6>
            <div className="row g-2">
              <div className="col-6">
                <div className="text-center p-2 bg-light rounded">
                  <div className="fw-bold text-primary">{stats.total}</div>
                  <small>Total</small>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-2 bg-light rounded">
                  <div className="fw-bold text-success">{stats.done}</div>
                  <small>Terminées</small>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Contenu principal */}
      <div className="main-content">
        {/* Header mobile */}
        <div className="mobile-header d-lg-none">
          <div className="d-flex align-items-center justify-content-between">
            <button
              className="btn btn-link text-primary p-2"
              onClick={() => setShowMobileSidebar(true)}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            
            <div className="d-flex align-items-center">
              <i className="bi bi-kanban text-primary fs-4 me-2"></i>
              <span className="fw-bold fs-5">TaskFlow</span>
            </div>
            
            <Badge bg="primary" className="fs-6">
              {tasks.length}
            </Badge>
          </div>
        </div>

        {/* Contenu des pages */}
        <main className="page-content">
          {children}
        </main>
      </div>

      {/* Bouton flottant mobile */}
      <button 
        className="fab d-lg-none"
        onClick={() => setShowCreateModal(true)}
        title="Créer une nouvelle tâche"
      >
        <i className="bi bi-plus-lg"></i>
      </button>

      {/* Modal de création de tâche */}
      <CreateTaskModal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)} 
      />

      {/* Toast notifications */}
      <ToastContainer className="toast-container">
        <Toast 
          show={toast.show} 
          onClose={hideToast}
          delay={4000}
          autohide
          bg={toast.variant}
        >
          <Toast.Header>
            <i className={`bi bi-${toast.variant === 'success' ? 'check-circle' : toast.variant === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2`}></i>
            <strong className="me-auto">TaskFlow</strong>
          </Toast.Header>
          <Toast.Body className={toast.variant === 'success' || toast.variant === 'danger' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Layout;