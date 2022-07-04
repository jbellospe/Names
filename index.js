const Database = require('./Database')
const mongoose = require('mongoose');
const querys = require('./Query');
const fs = require('fs');

const ObjectId = (id) => {
    return mongoose.Types.ObjectId(id)
}

const update = async (collection, filter, set) => {
    try {
        set.$set.updated = new Date();
        let mongoClient = await Database;
        let result = await mongoClient.db('vw').collection(collection).updateOne(filter, set);
        return result;
    }
    catch(err) {
        return err;
    }
}

const find = async (collection, filter) => {
    try {
        let data = await Database;
        let org = await data.db("vw").collection(collection).find(filter);
        org = await org.toArray();
        return org;
    }
    catch(err) {
        return err;
    }
}


async function main() {

    let array = [
        ...querys.ZONA_TIJUANA,
        ...querys.ZONA_BAJA_CALIFORNIA_SUR,
        ...querys.ZONA_ENSENADA,
        ...querys.ZONA_JALISCO_NAYARIT,
        ...querys.ZONA_MEXICALI,
        ...querys.ZONA_SONORA,
        ...querys.ZONA_SINALOA,
    ]
    let arrayLenght = array.length;
    console.log(arrayLenght);
    let org = [];
    for(let i = 0; i < arrayLenght; i++)
    {
        console.log("------------------------------"+ i)
        let data = await find("Organization",{$and:[{_id:ObjectId(array[i].id)},{enterpriseId:ObjectId(array[i].idEnterprise)}]}) 
        console.log(data[0].name);
        let updated = await update("Organization", { $and:[{_id:ObjectId(array[i].id)},{enterpriseId:ObjectId(array[i].idEnterprise)}]}, {$set: {name:array[i].newName, city:array[i].newCity}})
        console.log(updated.modifiedCount);
        data = await find("Organization",{$and:[{_id:ObjectId(array[i].id)},{enterpriseId:ObjectId(array[i].idEnterprise)}]}) 
        console.log(data[0].name);
        org.push(data[0]);
        console.log("------------------------------")
    }

    fs.writeFileSync('./data/data_uat.json', JSON.stringify(org, null, 2) , 'utf-8');
}

main();