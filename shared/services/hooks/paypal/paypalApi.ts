let baseUrl = 'https://api-m.sandbox.paypal.com';
const base64 = require('base-64');

let clientId = 'AcdrEjQmBk5QFpFja7nFW95FypeESknyKys_A2qmH3qv38-2NTEaCBgcb1DmvjC5OdALY36dWNd0ZPRQ';
let secretKey = 'EB7fmUwGKJTuOGvv0WB8rx1_xnli2BCsLYHxN1JiU8SzVT1HMjpeNG0w0rwHzFjwaASBuI4eXnu7jHgA';


let orderDetail = {
    "intent": "CAPTURE",
    "purchase_units": [
        {
            "items": [
                {
                    "name": "T-Shirt",
                    "description": "Green XL",
                    "quantity": "1",
                    "unit_amount": {
                        "currency_code": "EUR",
                        "value": "0.01"
                    }
                }
            ],
            "amount": {
                "currency_code": "EUR",
                "value": "0.01",
                "breakdown": {
                    "item_total": {
                        "currency_code": "EUR",
                        "value": "0.01"
                    }
                }
            }
        }
    ],
    "application_context": {
        "locale": "es-ES",
        "return_url": "https://example.com/return",
        "cancel_url": "https://example.com/cancel"
    }
}


const generateToken = (): Promise<string> => {
    var headers = new Headers()
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic " + base64.encode(`${clientId}:${secretKey}`));

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials',
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v1/oauth2/token', requestOptions).then(response => response.text()).then(result => {
            console.log("result print", result)
            const { access_token } = JSON.parse(result)
            resolve(access_token)
        }).catch(error => {
            console.log("error raised", error)
            reject(error)
        })
    })
}

const createOrder = (token = ''): Promise<any> => {
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify(orderDetail)
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v2/checkout/orders', requestOptions).then(response => response.text()).then(result => {
            console.log("result print", result)
            const res = JSON.parse(result)
            resolve(res)
        }).catch(error => {
            console.log("error raised", error)
            reject(error)
        })
    })
}

const capturePayment = (id: string, token = '') => {
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + `/v2/checkout/orders/${id}/capture`, requestOptions).then(response => response.text()).then(result => {
            console.log("result print", result)
            const res = JSON.parse(result)
            resolve(res)
        }).catch(error => {
            console.log("error raised", error)
            reject(error)
        })
    })
}







export default {
    generateToken,
    createOrder,
    capturePayment
}