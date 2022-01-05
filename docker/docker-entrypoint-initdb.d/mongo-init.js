db = db.getSiblingDB('app');
db.auth('admin', 'admin');
db.createUser({
    user: 'app',
    pwd: 'app',
    roles: [
        {role: 'readWrite', db: 'app'},
        {role: 'dbAdmin', db: 'app'},
    ],
});
