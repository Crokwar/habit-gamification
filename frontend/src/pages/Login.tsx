import { useState } from 'react'
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/*interface LoginFormData {
  email: string;
  password: string;
}*/

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  /*const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });*/

  /*const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }*/

  // funcion asincrona para el login - llamado al hook de auth
  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-xl p-8'>
        {/*Titulo Inicial*/}
        <div className="text-center mb-8">
          <h1 className='text-3xl font-bold text-gray-800'>🎮 Habit Gamification</h1>
          <p className='text-gray-600 mt-2'>Inicia sesión para continuar</p>
        </div>

        {/*Formulario de Login */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/*Email */}
          <div>
            <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
              Email
            </label>
            <input 
              type="email"
              id='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@email.com"
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-transparent'/>
          </div>

          {/*Contraseña */}
          <div>
            <label htmlFor="password" className='block text-sm font-medium txt-gray-700 mb-2'>
              Contraseña
            </label>
            <input 
              type="password"
              id='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-transparent'/>

          </div>

          {/*Botón de Inicio de Sesión */}
          <button 
            type="submit"
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium'>Iniciar Sesión</button>
        </form>

        {/*Parte del Registro */}
        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className='text-blue-600 hover:text-blue-800 hover:underline font-medium'>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;