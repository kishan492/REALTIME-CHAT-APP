import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();
  
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validateForm = () => {
    //if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();

    if (success === true) login(formData);
  };
  console.log("Document cookies:", document.cookie); // Debugging
  return (
    <div className="min-h-screen mt-7 grid lg:grid-cols-2">
      {/* Left Section */}
      <div className="flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center bg-gray-900 text-purple-500 text-4xl font-bold mb-1 rounded-3xl w-12 h-10 mx-auto">
              <MessageSquare className="fas fa-box   " />
            </div>
            <h2 className="text-2xl text-white font-semibold">
              Create Account
            </h2>
            <p className="text-gray-400">Get started with your free account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 ">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="input input-bordered w-full bg-gray-700 text-gray-200"
              />
            </div>

            {/* Password */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text text-gray-300">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="input input-bordered w-full bg-gray-700 text-gray-200"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </button>
            </div>

            {/* login Button */}
            <button
              type="submit"
              className="btn btn-primary w-full bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Logging...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-base-centent/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-purple-500 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="sign in to continue your conversations and catch up with your messages."
      />
    </div>
  );
};

export default LoginPage;
