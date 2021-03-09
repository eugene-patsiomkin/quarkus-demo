const serverHost = "http://localhost:8000";
const kongHost = process.env.KONG_HOST || "http://localhost:8001";
const getServiceName = (name, tags) => {
    let nm = tags.filter(val => val.includes('title~'));
    if (nm.length > 0) {
        return nm[0].replace('title~', '').replace(/_/g, ' ');
    } else {
        return name;
    }
}

const getServiceDescription = (tags) => {
    let nm = tags.filter(val => val.includes('description~'));
    if (nm.length > 0) {
        return nm[0].replace('description~', '').replace(/_/g, ' ');
    } else {
        return "N/A";
    }
}


const GetServiceObject = (data) => {
    data.tags = data.tags || [];
    const service = {
        "name" : getServiceName(data.name, data.tags),
        "service_name": data.name,
        "meta" : data.tags.join(' '),
        "description" : getServiceDescription(data.tags),
        "routes":[],
        "document_link" : serverHost,
        "get_api_key_link" : serverHost,
    }

    return service;
}

export default GetServiceObject;

export {serverHost, kongHost};