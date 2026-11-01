# Tirahan — Boarding House Management System

## Summary
Tirahan is a web-based application that centralizes tenant, room, meter, billing, and maintenance management for a boarding house. It replaces scattered logbooks, spreadsheets, and Messenger threads with a single source of truth.

## Problem
Boarding house owners currently manage tenants, bills, and repairs across handwritten logbooks, Excel files, and chat threads. Meter readings are recorded and computed by hand, which causes billing errors and disputes. There is no audit trail and no reliable way to answer basic questions like "how much did I collect last month?"

## Target Users
- **Admin (Landlord):** Full access to all modules.
- **Staff (Helper):** Limited access to meter reading and maintenance.

## Features
- **Tenant Management:** Register, view, update, archive tenants.
- **Room Management:** Add, view, update, archive rooms.
- **Room Assignment:** Assign tenants to rooms with move-in/out dates and deposits.
- **Utility Meter Reading:** Record electric and water readings with auto-computed consumption and charges.
- **Billing & Payments:** Generate invoices, record cash/GCash/bank payments, print receipts.
- **Maintenance Requests:** Log, assign, and resolve repair tickets with a timeline.
- **Dashboard & Reports:** Occupancy, unpaid bills, open tickets, monthly income.
- **Role-Based Access:** Enforce Admin vs Staff permissions.

## Team
| Name | Role | Assigned Feature |
| :--- | :--- | :--- |
| Xyrex Antallan | Developer | Tenant Management |
| Lance Christian Aropo | Developer | Room Management |
| Jose Alejandro Mata | Developer | Billing & Payments |

## Setup Steps
1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in Supabase credentials.
3. Run `npm install`.
4. Run `npm run dev`.

## Task Board
[Trello Board](https://trello.com/invite/b/6ac71e8edf06c097020b5963/ATTI2771b646fc6d8af5a49236c7b3b3fddfFEEF14D4/tirahan-boarding-house-management-system)