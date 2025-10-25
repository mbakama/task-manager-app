import React, { useState } from 'react';
import { Card, Dropdown, Modal, Button, Form, Badge } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index, onDelete, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => {
    setEditedTask(task);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      onDelete(task.id);
    }
  };

  const handleSaveEdit = () => {
    onUpdate({
      ...editedTask,
      updatedAt: new Date().toISOString()
    });
    setShowEditModal(false);
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'high': return { color: 'danger', icon: '🔴', label: 'Haute' };
      case 'medium': return { color: 'warning', icon: '🟡', label: 'Moyenne' };
      case 'low': return { color: 'success', icon: '🟢', label: 'Basse' };
      default: return { color: 'secondary', icon: '⚪', label: priority };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleInputChange = (field, value) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
  };

  const priorityInfo = getPriorityInfo(task.priority);

  return (
    <>
      <Draggable draggableId={task.id} index={index} key={task.id}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`task-card mb-3 priority-${task.priority} ${snapshot.isDragging ? 'dragging' : ''}`}
          >
            <Card.Body className="p-3">
              {/* En-tête avec titre et menu */}
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="card-title mb-0 flex-grow-1 pe-2">
                  {task.title}
                </h6>
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="link" 
                    className="p-0 border-0 text-muted"
                    style={{ boxShadow: 'none' }}
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleEdit}>
                      <i className="bi bi-pencil me-2"></i>
                      Modifier
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleDelete} className="text-danger">
                      <i className="bi bi-trash me-2"></i>
                      Supprimer
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {/* Description */}
              {task.description && (
                <p className="card-text text-muted small mb-3" style={{ lineHeight: '1.4' }}>
                  {task.description}
                </p>
              )}

              {/* Priorité */}
              <div className="mb-3">
                <Badge bg={priorityInfo.color} className="d-inline-flex align-items-center">
                  <span className="me-1">{priorityInfo.icon}</span>
                  {priorityInfo.label}
                </Badge>
              </div>

              {/* Footer avec assigné et date */}
              <div className="d-flex justify-content-between align-items-center text-muted small">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                       style={{ width: '24px', height: '24px' }}>
                    <i className="bi bi-person-fill text-white" style={{ fontSize: '0.7rem' }}></i>
                  </div>
                  <span>{task.assignee}</span>
                </div>
                
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar3 me-1"></i>
                  <span>{formatDate(task.createdAt)}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Draggable>

      {/* Modal d'édition */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil me-2"></i>
            Modifier la tâche
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Titre de la tâche *</Form.Label>
              <Form.Control
                type="text"
                value={editedTask.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedTask.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Form.Group>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Priorité</Form.Label>
                  <Form.Select
                    value={editedTask.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    <option value="low">🟢 Basse</option>
                    <option value="medium">🟡 Moyenne</option>
                    <option value="high">🔴 Haute</option>
                  </Form.Select>
                </Form.Group>
              </div>
              
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Assigné à</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedTask.assignee}
                    onChange={(e) => handleInputChange('assignee', e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            <i className="bi bi-x-lg me-1"></i>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            <i className="bi bi-check-lg me-1"></i>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskCard;