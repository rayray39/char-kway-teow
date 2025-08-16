
function isAuthenticated(): boolean {
    const token = localStorage.getItem('charkwayteow_jwtToken');
    return !!token;
}

export default isAuthenticated