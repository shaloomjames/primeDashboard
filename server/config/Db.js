    const mongoose = require("mongoose");


    const ConnectDB = async()=>{
        try {
            const conn = await mongoose.connect(process.env.MongoDB_Connection_String);
            console.log(`server is connected to ${conn.connection.db.databaseName} database`)
        } catch (error) {
            console.log(`Db Connection Error ${error}`)
        }
    }

    module.exports = ConnectDB;