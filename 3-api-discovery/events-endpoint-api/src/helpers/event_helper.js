import {
    UserInputError,
    NotFoundError
} from '../errors.js'
import {ZipkinFetch as fetch} from '../zipkin.js';


const PIPE_SYMBOL = "|"

const setIdList = (value) => {
    let query = {};
    if (!value) return query;

    query.bid = {
        $in: []
    };
    value.split(PIPE_SYMBOL).forEach((bid) => {
        query.bid.$in.push(bid);
    });

    return query;
}

const setTags = (value) => {
    let query = {};
    if (!value) return query;

    query['type.tags'] = {
        $in: []
    };
    value.split(PIPE_SYMBOL).forEach((bid) => {
        query['type.tags'].$in.push(bid);
    });

    return query;
}

const setStartsAfter = (value) => {
    let query = {};
    if (!value) return query;

    value = (new Date(value)).toISOString();
    query['schedule.start'] = {
        $gt: value
    };

    return query;
}

const setEndsBy = (value) => {
    let query = {};
    if (!value) return query;

    value = (new Date(value)).toISOString();
    query['schedule.end'] = {
        $lt: value
    };

    return query;
}

const setGeofence = async (value) => {

    let query = {};
    if (!value) return query;

    let geoStore = process.env.MOTI_API_GEOSTORE_HOST;
    if (!geoStore) throw new NotFoundError("Geofence service not available");

    let geofenceResponse = await fetch(`http://${geoStore}/geofence/${value}`);//await Geofence.findById(value).lean(true).exec()
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

    let searchQuery = {
        "type.active": true
    }

    let qList = await Promise.all(
        Object.entries(requestQuery).map(async ([key, value]) => {
            switch (key) {
                case 'id_list':
                    return setIdList(value);
                case 'tags':
                    return setTags(value);
                case "starts_after":
                    return setStartsAfter(value);
                case "ends_before":
                    return setEndsBy(value);
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