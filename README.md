# Nexus — College Event Management System

Nexus is a web-based platform that centralizes how college events are discovered, managed, and registered for. It streamlines registration for students and gives organizers the tools to manage events and participant data efficiently.

**Live demo:** [nexus-college-event-registration.onrender.com](https://nexus-college-event-registration.onrender.com)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Event Categories](#event-categories)
- [Tech Stack](#tech-stack)
- [System Workflow](#system-workflow)
- [Database](#database)
- [Security](#security)

---

## Overview

Nexus allows students to create accounts, log in securely, browse available events, view event details, and register — either individually or as part of a team. Organizers can create and manage events, update event details, upload banners, and view participant registrations, all from a dedicated admin dashboard.

---

## Features

### For Students
- Secure registration and login
- Browse upcoming college events
- Search and filter events by category
- View detailed event information
- Register individually or as part of a team
- Instant registration confirmation with a unique Registration ID

### Event Management (Admin)
- Create and manage events
- Update event details
- Manage event status and availability
- Upload event banners
- View and manage registered participants

### Registration Management
- Structured collection of student and team information
- Server-side validation of registration data
- Automatic, unique Registration ID generation
- Persistent storage and retrieval of registration records
- Support for flexible team sizes (solo, fixed team, or a min–max range)

---

## Event Categories

| Category   |
|------------|
| Technical  |
| Workshop   |
| Culture    |
| Sports     |

---

## Tech Stack

| Layer                     | Technology                      |
|----------------------------|----------------------------------|
| Frontend                   | HTML, CSS, JavaScript           |
| Backend                    | Node.js, Express.js             |
| Database                   | MongoDB with Mongoose           |
| Authentication              | JWT (JSON Web Tokens)           |
| Version Control            | Git & GitHub                    |
| Development Environment    | Visual Studio Code              |

---

## System Workflow

1. A student creates an account or logs in.
2. The student browses available college events.
3. Events can be searched or filtered by category.
4. The student views details for a selected event.
5. The student submits the registration form.
6. Registration data is validated on the server.
7. Validated data is stored in MongoDB.
8. A unique Registration ID is generated and returned.
9. Organizers manage events and review registrations through the admin dashboard.

---

## Database

MongoDB is used for data storage, with Mongoose handling schema definition and data interaction. The core collections are:

- **Users** — student and admin accounts
- **Events** — event details, banners, categories, and team-size rules
- **Registrations** — participant and team registration records, linked to both users and events

---

## Security

- **JWT-based authentication** protects authorized operations and manages logged-in sessions.
- **Environment variables** are used for sensitive configuration (database credentials, JWT secrets), which are excluded from version control.