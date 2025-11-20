// Guardar usuario en localStorage
export const saveUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
};

// Obtener usuario del localStorage
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Verificar si está autenticado
export const isAuthenticated = () => {
    return getUser() !== null;
};

// Verificar si es admin
export const isAdmin = () => {
    const user = getUser();
    return user && user.role === 'ADMIN';
};

// Cerrar sesión
export const logout = () => {
    localStorage.removeItem('user');
};

// Obtener ID del usuario actual
export const getUserId = () => {
    const user = getUser();
    return user ? user.id_usuario : null;
};
