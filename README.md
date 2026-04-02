# LMS Event Management System

A comprehensive Learning Management System (LMS) for managing academic events including lectures, workshops, exams, assignments, and more.

## Features

### Backend (Node.js + Express + MongoDB)
- ✅ **Create Events** - Add new events with title, description, dates, location, and attendees
- ✅ **Read Events** - Retrieve all events or specific events by ID
- ✅ **Update Events** - Modify existing event details
- ✅ **Delete Events** - Remove events from the system
- ✅ **Filter Events** - Get events by date range or category
- ✅ **Validation** - Comprehensive input validation

### Frontend (React)
- ✅ **Event List View** - Display all events in a filterable card grid
- ✅ **Event Calendar** - Visual calendar view with color-coded event categories
- ✅ **Create/Edit Form** - Full-featured form for creating and editing events
- ✅ **Search & Filter** - Filter events by category, search by title/description
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Project Structure

```
LMS/
├── Backend/
│   ├── controllers/
│   │   └── eventController.js (CRUD operations)
│   ├── Model/
│   │   └── eventModel.js (Event schema)
│   ├── Routes/
│   │   └── eventRoutes.js (API endpoints)
│   ├── server.js (Main server file)
│   ├── .env (Environment variables)
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── Components/
    │   │   ├── createEvent.jsx (Form component)
    │   │   ├── eventList.jsx (List view)
    │   │   └── eventCalendar.jsx (Calendar view)
    │   ├── Styles/
    │   │   ├── createEvent.css
    │   │   ├── eventList.css
    │   │   └── eventCalendar.css
    │   ├── App.jsx (Main app component)
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

### Backend Setup

1. Navigate to the Backend folder:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create/Update `.env` file with MongoDB connection:
```
MONGODB_URI=mongodb://localhost:27017/lms
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create a new event |
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get event by ID |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| GET | `/api/events/range?startDate=X&endDate=Y` | Get events by date range |
| GET | `/api/events/category/:category` | Get events by category |

### Request Example

```json
{
  "title": "Introduction to React",
  "description": "Learn React fundamentals",
  "startDate": "2024-03-20",
  "endDate": "2024-03-20",
  "location": "Room 101",
  "organizer": "John Doe",
  "category": "lecture",
  "attendees": ["John", "Jane", "Bob"]
}
```

## Event Categories

- **lecture** - Academic lectures
- **workshop** - Hands-on workshops
- **seminar** - Seminars and discussions
- **exam** - Examinations
- **assignment** - Assignment deadlines
- **other** - Other events

## Features in Detail

### Create/Edit Events
- Form validation for required fields
- Date validation (end date must be after start date)
- Multiple attendee input
- Category selection
- Success/error feedback

### Event List
- Card-based layout
- Search by title or description
- Filter by category
- Sort by start date, title, or category
- Edit and delete buttons for each event
- Event details preview

### Event Calendar
- Monthly calendar view
- Color-coded event categories
- Day highlighting for today
- Navigation between months
- Click events to edit
- Legend showing category colors

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` (local) or check your connection string
- Update `.env` file with correct MongoDB URI

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check `proxy` setting in frontend `package.json`
- Clear browser cache and restart the frontend

### Port already in use
- Change PORT in `.env` file (backend) or use `PORT=3001 npm start` (frontend)

## Technologies Used

### Backend
- Express.js - Web framework
- Mongoose - MongoDB object modeling
- CORS - Cross-Origin Resource Sharing
- dotenv - Environment variable management

### Frontend
- React - UI library
- Axios - HTTP client
- react-big-calendar - Calendar component
- date-fns - Date utilities
- CSS3 - Styling

## Future Enhancements

- User authentication and authorization
- Event notifications and reminders
- File attachments for events
- Event repetition/recurrence
- Export events to iCal format
- Real-time event updates with WebSockets
- Advanced scheduling with conflict detection

## License

This project is licensed under the ISC License.

## Support

For issues or questions, please refer to the code comments or create an issue in the repository.
