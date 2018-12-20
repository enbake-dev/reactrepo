export function authHeader() {
    // return authorization header with basic auth credentials
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { 'Authorization': 'JWT ' + user.token, 'Content-type' : 'application/json' };
    } else {
        return {};
    }
}