import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { User, Mail, Lock, Loader } from "react-feather";
import PasswordStrengthMeter from "../components/PasswordStrenthMeter";
import { signup } from "../features/auth/authSlice";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/verify-email");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      // Display server error
      setErrors({ server: error });
    }
  }, [error]);

  const validateFields = () => {
    let fieldErrors = {};
    if (!name.trim()) {
      fieldErrors.name = "Full Name is required.";
    }
    if (!email.trim()) {
      fieldErrors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      fieldErrors.email = "Email Address is invalid.";
    }
    if (!password.trim()) {
      fieldErrors.password = "Password is required.";
    } else if (password.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (validateFields()) {
      dispatch(signup({ name, email, password }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-5 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          {/* Password strength indicator */}
          <PasswordStrengthMeter password={password} />

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
        {errors.server && <p className="text-red-500 mt-2">{errors.server}</p>}
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
