NOTE : ".env" MUST in ".gitignore" but in my case is difference.

User Authentication API:
Features:-
-User Registration (with email validation and password hashing)
-User Login (with JWT token generation)
-Protected Routes (using JWT authentication middleware)
-Password Change (with validation and hashing)
------------------

Tech Stack:
-Backend: Node.js, Express.js
-Database: MongoDB (Mongoose ODM)
-Authentication: JWT and bcrypt for password hashing
------------------

API Endpoints and Test Case:

1.-Register User with this endpoint-
http://localhost:6000/api/register_user

-body must be
{
  "user_name": "John Doe",
  "user_email": "johndoe@example.com",// register user base on email
  "user_password": "password123"
}

-Response body-
{
    "status": "1",
    "record": {
        "user_name": "hammad",
        "user_email": "abe@dgmail.com",
        "user_password": "$2b$10$8HVQeA/IsHXJgj6uj.ZIQ.eEgqv.cYJ9BYx/iBkUKmO2yHA9lzWoa",
        "_id": "67c6f998d502130d394f065f",
        "__v": 0
    },
    "message": "record successfully created"
}


2.-Login User with this endpoint-
http://localhost:6000/api/login_user

-body must be
{
  "user_email": "johndoe@example.com",// Verify user base on email
  "user_password": "password123"
}

-Response body- with JWT
{
    "status": "1",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2N2M2ZjA5NzBiNzgzN2MxY2YzYTM4NzkiLCJpYXQiOjE3NDEwOTQzMTEsImV4cCI6MTc0MTA5NzkxMX0.143FKNwa_TbRQqQN708PhI3c5e8cMpatjYlFI-hs64s",
    "message": "Successfully login"
}

-----additionally add to use Token for verification (Is working or not) 

3.-Change user password with this endpoint-
http://localhost:6000/api/change_password

*** Add Header
*Authorization = Bearer ${Token}

-body must be
{
    "user_password": "SDS", // As New password
    "confirm_password": "SDS"
}

-Response body- after verify token and update password
{
    "status": "1",
    "message": "Password successfully updated."
}