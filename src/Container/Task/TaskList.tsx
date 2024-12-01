import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, updateTask, deleteTask, syncTasks } from '../../utlis/api.ts';
import AddTask from "./AddTask.tsx";

const TaskList = () => {
    const queryClient = useQueryClient();

    // Fetch tasks using React Query
    const { data: tasks = [], isLoading, isError } = useQuery({
        queryKey: ['tasks'],
        queryFn: fetchTasks,
        staleTime: 300000, // Cache for 5 minutes
    });
    const [editingTask, setEditingTask] = useState<{ id: string; title: string; description: string } | null>(null);

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    // Edit Task
    const handleEdit = (task: { id: string; title: string; description: string }) => {
        setEditingTask(task);
    };

    const handleUpdate = () => {
        if (editingTask) {
            updateMutation.mutate(editingTask);
            setEditingTask(null);
        }
    };

    // Delete Task
    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    // Sync offline tasks on reconnect
    useEffect(() => {
        const handleOnline = () => {
            syncTasks();
        };

        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    if (isLoading) return <h4>Loading...</h4>;
    if (isError) return <h4>Error fetching tasks!</h4>;

    return (
        <div className="container my-5">
            <AddTask />
            <div className="row">
                {tasks.map((task: { id: string; title: string; description: string }) => (
                    <div className="col-12 mb-3" key={task.id}>
                        <div className="card">
                            <div className="card-body">
                                {editingTask?.id === task.id ? (
                                    <input
                                        type="text"
                                        value={editingTask.title}
                                        className="form-control mb-3"
                                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                                    />
                                ) : (
                                    <h4 className="card-title">{task.title}</h4>
                                )}
                                {editingTask?.id === task.id ? (
                                    <input
                                        type="text"
                                        value={editingTask.description}
                                        className="form-control mb-3"
                                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                                    />
                                ) : (
                                    <p>
                                        {task.description}
                                    </p>
                                )}
                                {editingTask?.id === task.id ? (
                                    <button onClick={handleUpdate} className="btn btn-success me-1">Save</button>
                                ) : (
                                    <button onClick={() => handleEdit(task)}
                                            className="btn btn-primary me-1">Edit</button>
                                )}
                                <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
