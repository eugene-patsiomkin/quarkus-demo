images_db = db.getSiblingDB('images-db');

// Adding cameras.
images_db.cameras.insertMany([{
    "_id": "demo-camera-455",
    "name": "Hagensborg",
    "caption": "Hwy 20, between Bella Coola and Hagensborg, looking west.",
    "orientation": "W",
    "altitude": 42,
    "isOn": true,
    "camera_id": 455,
    "geometry": {
        "type": "Point",
        "coordinates": [
            -119.7553608490141,
            49.16535927978211,
            42
        ]
    },
    "created_on": "2020-12-18T19:04:26.437Z",
    "updated_on": "2020-12-18T19:04:26.437Z",
    "__v": 0
}, {
    "_id": "demo-camera-5",
    "name": "Kootenay Pass",
    "caption": "Hwy 3, Salmo Creston Highway Summit, looking east.",
    "orientation": "E",
    "altitude": 1781,
    "isOn": true,
    "camera_id": 5,
    "geometry": {
        "type": "Point",
        "coordinates": [
            -119.23794240210722,
            49.03861190392945,
            1781
        ]
    },
    "created_on": "2020-12-18T19:15:51.680Z",
    "updated_on": "2020-12-18T19:15:51.680Z",
    "__v": 0
}]);
delete images_db;

// Geofences
geostore_db = db.getSiblingDB('geostore-db');
geostore_db.geofences.insertMany([{
    "_id": "demo-geofence-1",
    "tags": ["HWY 3"],
    "radius": 0,
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [-121.34633457691827, 49.3307940529582],
                [-121.30057648297412, 49.25274115362171],
                [-120.80427715634917, 49.04553374481398],
                [-120.5297285926843, 49.13543002152383],
                [-120.47341093859919, 49.4201731728711],
                [-120.08974692014444, 49.31243978276305],
                [-120.04046897281997, 49.388107060496395],
                [-120.44173225817634, 49.484242583339096],
                [-120.5684469798678, 49.491102196507285],
                [-120.61420507381196, 49.3858158225529],
                [-120.69164184817897, 49.19066991572254],
                [-120.78315803606725, 49.13312702197189],
                [-121.089385280155, 49.26652417523445],
                [-121.26889780255125, 49.36518987251432],
                [-121.34633457691827, 49.3307940529582]
            ]
        ]
    },
    "description": "Route 1"
}, {
    "_id": "demo-geofence-2",
    "tags": ["HWY 3"],
    "radius": 0,
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [-119.89615498422685, 49.25044360911056],
                [-119.95951234507258, 49.199870574361256],
                [-119.76592040915506, 49.07090558612262],
                [-119.76944026253538, 49.00167914755875],
                [-119.59344759351943, 49.013223577965704],
                [-119.35409756365776, 48.99475120454957],
                [-118.94579457154074, 49.017840600710656],
                [-119.17106518788115, 49.06168096048668],
                [-119.34705785689711, 49.0478408110244],
                [-119.52657037929337, 49.10087379326964],
                [-119.67440422126676, 49.08473931376528],
                [-119.69200348816834, 49.192970240823456],
                [-119.89615498422685, 49.25044360911056]
            ]
        ]
    },
    "description": "Route 2"
}]);
delete geostore_db;

