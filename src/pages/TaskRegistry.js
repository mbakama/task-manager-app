import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown as PrimeDropdown } from 'primereact/dropdown';
import { Button as PrimeButton } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Menu } from 'primereact/menu';
import { useTask } from '../context/TaskContext';

const TaskRegistry = () => {
  const { tasks, loading, deleteTask, updateTask } = useTask();
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);
  
  // Options pour les filtres
  const statusOptions = [
    { label: 'Tous les statuts', value: null },
    { label: 'À faire', value: 'todo' },
    { label: 'En cours', value: 'inProgress' },
    { label: 'En révision', value: 'review' },
    { label: 'Terminé', value: 'done' }
  ];
  
  const priorityOptions = [
    { label: 'Toutes priorités', value: null },
    { label: 'Haute', value: 'high' },
    { label: 'Moyenne', value: 'medium' },
    { label: 'Basse', value: 'low' }
  ];

  // Templates pour les colonnes
  const titleBodyTemplate = (rowData) => {
    return (
      <div>
        <div className="fw-bold">{rowData.title}</div>
        {rowData.description && (
          <small className="text-muted">{rowData.description}</small>
        )}
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const statusConfig = {
      todo: { severity: 'info', value: 'À faire' },
      inProgress: { severity: 'warning', value: 'En cours' },
      review: { severity: 'help', value: 'En révision' },
      done: { severity: 'success', value: 'Terminé' }
    };
    
    const config = statusConfig[rowData.status] || { severity: 'secondary', value: rowData.status };
    return <Tag severity={config.severity} value={config.value} />;
  };

  const priorityBodyTemplate = (rowData) => {
    const priorityConfig = {
      high: { severity: 'danger', value: '🔴 Haute' },
      medium: { severity: 'warning', value: '🟡 Moyenne' },
      low: { severity: 'success', value: '🟢 Basse' }
    };
    
    const config = priorityConfig[rowData.priority] || { severity: 'secondary', value: rowData.priority };
    return <Tag severity={config.severity} value={config.value} />;
  };

  const assigneeBodyTemplate = (rowData) => {
    return (
      <div className="d-flex align-items-center">
        <div className="bg-primary rounded-circle me-2 d-flex align-items-center justify-content-center" 
             style={{ width: '24px', height: '24px' }}>
          <i className="bi bi-person-fill text-white" style={{ fontSize: '0.7rem' }}></i>
        </div>
        {rowData.assignee}
      </div>
    );
  };

  const dateBodyTemplate = (field) => (rowData) => {
    const date = new Date(rowData[field]);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const actionBodyTemplate = (rowData) => {
    const menuItems = [
      {
        label: 'Modifier',
        icon: 'pi pi-pencil',
        command: () => handleEdit(rowData)
      },
      {
        separator: true
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash',
        command: () => handleDelete(rowData.id),
        className: 'text-danger'
      }
    ];

    return (
      <PrimeButton 
        icon="pi pi-ellipsis-v" 
        className="p-button-text p-button-sm"
        onClick={(e) => {
          const menu = document.createElement('div');
          // Implémentation simplifiée du menu
        }}
      />
    );
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      await deleteTask(taskId);
    }
  };

  const handleEdit = (task) => {
    // TODO: Implémenter l'édition
    console.log('Éditer la tâche:', task);
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedTasks.length} tâche(s) ?`)) {
      for (const task of selectedTasks) {
        await deleteTask(task.id);
      }
      setSelectedTasks([]);
    }
  };

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText 
              value={globalFilter} 
              onChange={(e) => setGlobalFilter(e.target.value)} 
              placeholder="Rechercher dans les tâches..." 
              className="p-inputtext-sm"
            />
          </span>
          
          {selectedTasks.length > 0 && (
            <PrimeButton 
              label={`Supprimer (${selectedTasks.length})`}
              icon="pi pi-trash" 
              severity="danger"
              size="small"
              onClick={handleBulkDelete}
            />
          )}
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <PrimeButton 
            icon="pi pi-refresh" 
            className="p-button-outlined p-button-sm"
            onClick={() => {
              setGlobalFilter('');
              setSelectedTasks([]);
            }}
            tooltip="Réinitialiser les filtres"
          />
          
          <PrimeButton 
            icon="pi pi-download" 
            className="p-button-outlined p-button-sm"
            onClick={() => {
              // TODO: Implémenter l'export
              console.log('Export des tâches');
            }}
            tooltip="Exporter les données"
          />
        </div>
      </div>
    );
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
            <i className="bi bi-list-ul me-2"></i>
            Registre des Tâches
          </h1>
          <p className="text-muted">Vue complète et détaillée de toutes vos tâches</p>
        </Col>
      </Row>

      {/* Tableau PrimeReact */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-3">
          <DataTable 
            value={tasks}
            paginator 
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            globalFilter={globalFilter}
            header={renderHeader()}
            selection={selectedTasks}
            onSelectionChange={(e) => setSelectedTasks(e.value)}
            dataKey="id"
            loading={loading}
            emptyMessage="Aucune tâche trouvée"
            className="p-datatable-sm"
            stripedRows
            showGridlines
            responsiveLayout="scroll"
            sortMode="multiple"
            removableSort
          >
            <Column 
              selectionMode="multiple" 
              headerStyle={{ width: '3rem' }}
            />
            
            <Column 
              field="title" 
              header="Titre" 
              body={titleBodyTemplate}
              sortable
              filter
              filterPlaceholder="Rechercher par titre"
              style={{ minWidth: '200px' }}
            />
            
            <Column 
              field="status" 
              header="Statut" 
              body={statusBodyTemplate}
              sortable
              filter
              filterElement={
                <PrimeDropdown 
                  options={statusOptions}
                  placeholder="Filtrer par statut"
                  className="p-column-filter"
                  showClear
                />
              }
              style={{ minWidth: '120px' }}
            />
            
            <Column 
              field="priority" 
              header="Priorité" 
              body={priorityBodyTemplate}
              sortable
              filter
              filterElement={
                <PrimeDropdown 
                  options={priorityOptions}
                  placeholder="Filtrer par priorité"
                  className="p-column-filter"
                  showClear
                />
              }
              style={{ minWidth: '120px' }}
            />
            
            <Column 
              field="assignee" 
              header="Assigné à" 
              body={assigneeBodyTemplate}
              sortable
              filter
              filterPlaceholder="Rechercher par assigné"
              style={{ minWidth: '150px' }}
            />
            
            <Column 
              field="createdAt" 
              header="Créé le" 
              body={dateBodyTemplate('createdAt')}
              sortable
              dataType="date"
              style={{ minWidth: '140px' }}
            />
            
            <Column 
              field="updatedAt" 
              header="Modifié le" 
              body={dateBodyTemplate('updatedAt')}
              sortable
              dataType="date"
              style={{ minWidth: '140px' }}
            />
            
            <Column 
              header="Actions" 
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: '100px', textAlign: 'center' }}
            />
          </DataTable>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TaskRegistry;