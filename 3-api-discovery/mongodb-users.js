event_db = db.getSiblingDB('event-db');
profile_db = db.getSiblingDB('profile-db');
images_db = db.getSiblingDB('images-db');
geostore_db = db.getSiblingDB('geostore-db');

event_db.createUser({
    user: "event-api",
    pwd: "event-api",
    roles: [{
        role: "readWrite",
        db: "event-db"
    }]
});

profile_db.createUser({
    user: "profile-api",
    pwd: "profile-api",
    roles: [{
        role: "readWrite",
        db: "profile-db"
    }]
});

images_db.createUser({
    user: "images-api",
    pwd: "images-api",
    roles: [{
        role: "readWrite",
        db: "images-db"
    }]
});

geostore_db.createUser({
    user: "geostore-api",
    pwd: "geostore-api",
    roles: [{
        role: "readWrite",
        db: "geostore-db"
    }]
});



admin_db = db.getSiblingDB('admin');
admin_db.createUser(
    {
        user: "beats",
        pwd: "pass",
        roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase", "clusterAdmin"]
    }
);