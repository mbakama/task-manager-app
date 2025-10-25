import React, { useMemo } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTask } from '../context/TaskContext';


const Analytics = () => {
  const { tasks, loading, getStats } = useTask();

  // Données pour les graphiques
  const chartData = useMemo(() => {
    const stats = getStats();
    
    // Données pour le graphique en secteurs (statuts)
    const statusData = [
      { name: 'À faire', value: stats.todo, color: '#007bff' },
      { name: 'En cours', value: stats.inProgress, color: '#fd7e14' },
      { name: 'En révision', value: stats.review, color: '#6f42c1' },
      { name: 'Terminé', value: stats.done, color: '#28a745' }
    ].filter(item => item.value > 0);

    // Données pour le graphique en barres (priorités)
    const priorityData = [
      { name: 'Haute', value: tasks.filter(t => t.priority === 'high').length, color: '#dc3545' },
      { name: 'Moyenne', value: tasks.filter(t => t.priority === 'medium').length, color: '#ffc107' },
      { name: 'Basse', value: tasks.filter(t => t.priority === 'low').length, color: '#28a745' }
    ];

    // Données pour le graphique temporel (tâches créées par jour)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const tasksCreated = tasks.filter(task => 
        task.createdAt.split('T')[0] === dateStr
      ).length;
      
      const tasksCompleted = tasks.filter(task => 
        task.updatedAt.split('T')[0] === dateStr && task.status === 'done'
      ).length;

      last7Days.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        créées: tasksCreated,
        terminées: tasksCompleted
      });
    }

    // Données par assigné
    const assigneeData = {};
    tasks.forEach(task => {
      if (!assigneeData[task.assignee]) {
        assigneeData[task.assignee] = { name: task.assignee, total: 0, done: 0 };
      }
      assigneeData[task.assignee].total++;
      if (task.status === 'done') {
        assigneeData[task.assignee].done++;
      }
    });

    const assigneeChartData = Object.values(assigneeData).map(data => ({
      ...data,
      completion: data.total > 0 ? Math.round((data.done / data.total) * 100) : 0
    }));

    return {
      statusData,
      priorityData,
      timelineData: last7Days,
      assigneeData: assigneeChartData,
      stats
    };
  }, [tasks]);

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="mb-1 fw-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-0" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Container fluid className="py-4">
      {/* En-tête */}
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-1">
            <i className="bi bi-graph-up me-2"></i>
            Analyses et Statistiques
          </h1>
          <p className="text-muted">Visualisez les performances et tendances de vos tâches</p>
        </Col>
      </Row>

      {/* Métriques principales */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="display-6 text-primary mb-2">
                <i className="bi bi-check-circle"></i>
              </div>
              <h3 className="mb-1">{chartData.stats.completionRate}%</h3>
              <p className="text-muted mb-0">Taux de completion</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="display-6 text-warning mb-2">
                <i className="bi bi-clock"></i>
              </div>
              <h3 className="mb-1">{chartData.stats.activeRate}%</h3>
              <p className="text-muted mb-0">Tâches actives</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="display-6 text-danger mb-2">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <h3 className="mb-1">{chartData.stats.highPriority}</h3>
              <p className="text-muted mb-0">Priorité haute</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="display-6 text-info mb-2">
                <i className="bi bi-people"></i>
              </div>
              <h3 className="mb-1">{chartData.assigneeData.length}</h3>
              <p className="text-muted mb-0">Collaborateurs</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Graphiques */}
      <Row className="mb-4">
        {/* Répartition par statut */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-pie-chart me-2"></i>
                Répartition par statut
              </h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Répartition par priorité */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-bar-chart me-2"></i>
                Répartition par priorité
              </h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#007bff" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        {/* Évolution temporelle */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Évolution sur 7 jours
              </h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="créées" 
                    stroke="#007bff" 
                    strokeWidth={2}
                    dot={{ fill: '#007bff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="terminées" 
                    stroke="#28a745" 
                    strokeWidth={2}
                    dot={{ fill: '#28a745' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Performance par collaborateur */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>
                Performance équipe
              </h5>
            </Card.Header>
            <Card.Body>
              {chartData.assigneeData.length > 0 ? (
                <div className="space-y-3">
                  {chartData.assigneeData.map((assignee, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-semibold">{assignee.name}</span>
                        <span className="text-muted">{assignee.completion}%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${assignee.completion}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">
                        {assignee.done}/{assignee.total} tâches terminées
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-people display-4 mb-3"></i>
                  <p>Aucune donnée disponible</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Insights et recommandations */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-lightbulb me-2"></i>
                Insights et Recommandations
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <div className="d-flex align-items-start">
                    <div className="bg-primary rounded-circle p-2 me-3 custom-text-image">
                      <i className="bi bi-trophy text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">Performance</h6>
                      <p className="text-muted mb-0">
                        {chartData.stats.completionRate >= 70 ? 
                          'Excellent taux de completion ! Continuez ainsi.' :
                          'Le taux de completion peut être amélioré.'
                        }
                      </p>
                    </div>
                  </div>
                </Col>
                
                <Col md={4} className="mb-3">
                  <div className="d-flex align-items-start">
                    <div className="bg-warning rounded-circle p-2 me-3 custom-text-image">
                      <i className="bi bi-exclamation-triangle text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">Priorités</h6>
                      <p className="text-muted mb-0">
                        {chartData.stats.highPriority > 0 ? 
                          `${chartData.stats.highPriority} tâche(s) haute priorité nécessitent votre attention.` :
                          'Aucune tâche haute priorité en attente.'
                        }
                      </p>
                    </div>
                  </div>
                </Col>
                
                <Col md={4} className="mb-3">
                  <div className="d-flex align-items-start">
                    <div className="bg-info rounded-circle p-2 me-3 custom-text-image">
                      <i className="bi bi-graph-up text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">Tendance</h6>
                      <p className="text-muted mb-0">
                        {chartData.stats.inProgress > chartData.stats.todo ? 
                          'Bonne dynamique : plus de tâches en cours qu\'en attente.' :
                          'Pensez à démarrer plus de tâches en attente.'
                        }
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;