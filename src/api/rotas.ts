const API_ROOT = "http://192.168.0.95:8000/api"

const router = {
    PREFIX_TOKEN: 'Token ',
    auth: {
        login: API_ROOT + '/auth/',
        logout: API_ROOT + '/out/'
    },
    statuses: API_ROOT + "/statuses/",
    negotiations: API_ROOT + '/negotiations/',
    companies: API_ROOT + '/companies/',
    classifications: API_ROOT + '/classifications/',
    shirtTypes: API_ROOT + '/shirt-types/'
}

export default router