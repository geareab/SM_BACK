var company = [{ title: "Fisrt Post comapny", content: "first company" }];

exports.getCompany = (req, res, next) => {
  res.json({ company});
};

exports.postCompany = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  company.push({title,content});

  res.status(201).json({
    message: "Post created successfully!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
