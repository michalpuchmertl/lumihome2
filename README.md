# Lumihome API specs

## Auth
User is authorized using [JWT Token](https://jwt.io/ "JWT Token") ([RFC 7519](https://tools.ietf.org/html/rfc7519)). Once registered/logged in, user receives token as a response. Token is saved to the React's global context & cookie with `httpOnly` flag and used for every auth-protected API request. Passwords crypted using `bcrypt` hashing func.

### Routes

  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/register`
  - `AUTH-PROTECTED GET /api/v1/auth/me`

---


## User endpoint
Each user has e-mail (used as unique identificator for login), name, password, payment options and profile picture.

### User model
```javascript
{
  name: {type: String},
  email: {
    type: String,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    minLength: 6,
    select: false,
  },
  paymentOptions: {
    bank: [Number],
    bitcoin: String,
  },
  createdAt: {type: Date, default: Date.now},
}
```

### Routes

  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/register`
  - `AUTH-PROTECTED GET /api/v1/auth/me`

---

## Debts endpoint
Creditor can create new debt for a debtor. User can only see debts that he/she is related to.

### Model
  ```javascript
  {
    users: {
      creditor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      debtor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    },
    amount: Number,
    amountPaid: {type: Number, default: 0},
    goods: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    receipt: String,
    boughtOn: {type: Date, default: Date.now},
    approved: {type: Boolean, default: true},
    active: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now}
  }
  ```

### Routes

TBD

----
## Transacitons endpoint
Each debt has transactions. User makes transaction once he sends money to desired account.

### Model
  ```javascript
    amount: Number,
  approved: {type: Boolean, default: false},
  debt: {
    type: mongoose.Schema.ObjectId,
    ref: 'Debt'
  }
  ```

### Routes

  - `AUTH-PROTECTED GET /api/v1/debts/:debtId/transactions`
  - `AUTH-PROTECTED POST /api/v1/debts/:debtId/transactions`
  - `AUTH-PROTECTED GET /api/v1/transactions/:id`
  - `AUTH-PROTECTED PUT /api/v1/transactions/:id`
  - `AUTH-PROTECTED DELETE /api/v1/transactions/:id`
  - `AUTH-PROTECTED GET /api/v1/transactions/:id/approve`

----
## Categories endpoint
Each debt has category. Debts can be sorted by category.

### Model
  ```javascript
  name: String,
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {type: Date, default: Date.now}
  ```

### Routes

  - `GET /api/v1/categories`
  - `AUTH-PROTECTED POST /api/v1/categories`
  - `AUTH-PROTECTED GET /api/v1/categories/:id`
  - `AUTH-PROTECTED PUT /api/v1/categories/:id`
  - `AUTH-PROTECTED DELETE /api/v1/categories/:id`
