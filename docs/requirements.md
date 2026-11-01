# Requirements

## Functional Requirements

### Tenant Management
- Register a new tenant with full name, contact, email, valid ID, emergency contact, move-in date.
- View, search, and filter tenants by status.
- Update tenant details.
- Archive tenant records (soft delete).

### Room Management
- Add a room with number, type, capacity, monthly rate, floor, description.
- View and filter rooms by status (Vacant, Occupied, Maintenance).
- Update room details and status.
- Archive rooms (soft delete).

### Room Assignment
- Assign a tenant to a vacant room with move-in date and deposit.
- Record move-out and free the room automatically.
- View current occupants per room.

### Meter Reading
- Record electric and water readings per room.
- Auto-compute consumption (current - previous) and amount (consumption x rate).
- View reading history per room.
- Update or void erroneous readings.

### Billing & Payments
- Generate monthly invoices per occupied room.
- Add rent and utility line items.
- Record full and partial payments (cash, GCash, Maya, bank, check).
- Compute change for cash payments.
- Generate receipt numbers.
- Flag overdue invoices automatically.
- Void invoices and payments with reason.

### Maintenance Requests
- Log a ticket with title, category, priority, room, tenant, photos.
- Assign a handyman and update status.
- Require resolution notes on resolve.
- Maintain a full timeline per ticket.

### Dashboard & Reports
- Show occupancy, unpaid bills, open tickets.
- Show overdue invoices and high-priority tickets.
- Export income, occupancy, delinquency, and utility reports to PDF and Excel.

### Authentication & Access
- Email and password login.
- Admin and Staff roles with distinct permissions.
- Audit log of all create/update/delete actions.

## Non-Functional Requirements
- Responsive UI for phone and laptop.
- Printable invoices and receipts.
- Soft delete for tenants, rooms, and financial records.
- Input validation on all forms.
- Row-level security enforced at the database.