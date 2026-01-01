"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { myAppHook } from '@/context/AppProvider';
import { useRouter } from 'next/navigation';

interface ProductType {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    files: File | null;
    bannerUrl: string | null; // Change to null for initial state
    status: 'ongoing' | 'completed';
}

const Dashboard: React.FC = () => {
    const { isLoading, authToken } = myAppHook();
    const router = useRouter();
    const fileRef = React.useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ProductType>({
        title: "",
        description: "",
        startDate: "",
        dueDate: "",
        files: null,
        bannerUrl: null, // Initialize with null
        status: "ongoing"
    });

    useEffect(() => {
        if (!authToken) {
            router.push("/auth");
            return;
        }
    }, [authToken]);

    const handleOnChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            // If file uploaded
            setFormData({
                ...formData,
                files: event.target.files[0],
                bannerUrl: URL.createObjectURL(event.target.files[0]) // Create object URL for preview
            });
        } else {
            // Update other form fields
            setFormData({
                ...formData,
                [event.target.name]: event.target.value
            });
        }
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(" Data Added successfully",formData);
    };

    return (
        <>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <h4>Add Task</h4>
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
                                    name="startDate" // Corrected to match state
                                    placeholder="Start Date"
                                    value={formData.startDate}
                                    onChange={handleOnChangeEvent}
                                    type="date"
                                    required
                                />
                                <input
                                    className="form-control mb-2"
                                    name="dueDate" // Corrected to match state
                                    placeholder="Due Date"
                                    value={formData.dueDate}
                                    onChange={handleOnChangeEvent}
                                    type="date"
                                    required
                                />
                                <div className="mb-2">
                                    {/* Conditionally render Image if bannerUrl is valid */}
                                    {formData.bannerUrl ? (
                                        <Image
                                            src={formData.bannerUrl} // Use the object URL here
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
                                    value={formData.status} // Bind to state
                                    onChange={handleOnChangeEvent}
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button className="btn btn-primary" type="submit">
                                    Add Task
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-6">
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
                                <tr>
                                    <td>1</td>
                                    <td>Sample Task</td>
                                    <td>Sample Description</td>
                                    <td>Sample Date</td>
                                    <td>Sample Date</td>
                                    <td>
                                        {/* Placeholder for the file preview */}
                                    </td>
                                    <td>Ongoing</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2">Edit</button>
                                        <button className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;