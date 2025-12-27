import { useState } from 'react';
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
function Register() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword){
      alert("Las Contraseñas no Coinciden");
      return;
    }

    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/*Mensaje de Registro */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🎮 Crear Cuenta</h1>
          <p className="text-grey-600 mt-2">únete a la comunidad</p>
        </div>

        {/**Formulario de Registro */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/**Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario
            </label>
            <input 
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500 focus:border-transparent"
              placeholder="usuario123" required />
          </div>

          {/**Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input 
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500 focus:border-transparent"
              placeholder="ejemplo@email.com" required />
          </div>

          {/**Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input 
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••" required />
          </div>

          {/**Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input 
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••" required />
          </div>

          {/**Botón Submit */}
          <button 
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200 font-medium "
            >
              Crear Cuenta
          </button>

          {/**Link a Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-800 hover:underline font-medium">Inicia sesión</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;