profile_db = db.getSiblingDB('profile-db');
profile_db.sches.insert({
    "_id": "demo-profile-schema",
    "name": "moti.dbc.profile.v1",
    "jsonschema": "{\r\n \"$id\": \"moti.dbc.profile.v1\",\r\n \"description\": \"profile sample\",\r\n \"type\": \"object\",\r\n \"properties\": {\r\n \"type\": {\r\n \"type\": \"string\",\r\n \"description\": \"Profile type\"\r\n },\r\n \"favorites\": {\r\n \"type\": \"object\",\r\n \"properties\" : {\r\n \"cameras\" : {\r\n \"type\": \"array\",\r\n \"items\" : {\r\n     \"type\": \"string\"\r\n },\r\n \"minItems\": 0,\r\n \"uniqueItems\": true\r\n },\r\n \"routes\" : {\r\n \"type\": \"array\",\r\n \"items\": {\r\n     \"type\": \"object\",\r\n     \"properties\": {\r\n         \"start\": {\r\n             \"type\": \"string\"\r\n         },\r\n         \"end\": {\r\n             \"type\": \"string\"\r\n         },\r\n         \"geofence_id\": {\r\n             \"type\":  \"string\"\r\n         }\r\n     },\r\n     \"required\": [\"start\", \"end\", \"geofence_id\"]\r\n },\r\n \"minItems\": 0,\r\n \"uniqueItems\": true\r\n }\r\n }\r\n }\r\n },\r\n \"required\": [\"type\", \"favorites\"]\r\n}",
    "description": "cool address validator",
    "application_key": "demo-application-key",
    "created_on": "2020-12-18T19:51:58.505Z",
    "updated_on": "2020-12-18T19:51:58.505Z",
    "__v": 0
});

profile_db.profiles.insert({
    "_id": "demo-user-profile",
    "validation_schema_name": "moti.dbc.profile.v1",
    "owner_id": "demo-user",
    "profile": "{\r\n \"type\": \"user_type\",\r\n \"favorites\": {\r\n \"cameras\" : [\"5\", \"455\"],\r\n \"routes\": [\r\n {\r\n \"start\": \"Start point text 1\",\r\n \"end\": \"End point text 1\",\r\n \"geofence_id\": \"demo-geofence-1\"\r\n },\r\n {\r\n \"start\": \"Start point text 2\",\r\n \"end\": \"End point text 2\",\r\n \"geofence_id\": \"demo-geofence-2\"\r\n }\r\n ]\r\n }\r\n}",
    "application_key": "demo-application-key",
    "created_on": "2020-12-18T21:25:35.361Z",
    "updated_on": "2020-12-18T21:25:35.361Z",
    "__v": 0
});
delete profile_db;

