# ThisWay - Project 
This is the source-code to [ThisWay´s-Website](https://this-way.herokuapp.com).

Just go into the project folder and enter

    npm install
    
This takes some minutes, because of some node dependencies.

To run the app in development mode, just enter

    npm run dev
    
and for production mode

    npm start

The page can by found under localhost:8080

If the port is not free, just change it in the config file under condig.port

## General features
* server-side rendering
* image-proccessing with optimizations
* aws cloud uploads
* reactive frontend

## Development Mode features
* life reload
* sass compilation
 

## Production Mode features
* gzip compression
* uglify 
* minify

## Admin User
By default, no user is an admin 

To enter the admin-panel, just enter:

* email: admin@admin.admin
* Password: Hi123456

at Login Page as credentials

You can find then the [Link](localhost:8080/admin) inside the navigation


## GraphQL Endpoint
You can test queries at [GraphQL UI](https://this-way.herokuapp.com/graphql),
or locally at localhost:8080/graphql

## Database
ThisWay uses MongoDB as default Database.
It can be found under [MLAB](https://mlab.com/login/)

* Username: SAE
* Password: Hi123456




