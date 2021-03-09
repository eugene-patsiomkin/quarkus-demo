import {
    UserInputError,
    NotFoundError
} from '../errors.js'
import {ZipkinFetch as fetch} from '../zipkin.js';


const PIPE_SYMBOL = "|"

const setNameList = (value) => {
    let query = {};
    if (!value) return query;

    query.name = {
        $in: []
    };
    value.split(PIPE_SYMBOL).forEach((name) => {
        query.name.$in.push(name);
    });

    return query;
}

const setGeofence = async (value) => {

    let query = {};
    if (!value) return query;

    let geoStore = process.env.MOTI_API_GEOSTORE_HOST;
    if (!geoStore) throw new NotFoundError("Geofence service not available");

    let geofenceResponse = await fetch(`http://${geoStore}/geofence/${value}`);
    if (!geofenceResponse.ok)  throw new NotFoundError("Geofence not found");

    let geofence = await geofenceResponse.json();
    query['geometry'] = {$geoWithin: {
        $geometry: geofence.geometry
    }};

    return query;
}

const query_builder = async (requestQuery) => {
    if (requestQuery.geometry && requestQuery.geofence)
        throw new UserInputError("Can use either geometry or geofence not both");

    let searchQuery = {};
    let qList = await Promise.all(
        Object.entries(requestQuery).map(async ([key, value]) => {
            switch (key) {
                case 'name_list':
                    return setNameList(value);
                case "geofence":
                    return await setGeofence(value);
                default:
                    break;
            }
        })
    );

    qList.forEach(obj => {
       searchQuery = {...searchQuery, ...obj}; 
    });

    
    if (requestQuery['include_nonactive'] && requestQuery['include_nonactive'].toLowerCase() === "true")
        delete searchQuery["type.active"];
    
    return searchQuery;
};

export {
    query_builder
};