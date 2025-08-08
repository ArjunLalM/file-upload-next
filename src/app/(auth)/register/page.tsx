"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { TextField } from "@mui/material";
import { Users } from "@/types/UserTypes";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dateOfBirth: yup.date().required("Date of birth is required"),
  gender: yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Min 8 characters")
    .matches(/[A-Z]/, "1 uppercase required")
    .matches(/[a-z]/, "1 lowercase required")
    .matches(/[0-9]/, "1 number required")
    .matches(/[@$!%*?&]/, "1 special char required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/home"); 
    }
  }, [router]);
  const onSubmit = async (data: Users) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signup`,
        data
      );
      toast.success("Registration successful! Redirecting...");
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);

      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch  {
      toast.error(
        toast.error("Login failed. Please check your details and try again.")
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
              Create a new account
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First & Last Name */}
            <div className="flex space-x-4">
              <TextField
                label="First Name"
                fullWidth
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <TextField
                label="Last Name"
                fullWidth
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </div>

            {/* DOB */}
            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("dateOfBirth")}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth?.message}
            />

            {/* Gender */}
            <div className="flex space-x-6 mt-2">
              <label className="text-sm text-gray-700">
                <input type="radio" value="Male" {...register("gender")} />
                <span className="ml-2">Male</span>
              </label>
              <label className="text-sm text-gray-700">
                <input type="radio" value="Female" {...register("gender")} />
                <span className="ml-2">Female</span>
              </label>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}

            {/* Phone */}
            <div className="mt-5">
            <TextField
              label="Phone Number"
              fullWidth
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
            </div>
            {/* Email */}
            <div className="mt-5">
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            </div>
            {/* Password */}
            <div className="relative">
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-2 text-sm text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                {...register("passwordConfirm")}
                error={!!errors.passwordConfirm}
                helperText={errors.passwordConfirm?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-2 text-sm text-gray-600"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-indigo-500"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
