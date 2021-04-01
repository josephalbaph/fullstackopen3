const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.zqzjm.mongodb.net/josephalbaph?retryWrites=true&w=majority`;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    const Person = mongoose.model("Person", personSchema);

    // list phonebook if there are three parameters
    if (process.argv.length === 3) {
      console.log("phonebook:");
      Person.find({})
        .then((result) => {
          result.forEach((person) => {
            console.log(person.name, person.number);
          });
          mongoose.connection.close();
        })
        .catch((err) => console.log("Error", err));
    }

    // add 4th and 5th parameter as name and number if there are 5 parameters
    if (process.argv.length === 5) {
      const name = process.argv[3];
      const number = process.argv[4];
      const person = new Person({ name, number });
      person
        .save()
        .then((result) => {
          console.log("added", name, "number", number, "to phonebook");
          mongoose.connection.close();
        })
        .catch((error) => {
          console.log("error");
        });
    }
  })
  .catch((err) => console.log("Error", err));
