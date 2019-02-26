# react-face-recognition-brain

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Backend

https://github.com/Kirill255/face-recognition-brain-api

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

## Clarifai Response

https://clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection

The Predict API returns probability scores on the likelihood that the media contains human faces. If human faces are detected, the model will also return the coordinate locations of those faces with a bounding box.

The returned ‘bounding_box’ values are the coordinates of the box outlining each face within the image. They are specified as float values between 0 and 1, relative to the image size; the top-left coordinate of the image is (0.0, 0.0), and the bottom-right of the image is (1.0, 1.0). If the original image size is (500 width, 333 height), then the box above corresponds to the box with top-left corner at (208 x, 83 y) and bottom-right corner at (175 x, 139 y). Note that if the image is rescaled (by the same amount in x and y), then box coordinates remain the same. To convert back to pixel values, multiply by the image size, width (for “left_col” and “right_col”) and height (for “top_row” and “bottom_row”).

```json
{
  "status": {
    "code": 10000,
    "description": "Ok"
  },
  "outputs": [
    {
      "id": "cbda717a00b642bcbe27967f1b3e41cf",
      "status": {
        "code": 10000,
        "description": "Ok"
      },
      "created_at": "2016-11-15T23:25:10Z",
      "model": {
        "name": "face-v1.3",
        "id": "a403429f2ddf4b49b307e318f00e528b",
        "created_at": "2016-10-25T19:30:38Z",
        "app_id": null,
        "output_info": {
          "message": "Show output_info with: GET /models/{model_id}/output_info",
          "type": "facedetect"
        },
        "model_version": {
          "id": "c67b5872d8b44df4be55f2b3de3ebcbb",
          "created_at": "2016-10-25T19:30:38Z",
          "status": {
            "code": 21100,
            "description": "Model trained successfully"
          }
        }
      },
      "input": {
        "id": "cbda717a00b642bcbe27967f1b3e41cf",
        "data": {
          "image": {
            "url": "https://samples.clarifai.com/face-det.jpg"
          }
        }
      },
      "data": {
        "regions": [
          {
            "region_info": {
              "bounding_box": {
                "top_row": 0.22296476,
                "left_col": 0.6717238,
                "bottom_row": 0.33909792,
                "right_col": 0.74911636
              }
            }
          },
          {
            "region_info": {
              "bounding_box": {
                "top_row": 0.33878392,
                "left_col": 0.21030195,
                "bottom_row": 0.48806828,
                "right_col": 0.3097716
              }
            }
          },
          {
            "region_info": {
              "bounding_box": {
                "top_row": 0.44855526,
                "left_col": 0.77092654,
                "bottom_row": 0.5739084,
                "right_col": 0.8544279
              }
            }
          }
        ]
      }
    }
  ]
}
```

### Calculating points X,Y from a Bounding box for the original image size

Ask:

http://community.clarifai.com/t/calculating-points-x-y-from-a-bounding-box-for-the-original-image-size/769

I'm new to Face Model's bounding box values here, so I need some help. Based on the description Face Detection Model's response on this page https://www.clarifai.com/models/face-detection-image-recognition-model/a403429f2ddf4b49b307e318f00e528b#documentation23, how would you calculate to arrive at top-left corner at (208 x, 83 y) and bottom-right corner at (175 x, 139 y)? If anyone can help me understand this calculation so I can draw a blurry box around the face on the original image.

given original image size 500 width, 333 height
Bounding Box:{
"top_row": 0.22296476,
"left_col": 0.6717238,
"bottom_row": 0.33909792,
"right_col": 0.74911636
}

the top-left coordinate of the image is (0.0, 0.0), and the bottom-right of the image is (1.0, 1.0)

Answer:

Hi @phpgiik - the calculations are essentially percentages that are measures from the (0,0) top-left corner of the image and you can interpret them as:

The Top Left Corner of the bounding box is 22% from the top and 67% from the Left
The Bottom Right Corner of the bounding box is 33% from the top and 75% from the left

The corresponding "pixel" coordinates of this box would be:

Top Left: (335, 74)
Bottom Right: (375, 110)

Let me know if you have any follow-up questions on this!

От себя:

в прошлый раз мы высчитывали размеры в px, но в % вроде бы точнее получается, поэтому переделал на %, из ответа выше у нас картинка это 100%, а все координаты идут сверху и слева,
тоесть и нижняя координата отсчитывается сверху и правая координата указана в размере от левого края, у стили мы указываем как 'position: absolute', left, top, right, bottom, поэтому для right и bottom нам нужно из 100% вычесть полученный размер

![bounding-box-size](https://user-images.githubusercontent.com/24504648/53287643-3ffeeb00-3790-11e9-9fb9-83083505091e.png)

## Deploy

1. Мы разместили backend на heroku, теперь нам нужно заменить все url которые обращаются к backend, ссылку на web url можно получить командой `heroku info` или в личном кабинете, например было `fetch("http://localhost:3001/image")`, стало `fetch("https://recognition-api.herokuapp.com/image")`

2. Frontend разместим тоже на heroku `heroku create your_app_name`

3. Deploy `git add .` `git commit -m "changes for deploy to heroku"` `git push heroku master`
