import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import TaskRegistry from './pages/TaskRegistry';
import Analytics from './pages/Analytics';

function App() {
  return (
    <TaskProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/registry" element={<TaskRegistry />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </Router>
    </TaskProvider>
  );
}

export default App;