import api from './apiInterceptors.ts'
export default api;

// Fetch tasks from the backend or local storage
export const fetchTasks = async () => {
    if (!navigator.onLine) {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }
    const { data } = await api.get('/tasks');
    localStorage.removeItem('tasks');
    localStorage.setItem('tasks', JSON.stringify(data.data));
    return data.data;
};

// Create a new task
export const createTask = async (task: { title: string; description: string }) => {
    if (!navigator.onLine) {
        saveOfflineTask({ ...task, status: 'create' }); // Save offline
        return task;
    }
    const formData = new URLSearchParams();
    formData.append('title', task.title);
    formData.append('description', task.description);

    try {
        const { data } = await api.post('/tasks', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (data.success === false) {
            // Handle validation error
            console.error("Validation Error:", data.data);
            alert(`Error: ${data.data.description.join(', ')}`);
            return;
        }

    } catch (error) {
        console.error("API Error:", error);
        alert("An error occurred while creating the task.");
    }
};

// Update an existing task
export const updateTask = async (task: { id: string; title: string; description: string }) => {
    if (!navigator.onLine) {
        saveOfflineTask({ ...task, status: 'update' });
        return task;
    }
    const formData = new URLSearchParams();
    formData.append('title', task.title);
    formData.append('description', task.description);

    try {
        const { data } = await api.post(`/tasks/${task.id}`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (data.success === false) {
            // Handle validation error
            console.error("Validation Error:", data.data);
            alert(`Error: ${data.data.description.join(', ')}`);
            return;
        }

    } catch (error) {
        console.error("API Error:", error);
        alert("An error occurred while creating the task.");
    }
};

// Delete a task
export const deleteTask = async (id: string) => {
    if (!navigator.onLine) {
        saveOfflineTask({ id, status: 'delete' }); // Save offline
        return;
    }
    await api.delete(`/tasks/${id}`);
};


const saveOfflineTask = (task: any) => {
    const offlineTasks = JSON.parse(localStorage.getItem('offlineTasks') || '[]');
    offlineTasks.push(task);
    syncTasksOffline(task);
    localStorage.setItem('offlineTasks', JSON.stringify(offlineTasks));
};

export const syncTasks = async () => {
    if (!navigator.onLine) return;

    const offlineTasks = JSON.parse(localStorage.getItem('offlineTasks') || '[]');
    for (const task of offlineTasks) {
        try {
            if (task.status === 'create') {
                await createTask(task);
            } else if (task.status === 'update') {
                await updateTask(task);
            } else if (task.status === 'delete') {
                await deleteTask(task.id);
            }
        } catch (error) {
            console.error('Error syncing task:', task, error);
        }
    }

    // Clear offline tasks after successful sync
    localStorage.removeItem('offlineTasks');
};

// Save a task and ensure the tasks list is updated in localStorage
export const syncTasksOffline = (task: any) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    if (task.status === 'create') {
        const randomId = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random ID
        tasks.push({ ...task, id: randomId });
    } else if (task.status === 'update') {
        const index = tasks.findIndex((t: any) => t.id === task.id);
        if (index !== -1) tasks[index] = task;
    } else if (task.status === 'delete') {
        const updatedTasks = tasks.filter((t: any) => t.id !== task.id);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return;
    }
    return localStorage.setItem('tasks', JSON.stringify(tasks));
};