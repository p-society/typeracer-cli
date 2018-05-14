## Contributing

If you think of a feature enhancement or find a bug kindly raise an issue. We also welcome you to work on your issues by just commenting down on them with *"I would like to work on this"*. All contributions are appreciated.

**General Setup**

- fork the repository

- clone your forked repository

- set the upstream remote

- cd to folder and run `npm install`

- create a `.env` file in root directory and put following in it

```
DATABASE=your mongoDB url
```

- run `npm start`

*But I don't know how to code, is there any other way I can contribute?*

Yes, ofcourse you can we need lots of paragraphs so that our users don't get bored by typing out the same text over and over  again. To add a paragraph follow these steps:

- Add paragraphs in `paragraphs/para.json`
- run `npm test`
- **Important:** all tests should pass as you would get a test failure for duplicate paragraphs.
- Find same paragraphs then run `npm test`
- If all tests pass locally then **Open a PR**
