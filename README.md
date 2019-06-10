# AutoMart
Auto Mart is an online marketplace for automobiles of diverse makes, model or body type.
[![Coverage Status](https://coveralls.io/repos/github/orley12/AutoMart/badge.svg?branch=develop)](https://coveralls.io/github/orley12/AutoMart?branch=develop)

##Table of Contents
- Introduction
- UI Templates
- API
- API Documentation
- Pivotal Tracker ID
- Technologies
- Installing
- Working Routes
 License

#Introduction
##Project Overview
Auto Mart is an online marketplace for automobiles of diverse makes, model or body type. where users{sellers) can sell vehicles via ads and alo users(buyers) buy vehicles.

Style guide
Airbnb (Javascript style guide)

UI Templates
Preview UI templates 👍 [Github Pages](#)

API
The API is currently in version 1 (v1) and is hosted at https://placeholder.herokuapp.com

API-Documentation
The API endpoints are documented using swagger.json and can be accessed here [API-Docs](#)

Pivotal Tracker ID
https://www.pivotaltracker.com/n/projects/placeholder

*Required Features*
- User can sign up.
- User can sign in.
- User (seller) can post a car sale advertisement.
- User (buyer) can make a purchase order.
- User (buyer) can update the price of his/her purchase order.
- User (seller) can mark his/her posted AD as sold.
- User (seller) can update the price of his/her posted AD.
- User can view a specific car.
- User can view all unsold cars.
- User can view all unsold cars within a price range.
- Admin can delete a posted AD record.
- Admin can view all posted ads whether sold or unsold.

*Optional Features*
- User can reset password.
- User can view all cars of a specific body type.
- User can add multiple pictures to a posted ad.
- User can flag/report a posted AD as fraudulent.
- User can view all unsold cars of a specific make (manufacturer).
- User can view all used unsold cars.
● User can view all new unsold cars

#Technologies
- NodeJs
- Express
- Mocha & Chai
- ESLint
- Babel
- Travis CI
- Code Climate
- Coveralls

#Installing

*Prerequisites*
Ensure you have NodeJS installed by entering node -v on your terminal If you don't have NodeJS installed, go to the NodeJS Website, and follow the download instructions

To install this app

git clone https://github.com/orley12/placeholder

And install the required dependencies

npm install

Run server

npm run start:dev

Server listens on port 8081

Running the tests
To run test cases

npm test

#Working Routes

##API Endpoints

Endpoint	Functionality	HTTP method
/api/v1/auth/signup	Create a user account	POST
/api/v1/auth/login	Login a user	POST
/api/v1/car/ Create a car sale ad POST
/api/v1/order/ Create a purchase order POST
/api/v1/order/<:order-id>/price Update the price of a purchase order PATCH

License 💥
This project is under the MIT LICENSE
