# API Documentation

## Authentication APIs

### POST /api/auth/login
**Description:** Logs in a user with email and password

**Parameters:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Responses:**
- **200:** Successful login
- **400:** Invalid credentials
- **500:** Server error

---

### POST /api/auth/send_otp
**Description:** Sends a one-time password (OTP) to the user email for verification or password reset

**Parameters:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "process_type": "create_user"
}
```

**Responses:**
- **200:** OTP sent successfully
- **400:** Missing parameters
- **500:** Server error

---

### POST /api/auth/verify_otp
**Description:** Verifies the OTP sent to the user's email

**Parameters:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Responses:**
- **200:** OTP verified successfully
- **400:** Invalid or expired OTP
- **500:** Server error

---

### POST /api/auth/reset_password
**Description:** Resets the password for the given email

**Parameters:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "newPassword123"
}
```

**Responses:**
- **200:** Password reset successfully
- **400:** User does not exist or invalid request
- **500:** Server error

---

## Registration APIs

### POST /api/register/create_user
**Description:** Creates a new user with email, password, and user type (Client or Lawyer)

**Parameters:** None

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "secret123",
  "user_type": "Client"
}
```

**Responses:**
- **200:** User registered successfully
- **400:** Missing parameters or email already exists
- **500:** Server error

---

### POST /api/register/insert_client_profile
**Description:** Creates a client profile for an existing user

**Parameters:** None

**Request Body:**
```json
{
  "user_id": 1,
  "firstname": "John",
  "middlename": "M.",
  "lastname": "Doe",
  "gender": "Male",
  "phone_no": "+639171234567",
  "about": "I am a client looking for legal help."
}
```

**Responses:**
- **200:** Client profile created successfully
- **400:** User not found
- **500:** Server error

---

### POST /api/register/insert_lawyer_profile
**Description:** Creates a lawyer profile for an existing user

**Parameters:** None

**Request Body:**
```json
{
  "user_id": 2,
  "firstname": "Jane",
  "middlename": "A.",
  "lastname": "Smith",
  "gender": "Female",
  "phone_no": "+639181234567",
  "about": "Lawyer with 5 years of experience",
  "bar_id_no": "BR-2023-7890",
  "experience_years": 5
}
```

**Responses:**
- **200:** Lawyer profile created successfully
- **400:** User not found
- **500:** Server error

---

### GET /api/get_legal_specializations
**Description:** Fetch all available legal specializations from the database

**Parameters:** None

**Responses:**
- **200:** Legal specializations retrieved successfully
- **401:** Unauthorized
- **500:** Server error

**Response Payload:**
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "specialization": "Corporate Law",
      "description": "Business formation, compliance, governance.",
      "is_active": true
    },
    {
      "id": 2,
      "specialization": "Tax Law",
      "description": "Local and international tax planning, compliance, disputes.",
      "is_active": true
    }
  ]
}
```

---

## User Profile APIs

### GET /api/user/get_user_profile/{user_id}
**Description:** Fetch user profile

**Parameters:**
- `user_id` (integer, required): User ID

**Responses:**
- **200:** User profile retrieved successfully
- **400:** User does not exist
- **401:** Unauthorized
- **500:** Server error

**Response Payload:**
```json
{
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "user_id": 1,
    "firstname": "Test",
    "middlename": "Middle",
    "lastname": "Last",
    "gender": "Male",
    "phone_no": "0909090909",
    "about": "About testing only",
    "location": {
      "latitude": "9.2391819",
      "longitude": "123.2644093"
    },
    "user_type": "client"
  }
}
```

---

### POST /api/user/insert_update_user_location
**Description:** Insert or update user location

**Parameters:** None

**Request Body:**
```json
{
  "user_id": 0,
  "latitude": 0,
  "longitude": 0,
  "city": "string",
  "region": "string",
  "country": "string"
}
```

**Responses:**
- **200:** Location updated successfully
- **400:** Invalid parameters
- **401:** Unauthorized
- **500:** Server error

---

### POST /api/user/insert_update_lawyer_specialization
**Description:** Insert or update lawyer specializations

**Parameters:** None

**Request Body:**
```json
{
  "user_id": 0,
  "specialization_list": [0]
}
```

**Responses:**
- **200:** Specializations updated successfully
- **400:** Invalid parameters
- **401:** Unauthorized
- **500:** Server error

---

### GET /api/user/get_lawyer_specialization/{userID}
**Description:** Get lawyer specializations

**Parameters:**
- `userID` (integer, required): User ID

**Responses:**
- **200:** Specializations retrieved successfully
- **400:** User does not exist
- **401:** Unauthorized
- **500:** Server error

