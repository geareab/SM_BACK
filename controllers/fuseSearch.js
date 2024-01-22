const Fuse = require("fuse.js");

const options = {
  includeScore: false,
  includeRefIndex: false,
  keys: ["name"],
};

const applySortFilter = (array, query, amount) => {
  // copy without reference
  const arrayWithoutSpace = JSON.parse(JSON.stringify(array));
  //console.log(array);

  //remove unwanted symbols
  query = query
    .split(" ")
    .join("")
    .split("/")
    .join("")
    .split("-")
    .join("")
    .split(",")
    .join("");

  arrayWithoutSpace.forEach((element) => {
    element.name = element.name
      .split(" ")
      .join("")
      .split("/")
      .join("")
      .split("-")
      .join("")
      .split(",")
      .join("");
  });
  const fuse = new Fuse(arrayWithoutSpace, options);
  const result = fuse.search(query).slice(0, `${amount}`);

  result.forEach((element) => {
    if (array.findIndex((x) => x._id === element.item._id) >= 0) {
      const itemIndex = array.findIndex((x) => x._id === element.item._id);

      element.item.name = array[itemIndex].name;
    }
    delete element.refIndex;
    delete element.item.__v;
  });
  console.log(result);
  return result;
};

module.exports = { applySortFilter };
