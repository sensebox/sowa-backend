---
sidebar_position: 1
# pagination_next: null
# pagination_prev: null
---

# Introduction

Documentation of the routes and methods to manage the sensorWiki API. You can find the API running at <https://api.sensors.wiki/>. The belonging user interface to the API can be accessed under <https://sensors.wiki/>.

The API offers a wiki to access, create, edit and delete crowd sourced explicit information about instances of sensors, phenomena, devices, domains and units.

The API has two kinds of different routes:
    - GET
    - POST
The GET-routes are used to retrieve information stored in the database and the POST routes can be used to add, change and delete information from the database. Therefore you need to be authorized to use the POST-routes. You can achieve that by retrieving a web token from your opensensemap API LogIn (See in the following).
