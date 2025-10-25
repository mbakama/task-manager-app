// Service de gestion des tâches
// En mode démo, utilise le localStorage
// En production, remplacer par Firebase

class TaskService {
  constructor() {
    this.storageKey = 'taskflow_tasks';
    this.initializeDemoData();
  }

  // Initialiser avec des données de démonstration
  initializeDemoData() {
    const existingTasks = this.getTasks();
    if (existingTasks.length === 0) {
      const demoTasks = [
        {
          id: '1',
          title: 'Configurer Firebase',
          description: 'Mettre en place la base de données Firebase pour la synchronisation en temps réel',
          priority: 'high',
          status: 'todo',
          assignee: 'Hector Mbakama',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Hier
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          title: 'Interface utilisateur',
          description: 'Finaliser le design avec Material-UI et les animations',
          priority: 'medium',
          status: 'inProgress',
          assignee: 'Hector Mbakama',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // Il y a 2 jours
          updatedAt: new Date(Date.now() - 3600000).toISOString() // Il y a 1 heure
        },
        {
          id: '3',
          title: 'Tests unitaires',
          description: 'Écrire les tests pour les composants React',
          priority: 'medium',
          status: 'review',
          assignee: 'Équipe QA',
          createdAt: new Date(Date.now() - 259200000).toISOString(), // Il y a 3 jours
          updatedAt: new Date(Date.now() - 7200000).toISOString() // Il y a 2 heures
        },
        {
          id: '4',
          title: 'Documentation',
          description: 'Rédiger la documentation utilisateur et technique',
          priority: 'low',
          status: 'done',
          assignee: 'Hector Mbakama',
          createdAt: new Date(Date.now() - 345600000).toISOString(), // Il y a 4 jours
          updatedAt: new Date(Date.now() - 86400000).toISOString() // Hier
        }
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(demoTasks));
    }
  }

  // Récupérer toutes les tâches
  getTasks() {
    try {
      const tasks = localStorage.getItem(this.storageKey);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      return [];
    }
  }

  // Créer une nouvelle tâche
  async createTask(task) {
    return new Promise((resolve, reject) => {
      try {
        const tasks = this.getTasks();
        tasks.push(task);
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));

        // Simuler un délai réseau
        setTimeout(() => {
          resolve(task);
        }, 300);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Mettre à jour une tâche
  async updateTask(updatedTask) {
    return new Promise((resolve, reject) => {
      try {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === updatedTask.id);

        if (index !== -1) {
          tasks[index] = updatedTask;
          localStorage.setItem(this.storageKey, JSON.stringify(tasks));

          // Simuler un délai réseau
          setTimeout(() => {
            resolve(updatedTask);
          }, 200);
        } else {
          reject(new Error('Tâche non trouvée'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Supprimer une tâche
  async deleteTask(taskId) {
    return new Promise((resolve, reject) => {
      try {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredTasks));

        // Simuler un délai réseau
        setTimeout(() => {
          resolve(taskId);
        }, 200);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Récupérer les statistiques
  getStats() {
    const tasks = this.getTasks();
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'inProgress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
      highPriority: tasks.filter(t => t.priority === 'high').length
    };
  }
}

// Configuration Firebase (pour la production)
const firebaseConfig = {
  apiKey: "AIzaSyDDOZfLRWbWq45FuQ7NwIvj_2NeSAWLiPQ",
  authDomain: "tast-a47ff.firebaseapp.com",
  projectId: "tast-a47ff",
  storageBucket: "tast-a47ff.firebasestorage.app",
  messagingSenderId: "149849168981",
  appId: "1:149849168981:web:822bec1556e5790c7e08dc",
  measurementId: "G-D558VZ6N7T"
};

// Exporter le service
export const taskService = new TaskService();

// Fonction pour migrer vers Firebase (à implémenter)
export const migrateToFirebase = () => {
  console.log('Migration vers Firebase à implémenter avec la configuration:', firebaseConfig);
  // Ici, vous pourriez implémenter la logique de migration
  // depuis localStorage vers Firebase Firestore
};