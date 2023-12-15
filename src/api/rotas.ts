const API_ROOT2 = "http://192.168.0.95:8000/api"

const router = {
    API_ROOT: "http://192.168.0.95:8000/api",
    PREFIX_TOKEN: 'Token ',
    auth: {
        login: '/auth/',
        logout: '/out/'
    },
    status: "/status/",
    negotiations: '/negotiations/',
    company: '/company/',
    classification: '/classification/',
    shirtTypes:  API_ROOT2 + '/shirt-type/'
}

export default router