const MongoClient = require('mongodb').MongoClient;

const server = "mongodb://localhost:27017/vw";

var Database = async function(){
        try {
            let client = await MongoClient.connect(`${server}?retryWrites=true&w=majority`);
            return client;
        }
        catch(err) {
            console.error(err);
            return err;
        }
}

module.exports = Database()