**Response Payload:**
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": 7,
      "user_id": 3,
      "specialization": "Tax Law",
      "description": "Local and international tax planning, compliance, disputes."
    },
    {
      "id": 6,
      "user_id": 3,
      "specialization": "Corporate Law",
      "description": "Business formation, compliance, governance."
    }
  ]
}
```

---

### POST /api/user/update_client_profile
**Description:** Update client profile

**Parameters:** None

**Request Body:**
```json
{
  "user_id": 0,
  "firstname": "string",
  "middlename": "string",
  "lastname": "string",
  "gender": "string",
  "phone_no": "string",
  "about": "string"
}
```

**Responses:**
- **200:** Profile updated successfully
- **400:** Invalid parameters
- **401:** Unauthorized
- **500:** Server error

---

### POST /api/user/update_lawyer_profile
**Description:** Update lawyer profile

**Parameters:** None

**Request Body:**
```json
{
  "user_id": 0,
  "firstname": "string",
  "middlename": "string",
  "lastname": "string",
  "gender": "string",
  "phone_no": "string",
  "about": "string",
  "bar_id_no": "string",
  "experience_years": 0
}
```

**Responses:**
- **200:** Profile updated successfully
- **400:** Invalid parameters
- **401:** Unauthorized
- **500:** Server error

---

## Case Management APIs

### POST /api/user/insert_client_case
**Description:** Insert a new client case - Creates a new case for a given user

**Parameters:** None

**Request Body:**
```json
{
  "user_id": 1,
  "title": "Case Title",
  "description": "Case Description",
  "status": "Open",
  "specialization_id": 2,
  "opened_date": "2025-08-24",
  "closed_date": "2025-09-01"
}
```

**Responses:**
- **200:** Case created successfully
- **400:** Invalid parameters
- **401:** Unauthorized
- **500:** Server error

---

### GET /api/user/get_client_case/{userID}
**Description:** Get client cases by user ID - Fetch all client cases for a given user

**Parameters:**
- `userID` (integer, required): User ID

**Responses:**
- **200:** Cases retrieved successfully
- **400:** User does not exist
- **401:** Unauthorized
- **500:** Server error

**Response Payload:**
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Case Title",
      "description": "Case description",
      "status": "Open",
      "specialization_id": 1,
      "opened_date": "2021-01-01",
      "closed_date": null,
      "date_time_added": "2025-08-10 15:08:44",
      "specialization": "Corporate Law"
    },
    {
      "id": 2,
      "user_id": 1,
      "title": "Case Title Two",
      "description": "Case description Two",
      "status": "Close",
      "specialization_id": 1,
      "opened_date": "2021-01-01",
      "closed_date": "2021-02-02",
      "date_time_added": "2025-08-10 15:24:49",
      "specialization": "Corporate Law"
    }
  ]
}
```

---

## Matching APIs

### POST /api/match/find_nearby_lawyers
**Description:** Find nearby lawyers within a radius

**Parameters:** None

**Request Body:**
```json
{
  "user_id": 1,
  "radius": 10
}
```

**Responses:**
- **200:** Lawyers found successfully
- **400:** Invalid parameters
- **401:** Unauthorized
- **500:** Server error

---

### POST /api/match/find_lawyers_based_on_case
**Description:** Find lawyers based on client's open cases

**Parameters:** None

**Request Body:**
```json
{
  "user_id": 1
}
```

**Responses:**
- **200:** Lawyers found successfully
- **400:** Invalid parameters
- **401:** Unauthorized
- **500:** Server error

---

### POST /api/match/insert_client_likes
**Description:** Client likes a lawyer

**Parameters:** None

**Request Body:**
```json
{
  "client_user_id": 1,
  "lawyer_user_id": 5
}
```

**Responses:**
- **200:** Like recorded successfully
- **400:** Invalid parameters
- **401:** Unauthorized
- **500:** Server error

---

### GET /api/match/get_client_likes/{userID}
**Description:** Get all lawyers liked by a client

**Parameters:**
- `userID` (integer, required): User ID

**Responses:**
- **200:** Client likes retrieved successfully
- **400:** User does not exist
- **401:** Unauthorized
- **500:** Server error

**Response Payload:**
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "lawyer_user_id": 3,
      "date_time_liked": "2025-08-20 14:41:18",
      "email": "lawyer@test.com",
      "firstname": "Live",
      "middlename": "Lawyer",
      "lastname": "Update",
      "gender": "Female",
      "phone_no": "0909090909",
      "about": "About testing only",
      "bar_id_no": "2021001",
      "experience_years": "10"
    }
  ]
}
```

---

### GET /api/match/get_who_liked_lawyer/{userID}
**Description:** Get all clients who liked a lawyer

**Parameters:**
- `userID` (integer, required): User ID

**Responses:**
- **200:** Likes retrieved successfully
- **400:** User does not exist
- **401:** Unauthorized
- **500:** Server error

**Response Payload:**
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": 1,
      "client_user_id": 1,
      "email": "rnnlrodriguez@gmail.com",
      "firstname": "Test",
      "middlename": "Middle",
      "lastname": "Last",
      "gender": "Male",
      "phone_no": "0909090909",
      "about": "About testing only",
      "cases": [
        {
          "title": "Case Title",
          "description": "Case description",
          "specialization": "Corporate Law",
          "status": "Open"
        },
        {
          "title": "Case Title Two",
          "description": "Case description Two",
          "specialization": "Corporate Law",
          "status": "Close"
        }
      ]
    }
  ]
}
```

---

### POST /api/match/lawyer_accept_like
**Description:** Lawyer accepts a like from a client (creates a match)

This endpoint allows a lawyer to accept a like from a client. When accepted, a record is inserted into the matches table and the like is marked as matched.

**Parameters:** None

**Request Body:**
```json
{
  "client_user_id": 5,
  "lawyer_user_id": 12
}
```

**Responses:**
- **200:** Match created successfully
- **400:** Invalid parameters
- **401:** Unauthorized
- **500:** Server error