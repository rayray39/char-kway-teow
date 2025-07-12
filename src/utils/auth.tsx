
function isAuthenticated(): boolean {
    const token = localStorage.getItem('jwtToken');
    return !!token;
}

export default isAuthenticated