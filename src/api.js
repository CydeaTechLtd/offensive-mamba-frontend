import Config from './config'
var base = Config.api_url
var vulnersBase = Config.vulners_api_url
var defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("userToken")
}
var API = {

    call: async (route, method, auth=false, headers={'Content-Type': 'application/json'}, body={}) => {
        var requestHeaders = headers
        requestHeaders['Content-Type'] = defaultHeaders["Content-Type"]
        if(auth && !localStorage.getItem("userToken")) {
                return {'success': false, 'message': "You are not logged in."}
        }
        else {
            requestHeaders['Authorization'] =defaultHeaders.Authorization
        }
        var response = await fetch(base + route, {
            method: method,
            cache: 'no-cache',
            mode: 'cors',
            headers: requestHeaders,
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(body)
        })
        var responseJSON = await response.json()
        console.log("API REQUEST RESPONSE " + route + " " + JSON.stringify(responseJSON)); // DEBUG INFO
        return responseJSON
    },
    checkLoggedIn: async () => {
        if (localStorage.getItem("userToken")) {
            var responseJSON = await API.call("verifytoken", 'POST', true)
            var loggedIn = responseJSON.success
            return loggedIn
        }
        return false
    },

    getUserInfo: async () => {
        var response =  await API.call("user/", "POST", true)
        if(response.success) {
            return response.data
        } else {
            return null
        }
    },

    updateUserInfo: async (firstname, lastname, companyname) => {
        var response = await API.call("user/updateinfo", "POST", true, {}, {firstname: firstname, lastname: lastname, companyname: companyname})
        return response
    },

    updatePass: async (newpass, confirmpass) => {
        if(newpass !== confirmpass) {
            return {'success': false, 'error': 'Passwords do not match.'}
        } else {
            var response = await API.call("user/changepassword", "POST", true, {}, {newpassword: newpass})
            return response
        }
    },

    getAllLocalSystems: async () => {
        var response = await API.call("agent/", "POST", true)
        return response
    },

    addLocalSystem: async (ipaddress) => {
        var response = await API.call("agent/addlocalsystem", 'POST', true, {}, {localip: ipaddress})
        return response
    },
    removeLocalSystem: async (ipaddress) => {
        var response = await API.call("agent/deletelocalsystem", 'POST', true, {}, {localip: ipaddress})
        return response
    },
    getLocalSystemStatus: async (ipaddress) => {
        var response = await API.call("agent/getsystemstatus", "POST", true, {}, {localip: ipaddress})
        return response
    },

    getLatestExploitationData: async (ipaddress) => {
        var response = await API.call("agent/latestexploitlogs", "POST", true, {}, {localip: ipaddress})
        return response
    },

    getLatestPostExploitationData: async (ipaddress) => {
        var response = await API.call("agent/latestpostexploitlogs", "POST", true, {}, {localip: ipaddress})
        console.log(response)
        return response
    },

    login: async (username, password) => {
        var response = await API.call("login/", "POST", false, {}, {username: username, password: password})
        return response
    },
    signup: async (firstname, lastname, username, email, password, companyname) => {
        var body = {
            firstname: firstname,
            lastname: lastname,
            companyname: companyname,
            emailaddress: email,
            password: password,
            username: username
        }
        var response = await API.call("signup/", "POST", false, {}, body)
        return response
    },

    regex: {
        "firstname": /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,}{[\]}]{2,20}$/,
        // eslint-disable-next-line
        "lastname": /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,\}\{\[\]]{2,20}$/,
        // eslint-disable-next-line
        "companyname": /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,\}\{\[\]]{2,64}$/,
        // eslint-disable-next-line
        "password": /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "emailaddress": /(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/,
        "username": /^[a-zA-Z0-9_.]{4,32}/
    },
    verifyemail: async (code) => {
        var response = await API.call("user/verifyemail", "POST", true, {}, {code: code})
        return response
    },
    searchVulnersByID: async (id) => {
        var response = await API.call("exploit/searchVulnersByID", "POST", true, {}, {resId: id})
        return response
    },

    vulners: {
        searchByID: async (id) => {
            var response = await API.vulners.call("search/id/", {id: id})
            return response
        },
        call: async (route, body={}) => {
            console.log("API Key: " + Config.vulners_api_key)
            body.apiKey = Config.vulners_api_key
            console.log("Request Body: " + JSON.stringify(body))
            var response = await fetch(vulnersBase + route, {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            var responseJSON = await response.json()
            console.log("API REQUEST RESPONSE " + vulnersBase + route + " " + JSON.stringify(responseJSON)); // DEBUG INFO
            return responseJSON
        }
    }
}

export default API