event_db = db.getSiblingDB('event-db');
event_db.events.insertMany([{
    "geometry": {
        "type": "Point",
        "coordinates": [-119.7553608490141, 49.16535927978211]
    },
    "_id": "demo-event-1",
    "type": {
        "tags": [
            "ROAD_MAINTENANCE",
            "CONSTRUCTION",
            "ACTIVE"
        ],
        "severity": "MINOR",
        "active": true,
        "planned": true
    },
    "schedule": [{
        "start": "2019-09-12T21:32:57.000Z",
        "end": "2020-12-18T17:34:53.000Z"
    }],
    "bid": "demo-event-1",
    "info": {
        "headline": "CONSTRUCTION",
        "description": "[Truncated] Highway 4, in both directions. Construction work between Toquart Bay Rd and Taylor River Rest Area (14 km east of Southern Boundary of Pacific Rim National Park). Until Mon Jan 4, 2021. December 18 traffic closures will be in effect from 9:00am-1:00pm and 4:00pm to 5:00pm. Saturday Dec 19th to Monday Jan 4th will have Single Lane Alternating Traffic 24/7. Effective Jan 5th the weekday 4 hour closure will move to 11:00am -3:00pm. Next update time Mon Jan 4, 2021 at 10:00 AM PST. Last ",
        "related_events": null,
        "related_urls": null
    },
    "created_on": "2020-12-18T19:15:53.303Z",
    "updated_on": "2020-12-18T19:15:53.303Z",
    "__v": 0
}, {
    "geometry": {
        "type": "Point",
        "coordinates": [-120.58604624676934, 49.18146754567715]
    },
    "_id": "demo-event-2",
    "type": {
        "tags": [
            "ROAD_MAINTENANCE",
            "CONSTRUCTION",
            "ACTIVE"
        ],
        "severity": "MINOR",
        "active": true,
        "planned": true
    },
    "schedule": [{
        "start": "2019-09-20T20:28:48.000Z",
        "end": "2020-12-07T23:30:26.000Z"
    }],
    "bid": "demo-event-2",
    "info": {
        "headline": "CONSTRUCTION",
        "description": "Highway 1 (on Vancouver Island), in both directions. Construction work between Exit 16: Leigh Rd and West Shore Pky for 1.5 km (Langford). All night work is now complete. For the next week there may be NB/SB single lane closures with 60km/h speed zones between 730AM-5PM. During work hours drivers should expect minor stoppages, traffic pattern changes and delays up to 5-10 minutes. Last updated Mon Dec 7 at 3:30 PM PST. (DBC-12020)",
        "related_events": null,
        "related_urls": null
    },
    "created_on": "2020-12-18T19:15:53.367Z",
    "updated_on": "2020-12-18T19:15:53.367Z",
    "__v": 0
}, {
    "geometry": {
        "type": "Point",
        "coordinates": [-119.25202181562851, 49.232059403440985]
    },
    "_id": "demo-event-3",
    "type": {
        "tags": [
            "HAZARD",
            "INCIDENT",
            "ACTIVE"
        ],
        "severity": "MINOR",
        "active": true,
        "planned": true
    },
    "schedule": [{
        "start": "2020-03-20T19:24:29.000Z",
        "end": "2020-12-04T23:38:41.000Z"
    }],
    "bid": "demo-event-3",
    "info": {
        "headline": "INCIDENT",
        "description": "Barnston Island Ferry. Travel advisory in effect at Barnston Island. Passengers asked to remain inside vehicles during sailings. Walk-on passengers and cyclists are limited to ensure physical distancing. Last updated Fri Dec 4 at 3:38 PM PST. (DBC-16715)",
        "related_events": null,
        "related_urls": null
    },
    "created_on": "2020-12-18T19:15:53.390Z",
    "updated_on": "2020-12-18T19:15:53.390Z",
    "__v": 0

}, {
    "geometry": {
        "type": "Point",
        "coordinates": [-119.6638446611258, 49.34455526641676]
    },
    "_id": "demo-event-4",
    "type": {
        "tags": [
            "HAZARD",
            "INCIDENT",
            "ACTIVE"
        ],
        "severity": "MINOR",
        "active": true,
        "planned": true
    },
    "schedule": [{
        "start": "2020-03-21T05:01:40.000Z",
        "end": "2020-11-27T23:08:29.000Z"
    }],
    "bid": "demo-event-4",
    "info": {
        "headline": "INCIDENT",
        "description": "56 Street, in both directions. There is a Provincial State of Emergency at Point Roberts Border crossing near Delta. Avoid non-essential traffic. Expect delays. Additional screening and checkpoints are in place. Travellers bound for Alaska must go through screening at one of 3 border crossings: Abbotsford-Huntington, Kingsgate, or Osoyoos. For more information visit GOV.BC.CA/COVID-19. Last updated Fri Nov 27 at 3:08 PM PST. (DBC-16727)",
        "related_events": null,
        "related_urls": null
    },
    "created_on": "2020-12-18T19:15:53.420Z",
    "updated_on": "2020-12-18T19:15:53.420Z",
    "__v": 0

}, {
    "geometry": {
        "type": "Point",
        "coordinates": [-119.23794240210722, 49.03861190392945]
    },
    "_id": "demo-event-5",
    "type": {
        "tags": [
            "HAZARD",
            "INCIDENT",
            "ACTIVE"
        ],
        "severity": "MINOR",
        "active": true,
        "planned": true
    },
    "schedule": [{
        "start": "2020-03-21T05:04:29.000Z",
        "end": "2020-11-27T23:08:17.000Z"
    }],
    "bid": "demo-event-5",
    "info": {
        "headline": "INCIDENT",
        "description": "Highway 99, in both directions. There is a Provincial State of Emergency at Hwy 99 Border Crossing. Avoid non-essential traffic. Expect delays. Additional screening and checkpoints are in place. Travellers bound for Alaska must go through screening at one of 3 border crossings: Abbotsford-Huntington, Kingsgate, or Osoyoos. For more information visit GOV.BC.CA/COVID-19. Last updated Fri Nov 27 at 3:08 PM PST. (DBC-16728)",
        "related_events": null,
        "related_urls": null
    },
    "created_on": "2020-12-18T19:15:53.436Z",
    "updated_on": "2020-12-18T19:15:53.436Z",
    "__v": 0

}]);

delete event_db;