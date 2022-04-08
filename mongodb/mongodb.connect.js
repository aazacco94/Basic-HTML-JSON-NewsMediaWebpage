const mongoose = require("mongoose");

async function connect(){
  try{
    await mongoose.connect(
      "mongodb+srv://AlexAdmin:ZacMongo15@clusteraz.ocuif.mongodb.net/SER421_Lab4",
      { useNewUrlParser:true }
    );
  }catch(err){
    console.error("Error connecting to mongodb");
    console.error(err);
  }
}

module.exports = { connect };