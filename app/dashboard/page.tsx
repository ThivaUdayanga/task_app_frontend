"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { myAppHook } from '@/context/AppProvider';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface ProductType {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    files: File | null;
    bannerUrl: string | null;
    status: 'ongoing' | 'completed';
}

const Dashboard: React.FC = () => {
    const { isLoading, authToken } = myAppHook();
    const router = useRouter();
    const fileRef = React.useRef<HTMLInputElement>(null);

    const [tasks, setTasks] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

    const [formData, setFormData] = useState<ProductType>({
        title: "",
        description: "",
        startDate: "",
        dueDate: "",
        files: null,
        bannerUrl: null,
        status: "ongoing"
    });

    useEffect(() => {
        if (!authToken) {
            router.push("/auth");
            return;
        }
        fetchTasks();
    }, [authToken]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setTasks(response.data.tasks);
        } catch (error) {
            console.log("Error fetching tasks:", error);
            toast.error("Failed to fetch tasks");
        }
    };

    const handleOnChangeEvent = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (event.target instanceof HTMLInputElement && event.target.files) {
            // File upload handling
            setFormData({
                ...formData,
                files: event.target.files[0],
                bannerUrl: URL.createObjectURL(event.target.files[0])
            });
        } else {
            // Text inputs and select dropdown
            setFormData({
                ...formData,
                [event.target.name]: event.target.value
            });
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('start_date', formData.startDate);
        formDataToSend.append('due_date', formData.dueDate);
        formDataToSend.append('status', formData.status);

        if (formData.files) {
            formDataToSend.append('file_url', formData.files);
        }

        try {
            if (isEditing && editingTaskId) {
                // UPDATE EXISTING TASK
                formDataToSend.append('_method', 'PUT');
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${editingTaskId}`,
                    formDataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                toast.success('Task updated successfully!');
                setIsEditing(false);
                setEditingTaskId(null);
            } else {
                // CREATE NEW TASK
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
                    formDataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                toast.success('Task added successfully!');
            }

            // RESET FORM
            setFormData({
                title: "",
                description: "",
                startDate: "",
                dueDate: "",
                files: null,
                bannerUrl: null,
                status: "ongoing"
            });

            if (fileRef.current) {
                fileRef.current.value = '';
            }

            // REFRESH TASK LIST
            fetchTasks();
            
        } catch (error) {
            console.log("Error while saving task:", error);
            toast.error('Failed to save task');
        }
    };

    const handleEdit = (task: any) => {
        // POPULATE FORM WITH TASK DATA
        setFormData({
            title: task.title,
            description: task.description,
            startDate: task.start_date,
            dueDate: task.due_date,
            files: null,
            bannerUrl: task.file_url ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${task.file_url}` : null,
            status: task.status
        });
        
        setIsEditing(true);
        setEditingTaskId(task.id);
        
        // SCROLL TO FORM
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (taskId: number) => {
        // SHOW CONFIRMATION DIALOG
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                
                toast.success('Task deleted successfully!');
                fetchTasks();
                
                Swal.fire(
                    'Deleted!',
                    'Your task has been deleted.',
                    'success'
                );
            } catch (error) {
                console.log("Error deleting task:", error);
                toast.error('Failed to delete task');
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingTaskId(null);
        setFormData({
            title: "",
            description: "",
            startDate: "",
            dueDate: "",
            files: null,
            bannerUrl: null,
            status: "ongoing"
        });
        if (fileRef.current) {
            fileRef.current.value = '';
        }
    };

    return (
        <>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <h4>{isEditing ? 'Edit Task' : 'Add Task'}</h4>
                            <form onSubmit={handleFormSubmit}>
                                <input
                                    className="form-control mb-2"
                                    name="title"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={handleOnChangeEvent}
                                    required
                                />
                                <input
                                    className="form-control mb-2"
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleOnChangeEvent}
                                    required
                                />
                                <input
                                    className="form-control mb-2"
                                    name="startDate"
                                    placeholder="Start Date"
                                    value={formData.startDate}
                                    onChange={handleOnChangeEvent}
                                    type="date"
                                    required
                                />
                                <input
                                    className="form-control mb-2"
                                    name="dueDate"
                                    placeholder="Due Date"
                                    value={formData.dueDate}
                                    onChange={handleOnChangeEvent}
                                    type="date"
                                    required
                                />
                                <div className="mb-2">
                                    {formData.bannerUrl ? (
                                        <Image
                                            src={formData.bannerUrl}
                                            alt="Preview"
                                            id="bannerPreview"
                                            width={100}
                                            height={100}
                                            style={{ display: "block" }}
                                        />
                                    ) : null}
                                </div>
                                <input
                                    className="form-control mb-2"
                                    type="file"
                                    ref={fileRef}
                                    onChange={handleOnChangeEvent}
                                    id="bannerInput"
                                />
                                <select
                                    className="form-control mb-2"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleOnChangeEvent}
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                                
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary" type="submit">
                                        {isEditing ? 'Update Task' : 'Add Task'}
                                    </button>
                                    {isEditing && (
                                        <button 
                                            className="btn btn-secondary" 
                                            type="button"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Start date</th>
                                        <th>Due date</th>
                                        <th>Files</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center">
                                                No tasks found. Add your first task!
                                            </td>
                                        </tr>
                                    ) : (
                                        tasks.map((task, index) => (
                                            <tr key={task.id}>
                                                <td>{index + 1}</td>
                                                <td>{task.title}</td>
                                                <td>{task.description}</td>
                                                <td>{task.start_date}</td>
                                                <td>{task.due_date}</td>
                                                <td>
                                                    {task.file_url ? (
                                                        <a 
                                                            href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${task.file_url}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-info"
                                                        >
                                                            View File
                                                        </a>
                                                    ) : (
                                                        'No file'
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge ${task.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => handleEdit(task)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(task.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;