This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Advanced setState()

Calling setState() in React is asynchronous, for various reasons (mainly performance). Under the covers React will batch multiple calls to setState() into a single call, and then re-render the component a single time, rather than re-rendering for every state change. Therefore the `imageUrl` parameter would have never worked in our example, because when we called Clarifai with our the predict function, React wasn't finished updating the state.

One way to go around this issue is to use a callback function:

setState(updater, callback)

[Read about it more here](https://reactjs.org/docs/react-component.html#setstate)

```js
// NO!!!
app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl).then(
  function(response) {
    // do something with response
  },
  function(err) {
    // there was an error
  }
);

// YES!!!
app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
  function(response) {
    // do something with response
  },
  function(err) {
    // there was an error
  }
);
```
