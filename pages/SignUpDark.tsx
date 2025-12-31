import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUpDark: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-black font-sans text-white">
            {/* 
        LEFT COLUMN (Branding) 
        - Gradient background
        - Centralized content
        - Steps component
      */}
            <div className="hidden lg:flex w-1/2 flex-col items-center justify-center relative p-12 bg-gradient-to-b from-[#7c3aed] via-[#4c1d95] to-black">
                <div className="max-w-md w-full space-y-12 z-10">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            {/* Simple circular logo icon placeholder */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">OnlyPipe</span>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white leading-tight">Get Started with Us</h1>
                        <p className="text-gray-300 text-lg">Complete these easy steps to register your account.</p>
                    </div>

                    {/* Steps Component */}
                    <div className="space-y-4">
                        {/* Step 1: Active */}
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-lg transform translate-x-4 transition-all">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">1</div>
                            <div className="flex flex-col">
                                <span className="font-bold text-black">Sign up your account</span>
                                <span className="text-xs text-gray-500">Enter your personal details</span>
                            </div>
                        </div>

                        {/* Step 2: Inactive */}
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 opacity-70">
                            <div className="w-8 h-8 rounded-full bg-white/10 text-gray-400 flex items-center justify-center font-bold text-sm">2</div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-300">Work Portfolio</span>
                                <span className="text-xs text-gray-500">Setup your content profile</span>
                            </div>
                        </div>

                        {/* Step 3: Inactive */}
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 opacity-70">
                            <div className="w-8 h-8 rounded-full bg-white/10 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-300">Payment Method</span>
                                <span className="text-xs text-gray-500">Add your bank account</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 
        RIGHT COLUMN (Form) 
        - Black background
        - Social Login
        - Main Form
      */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 bg-black relative">
                <div className="max-w-md w-full mx-auto space-y-8">

                    {/* Header */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">Sign Up Account</h2>
                        <p className="text-gray-400">Enter your personal data to create your account.</p>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors text-white text-sm font-medium">
                            {/* Google Icon */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors text-white text-sm font-medium">
                            {/* Github Icon */}
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            Github
                        </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="h-px bg-zinc-800 flex-1" />
                        OR
                        <div className="h-px bg-zinc-800 flex-1" />
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-400">First Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Robert"
                                    className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-400">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Fox"
                                    className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-400">Email</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-400">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                >
                                    {showPassword ? (
                                        /* Eye Off Icon */
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        /* Eye Icon */
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="button" className="w-full h-12 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg">
                                Create Account
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="text-white hover:underline font-bold">Log in</Link>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-6 left-0 w-full text-center text-xs text-zinc-700">
                    &copy; 2024 OnlyPipe. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default SignUpDark;
