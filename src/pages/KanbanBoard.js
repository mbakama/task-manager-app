import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTask } from '../context/TaskContext';
import TaskBoard from '../components/TaskBoard';

const KanbanBoard = () => {
  const { tasks, columns, moveTask, deleteTask, updateTask, loading } = useTask();

  const handleDragEnd = async (result) => {
    // Vérifications de sécurité
    if (!result) return;
    if (!result.destination) return;
    if (!result.source) return;

    const { source, destination, draggableId } = result;
    
    // Vérifier que les IDs de colonnes sont valides
    const validColumnIds = Object.keys(columns);
    if (!validColumnIds.includes(source.droppableId) || !validColumnIds.includes(destination.droppableId)) {
      console.error('ID de colonne invalide:', { source: source.droppableId, destination: destination.droppableId });
      return;
    }
    
    // Si même colonne, pas de changement
    if (source.droppableId === destination.droppableId) return;

    // Vérifier que la tâche existe
    const taskExists = tasks.find(task => task.id === draggableId);
    if (!taskExists) {
      console.error('Tâche non trouvée:', draggableId);
      return;
    }

    // Déplacer la tâche
    await moveTask(draggableId, destination.droppableId);
  };

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

  return (
    <Container fluid className="py-4">
      {/* En-tête */}
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-1">
            <i className="bi bi-kanban me-2"></i>
            Tableau Kanban
          </h1>
          <p className="text-muted">Gérez vos tâches par glisser-déposer</p>
        </Col>
      </Row>

      {/* Tableau Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskBoard
          tasks={tasks}
          columns={columns}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
        />
      </DragDropContext>
    </Container>
  );
};

export default KanbanBoard;