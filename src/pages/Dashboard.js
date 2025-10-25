import React from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTask } from '../context/TaskContext';

const Dashboard = () => {
  const { tasks, loading, getStats, getTasksByStatus, getTasksByPriority } = useTask();
  
  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </Container>
    );
  }

  const stats = getStats();
  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);
  
  const highPriorityTasks = getTasksByPriority('high');
  const inProgressTasks = getTasksByStatus('inProgress');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'success'
    };
    const labels = {
      high: '🔴 Haute',
      medium: '🟡 Moyenne',
      low: '🟢 Basse'
    };
    return <Badge bg={variants[priority]}>{labels[priority]}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      todo: 'primary',
      inProgress: 'warning',
      review: 'info',
      done: 'success'
    };
    const labels = {
      todo: 'À faire',
      inProgress: 'En cours',
      review: 'En révision',
      done: 'Terminé'
    };
    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      {/* En-tête */}
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-1">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </h1>
          <p className="text-muted">Vue d'ensemble de vos tâches et projets</p>
        </Col>
      </Row>

      {/* Statistiques principales */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-6 text-primary mb-2">
                <i className="bi bi-list-task"></i>
              </div>
              <h3 className="mb-1">{stats.total}</h3>
              <p className="text-muted mb-0">Total des tâches</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-6 text-warning mb-2">
                <i className="bi bi-arrow-clockwise"></i>
              </div>
              <h3 className="mb-1">{stats.inProgress}</h3>
              <p className="text-muted mb-0">En cours</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-6 text-success mb-2">
                <i className="bi bi-check-circle"></i>
              </div>
              <h3 className="mb-1">{stats.done}</h3>
              <p className="text-muted mb-0">Terminées</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-6 text-danger mb-2">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <h3 className="mb-1">{stats.highPriority}</h3>
              <p className="text-muted mb-0">Priorité haute</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progression et actions rapides */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Progression générale
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Taux de completion</span>
                  <span className="fw-bold">{stats.completionRate}%</span>
                </div>
                <ProgressBar 
                  now={stats.completionRate} 
                  variant="success"
                  style={{ height: '8px' }}
                />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tâches actives</span>
                  <span className="fw-bold">{stats.activeRate}%</span>
                </div>
                <ProgressBar 
                  now={stats.activeRate} 
                  variant="warning"
                  style={{ height: '8px' }}
                />
              </div>

              <Row className="mt-4">
                <Col sm={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <span>À faire: {stats.todo}</span>
                  </div>
                </Col>
                <Col sm={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <span>En cours: {stats.inProgress}</span>
                  </div>
                </Col>
                <Col sm={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    <div className="bg-info rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <span>En révision: {stats.review}</span>
                  </div>
                </Col>
                <Col sm={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <span>Terminées: {stats.done}</span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Actions rapides
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link to="/kanban" className="btn btn-primary">
                  <i className="bi bi-kanban me-2"></i>
                  Voir le tableau Kanban
                </Link>
                <Link to="/registry" className="btn btn-outline-primary">
                  <i className="bi bi-list-ul me-2"></i>
                  Consulter le registre
                </Link>
                <Link to="/analytics" className="btn btn-outline-secondary">
                  <i className="bi bi-graph-up me-2"></i>
                  Voir les analyses
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tâches récentes et prioritaires */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Activité récente
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {recentTasks.length > 0 ? (
                <ListGroup variant="flush">
                  {recentTasks.map((task) => (
                    <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{task.title}</h6>
                        <p className="mb-1 text-muted small">{task.description}</p>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {formatDate(task.updatedAt)}
                        </small>
                      </div>
                      <div className="ms-2">
                        {getStatusBadge(task.status)}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox display-4 mb-3"></i>
                  <p>Aucune activité récente</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Tâches prioritaires
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {highPriorityTasks.length > 0 ? (
                <ListGroup variant="flush">
                  {highPriorityTasks.slice(0, 5).map((task) => (
                    <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{task.title}</h6>
                        <p className="mb-1 text-muted small">{task.assignee}</p>
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          {formatDate(task.createdAt)}
                        </small>
                      </div>
                      <div className="ms-2">
                        {getPriorityBadge(task.priority)}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-check-circle display-4 mb-3"></i>
                  <p>Aucune tâche prioritaire</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;