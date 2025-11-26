db = db.getSiblingDB('testme');
db.createUser({
  user: 'testuser',
  pwd: 'testpassword',
  roles: [{ role: 'readWrite', db: 'testme' }]
});
