var item = [{ title: "Fisrt Post item", content: "first medicine item" }];

exports.getItem = (req, res, next) => {
  res.json({ item});
};

exports.postItem = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
    item.push({title,content});

  res.status(201).json({
    message: "Post created successfully!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
