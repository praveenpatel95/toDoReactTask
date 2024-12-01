import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createTask} from '../../utlis/api.ts';
import {useState} from 'react';

const AddTask = () => {
    const [title, setTitle] = useState('');
    const [validationError, setValidationError] = useState('');
    const [description, setDescription] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || title.length < 3) {
            setValidationError('Title must be at least 3 characters long.')
            return;
        }

        if (!description.trim() || description.length < 10) {
            setValidationError('Description must be at least 10 characters long.')
            return;
        }

        mutation.mutate({title: title.trim(), description: description.trim()});
        // Reset input fields
        setTitle('');
        setDescription('');
        setValidationError('')

    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-4">
                <div className="col-md-5">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task Title"
                        className="form-control"
                    />
                </div>
                <div className="col-md-5">
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="form-control"
                    />
                </div>
                <div className="col-md-2">
                    <button type="submit" className="btn btn-success">Add</button>
                </div>
                <div className="col-12">
                    <p className="text-danger">{validationError}</p>
                </div>
            </div>


        </form>
    );
};

export default AddTask;
