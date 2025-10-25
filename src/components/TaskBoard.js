import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const TaskBoard = ({ tasks, columns, onDeleteTask, onUpdateTask }) => {
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="row g-4">
      {Object.values(columns).map((column) => (
        <div key={column.id} className="col-lg-3 col-md-6">
          <div className="kanban-column">
            {/* En-tête de colonne */}
            <div 
              className="kanban-header text-center"
              style={{ backgroundColor: column.bgColor }}
            >
              <h5 className="mb-0 d-flex align-items-center justify-content-between">
                <span>{column.title}</span>
                <span className="badge bg-white text-dark rounded-pill">
                  {getTasksByStatus(column.id).length}
                </span>
              </h5>
            </div>

            {/* Corps de colonne avec zone de drop */}
            <Droppable droppableId={column.id} key={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-body drop-zone ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                >
                  {getTasksByStatus(column.id).map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onDelete={onDeleteTask}
                      onUpdate={onUpdateTask}
                    />
                  ))}
                  {provided.placeholder}
                  
                  {/* État vide */}
                  {getTasksByStatus(column.id).length === 0 && (
                    <div className="empty-state">
                      <i className="bi bi-inbox"></i>
                      <div>Aucune tâche</div>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;