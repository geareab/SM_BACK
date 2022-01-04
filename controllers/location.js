var location = [{ title: "Fisrt Post location", content: "first medicine location" }];

exports.getLocation = (req, res, next) => {
  res.json({ location});
};

exports.postLocation = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  location.push({title,content});

  res.status(201).json({
    message: "Post created successfully!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
