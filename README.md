# myMovie API

REST API for a "myMovie" web application

## Project Description

Server-side component of web application that will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies.

Entire application will be built on MERN Stack

API is hosted on [Vercel](https://vercel.com/)

## How to get the project running

Through browser: (All URLs will work)

**https://movie-api-git-main-brett-ranieri.vercel.app/**  
**https://movie-api-brett-ranieri.vercel.app/**  
**https://movie-api-omega.vercel.app/**   

Use [Postman](https://www.postman.com/) to test endpoints. Take any of the URL's listed above and pair it with the endpoint URL provided in ``` /public/documentation.html ```.

**NOTE - Authentication Token required to submit requests!**

Best to follow this order of Endpoint testing when submitting requests to the API:

  1. Add New User
  2. Log-In
      - This will provide you with a token which can then be used to authorize future requests
  3. Any Endpoint can be used from here, as long as token is used.

If running locally in Terminal:

Start - ``` $ run npm start ```

Development - ``` $ run npm dev ```

## Project Dependencies

 - ``` "bcryptjs": "^2.4.3" ```   
 - ``` "body-parser": "^1.20.1" ```
 - ``` "cors": "^2.8.5" ```  
 - ``` "express": "^4.18.2" ``` 
 - ``` "express-validator": "^6.14.3" ``` 
 - ``` "jsonwebtoken": "^9.0.0" ``` 
 - ``` "mongoose": "^6.8.4" ``` 
 - ``` "morgan": "^1.10.0" ``` 
 - ``` "passport": "^0.6.0" ``` 
 - ``` "passport-jwt": "^4.0.1" ``` 
 - ``` "passport-local": "^1.0.0" ``` 
 - ``` "uuid": "^9.0.0" ``` 

## Endpoint Routing and Requirements

See ``` /public/documentation.html ``` 

## Tools and Features to Highlight

 - Node.js and Express for endpoint routing, authentication and validation
 - Basic HTTP Auth to log-in
 - JWT Token Authentication for all over requests
 - User Password Hashing
 - MongoDB noSQL database deployed on MongoDB Atlas
