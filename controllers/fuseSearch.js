// const Fuse = require('fuse.js');

// const options = {
//   includeScore: true,
//   // equivalent to `keys: [['author', 'tags', 'value']]`
//   keys: ['name']
// };

// const applySortFilter = (array, query) => {
//   // const userFullnames = array.map((element) => {
//   //   return (element.name = element.name.split(' ').join(''));
//   // });

//   const fuse = new Fuse(array, options);

//   const result = fuse.search(query);
//   const primaryResult = array.filter(
//     (_user) =>
//       _user.name
//         .toLowerCase()
//         .split(' ')
//         .join('')
//         .split('-')
//         .join('')
//         .indexOf(query.toLowerCase().split(' ').join('')) !== -1 &&
//       _user.name
//         .toLowerCase()
//         .split(' ')
//         .join('')
//         .split('-')
//         .join('')
//         .indexOf(query.toLowerCase().split(' ').join('')) < 1
//   );

//   console.log(primaryResult);

//   console.log(result.slice(0, 30));
//   return result.slice(0, 30);
// };


// module.exports = applySortFilter();