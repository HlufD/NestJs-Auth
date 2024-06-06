# Authentication API Documentation

This documentation provides details about the endpoints available in the Authentication API. This API supports user sign up, sign in, sign out, password recovery, and user management. Below, you will find a description of each endpoint along with example requests.

## Table of Contents

1. [Sign Up](#sign-up)
2. [Sign In](#sign-in)
3. [Sign Out](#sign-out)
4. [Who Am I](#who-am-i)
5. [Forget Password](#forget-password)
6. [Get All Users](#get-all-users)
7. [Get Single User](#get-single-user)
8. [Remove User](#remove-user)
9. [Update User](#update-user)

## Sign Up

**Endpoint:** `POST /auth/signup`

Registers a new user.

**Request Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "username": "somebody",
  "email": "somebody@gmail.com",
  "password": "12345"
}
```

## Sign in

**Endpoint** `POST /auth/signin`

**Request Headers:**

- `Content-Type: application/json`

```json
{
  "email": "somebody@gmail.com",
  "password": "12345"
}
```

### Sign out

**Endpoint** `POST /auth/signout`
Logs out the currently authenticated user.

### Who Am I

**Endpoint:** `GET /users/whoami`
Returns the details of the currently authenticated user.

### Forget Password

**Endpoint:** `POST /auth/forget-password`
Sends a password reset email to the user.

**Request Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "email": ""
}
```

### Forget Password

**Endpoint:** `POST /auth/forget-password`
Sends a password reset email to the user.

**Request Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "email": ""
}
```

### Get Single User

**_Endpoint: _** `GET /users/{id}`

- `Fetches details of a single user by their ID.`

### Remove User

**_Endpoint: _** `DELETE /users/{id}`

- `Deletes a user by their ID.`

### Update User

**_Endpoint:_** `PATCH /users/{id}`

- `Updates details of a user by their ID.`
  `Request Headers:`
  `Content-Type: application/json`

### Request Body:

```json
{
  "email": "bedasa@gamil.com",
  "username": "bedasa"
}
```

### Setup and Run

- `Clone the repository:`
- bash
- git clone https://github.com/yourusername/Auth

### Navigate to the project directory:

- bash
- cd auth-api

### Install the dependencies:

- bash
- npm install

### Start the server:

- bash
- npm start
