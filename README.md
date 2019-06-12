# AutoMart
Auto Mart is an online marketplace for automobiles of diverse makes, model or body type.


[![Coverage Status](https://coveralls.io/repos/github/orley12/AutoMart/badge.svg?branch=develop)](https://coveralls.io/github/orley12/AutoMart?branch=develop)
[![Build Status](https://travis-ci.org/orley12/AutoMart.svg?branch=develop)](https://travis-ci.org/orley12/AutoMart)
[![Maintainability](https://api.codeclimate.com/v1/badges/f5b6108bf16a44f823e2/maintainability)](https://codeclimate.com/github/orley12/AutoMart/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f5b6108bf16a44f823e2/test_coverage)](https://codeclimate.com/github/orley12/AutoMart/test_coverage)

## Table of Contents

- [Introduction](#introduction)
- [UI Templates](#ui-templates)
- [API](#api)
- [API Documentation](#api-documentation)
- [Pivotal Tracker ID](https://www.pivotaltracker.com/n/projects/2346834)
- [Technologies](#technologies)
- [Installing](#installing)
- [Working Routes](#working-routes)

# Introduction

## _Project Overview_

Auto Mart is an online marketplace for automobiles of diverse makes, model or body type. where users{sellers) can sell vehicles via ads and alo users(buyers) buy vehicles.

### **Style guide**

[Airbnb ](https://github.com/airbnb/javascript)(Javascript style guide)

# UI Templates

Preview UI templates :+1: [Github Pages](https://orley12.github.io/AutoMart/UI/index.html)

# API

The API is currently in version 1 (v1) and is hosted at https://infinite-garden-51728.herokuapp.com/

# API-Documentation

The API endpoints are documented using swagger.json and can be accessed here [API-Docs](https://infinite-garden-51728.herokuapp.com/api-docs)

# Pivotal Tracker ID

https://www.pivotaltracker.com/n/projects/2346834

## Required Features

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

# Technologies

- NodeJs
- Express
- Mocha & Chai
- ESLint
- Babel
- Travis
- Code Climate
- Coveralls

# Installing

#### _Prerequisites_

Ensure you have **NodeJS** installed by entering `node -v` on your terminal
If you don't have **NodeJS** installed, go to the [NodeJS Website](http://nodejs.org), and follow the download instructions

To install this app

`git clone https://github.com/orley12/AutoMart.git`

And install the required dependencies

`npm install`

Run server

`npm run start:dev`

Server listens on port `8081`

## Running the tests

To run test cases

`npm test`

# Working Routes

## _API Endpoints_

| Endpoint                                                      | Functionality                          | HTTP method |
| ------------------------------------------------------------- | :------------------------------------: | ----------: |
| /api/v1/auth/signup                                           | Create a user account                       | POST   |
| /api/v1/auth/login                                            | Login a user                                | POST   |
| /api/v1/car                                                   | Create a car advertiment                    | POST   |
| /api/v1/car/:id                                               | Get a single car by its id                  | GET    |
| /api/v1/car                                                   | Get all cars                                | GET    |
| /api/v1/car?status=avaliable&minPrice=100000&maxPrice=5000000 | View all car between the min and max prices | GET    |
| /api/v1/car?status=avaliable&manufacturer=benz                | Return all coupe benz cars                  | GET    |
| /api/v1/car?status=avaliable&bodyType=coupe                   | Return all coupe bodyType cars              | GET    |
| /api/v1/car?status=avaliable&state=new                        | Return all new cars                         | GET    |
| /api/v1/car/:id/status                                        | Modify status of a car(sold/unsold)         | PATCH  |           |/api/v1/car/:id/status                                         | Modify price of a car                       | PATCH  |
| /api/v1/car/:id/flag                                          | Flag an advert as fraudulent                | POST   |
| /api/v1/car/:id                                               | Delete an advert                            | DELETE |
| /api/v1/order                                                 | Create an order for a car                   | POST   |
| /api/v1/order/:id?price                                       | Modify an order for a car                   | PATCH  |
| /api-docs                                                     | Read API documentation                      | GET    |
