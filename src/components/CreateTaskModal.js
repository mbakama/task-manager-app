import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTask } from '../context/TaskContext';

const CreateTaskModal = ({ show, onHide }) => {
  const { createTask } = useTask();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: 'Hector Mbakama'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignee: 'Hector Mbakama'
      });
      onHide();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignee: 'Hector Mbakama'
      });
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop={isSubmitting ? 'static' : true}>
      <Modal.Header closeButton={!isSubmitting}>
        <Modal.Title>
          <i className="bi bi-plus-circle me-2"></i>
          Créer une nouvelle tâche
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Titre de la tâche *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le titre de la tâche"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description détaillée de la tâche"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isSubmitting}
            />
          </Form.Group>
          
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Priorité</Form.Label>
                <Form.Select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  disabled={isSubmitting}
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
                  value={formData.assignee}
                  onChange={(e) => handleInputChange('assignee', e.target.value)}
                  disabled={isSubmitting}
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <i className="bi bi-x-lg me-1"></i>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Création...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-1"></i>
                Créer la tâche
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;