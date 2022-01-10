const data = require('./data');
const mongoose = require("mongoose");
const Item = require("./models/item");
console.log(data.length);
const mongopass = process.env.PASS;
const mongouser = process.env.USERM;


const itemname = data[0].name;
  const company = data[0].company;
  const location = data[0].location;

  console.log(data[0].name);
  console.log(company);
  console.log(location);
//   // Create post in db
//   const item = new Item({
//     name: itemname,
//     company: company,
//     location: location,
//   });

//   item.save();
    
   





// mongoose
//   .connect(
//     "mongodb+srv://" +
//       mongouser +
//       ":" +
//       mongopass +
//       "@cluster0.xlknb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//   )
//   .then((result) => {
//     app.listen(port);
//   })
//   .catch((err) => console.log(err));