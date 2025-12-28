"use client";
import React, { useState } from 'react';

interface formData{
    name?: string;
    email: string;
    password: string;
    password_confirmation?: string;
}

const Auth: React.FC = () => {

    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [form, setForm] = useState<formData>({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [event?.target.name]: event.target.value
        })
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();

        if(isLogin){
            alert('Login Submitted')
        } else {
            alert('Register Submitted')
        }
    }

    return(
        <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4" style={{width: "400px"}}>
                    <h3 className="text-center">{isLogin ? "Login" : "Register"}</h3>
                    <form onSubmit={ handleFormSubmit }>
                        {
                            !isLogin && (<input 
                                className="form-control mb-2" 
                                name="name" 
                                type="text" 
                                value={form.name}
                                onChange={handleOnChangeInput}
                                placeholder="Name" 
                                required
                            />)
                        }
                        
                        <input 
                            className="form-control mb-2" 
                            name="email" 
                            type="email"
                            value={form.email}
                            onChange={handleOnChangeInput} 
                            placeholder="Email" 
                            required
                        />
                        <input 
                            className="form-control mb-2" 
                            name="password" 
                            type="password"
                            value={form.password}
                            onChange={handleOnChangeInput} 
                            placeholder="Password" 
                            required
                        />
                        {
                            !isLogin && (<input 
                                className="form-control mb-2" 
                                name="password_confirmation" 
                                type="password"
                                value={form.password_confirmation}
                                onChange={handleOnChangeInput} 
                                placeholder="Confirm Password" 
                                required
                            />)
                        }
                        

                        <button className="btn btn-primary w-100" type="submit">{isLogin ? "Login" : "Register"}</button>
                    </form>

                    <p className="mt-3 text-center">
                        {isLogin ? "Don't have an account?" : "Already I have an account?"}
                        <span onClick={()=> setIsLogin(!isLogin)} style={{cursor: "pointer"}}>
                            {
                                isLogin ? " Register" : " Login"
                            }
                        </span>
                    </p>
                </div>
            </div>
        </>
    )
};

export default Auth;