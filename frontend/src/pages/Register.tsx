import { Link, useNavigate } from "react-router-dom";
import { useRegisterForm } from '@/hooks/useRegisterForm';

function Register() {

  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    usernameStatus,
    emailStatus,
    canSubmit,
    handleRegister,
    isSubmitting
  } = useRegisterForm();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = await handleRegister();
    
    if (result.success) {
      // Registro exitoso
      navigate('/dashboard');
    } else {
      // Error en el registro (ya se muestran los errores en los campos)
      console.error('Error en registro:', result.error);
    }
  };

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
              value={values.username}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500 focus:border-transparent"
              placeholder="usuario123"/>
            {/* Mostrar estado de verificación */}
            {usernameStatus === 'checking' && (
              <p className="text-sm text-blue-600 mt-1">🔍 Verificando disponibilidad...</p>
            )}
            {usernameStatus === 'available' && (
              <p className="text-sm text-green-600 mt-1">✅ Usuario disponible</p>
            )}
            {usernameStatus === 'taken' && (
              <p className="text-sm text-red-600 mt-1">❌ Usuario no disponible</p>
            )}

            {/* Mostrar error de validación */}
            {touched.username && errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username}</p>
            )}
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
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500 focus:border-transparent"
              placeholder="ejemplo@email.com"/>
              {/* Mostrar estado de verificación */}
              {emailStatus === 'checking' && (
                <p className="text-sm text-blue-600 mt-1">🔍 Verificando disponibilidad...</p>
              )}
              {emailStatus === 'available' && (
                <p className="text-sm text-green-600 mt-1">✅ Email disponible</p>
              )}
              {emailStatus === 'taken' && (
                <p className="text-sm text-red-600 mt-1">❌ Email ya registrado</p>
              )}
              {/* Mostrar error de validación */}
              {touched.email && errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}   
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
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"/>
            {/* Mostrar error de validación */}
            {touched.password && errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
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
              value={values.confirmPassword}
              onBlur={handleBlur}
              onChange={handleChange}
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"/>
            {/* Mostrar error de validación */}
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
            )}              
          </div>

          {/**Botón Submit */}
          <button 
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`w-full py-2 px-4 rounded-lg transition duration-200 font-medium ${
              !canSubmit || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
            >
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
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