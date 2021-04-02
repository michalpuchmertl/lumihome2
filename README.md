# Lumihome API specs

## Users

---

## Debts

Creditor can create new debt for debtor. Every user see debts related to them.

Debt has price amount, description of goods, category and receipt picture URL.

- show all debts
  - `GET /api/v1/debts`
- show debt detail
  - `GET /api/v1/debts/:id`
- create new debt
  - `POST /api/v1/debts`
- update debt
  - `PUT /api/v1/debts`
- delete debt

  - `DELETE /api/v1/debts`

- update receipt photo
  - `PUT /api/v1/debts/:id/receipt`

##
