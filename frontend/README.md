# Study Material Repository - LMS Component

A comprehensive Learning Management System component for organizing and accessing study materials including Past Papers, Short Notes, and Kuppi Videos.

## Project Overview

This is a modern, full-featured study material repository built with React, TypeScript, Tailwind CSS, and Supabase. The system follows a hierarchical structure matching university curriculum:

**4 Years → 2 Semesters per Year → Relevant Modules → Study Materials**

## Features

### Complete User Interface
- Clean, modern design with intuitive navigation
- Hierarchical browsing (Year → Semester → Module → Materials)
- Three distinct material categories with dedicated tabs:
  - Past Papers
  - Short Notes
  - Kuppi Videos
- Responsive design for all screen sizes

### Upload Material Form
- Comprehensive form validation
- Support for all three material types
- **One-Click Dummy Data Population** for quick presentations
- Real-time validation feedback
- Module selection from all available courses

### Working Functionality (35%+)
- View all modules by year and semester
- Browse materials by type (Past Papers, Short Notes, Kuppi Videos)
- Upload new materials with validation
- Instant dummy data population for demos

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Database Schema

### Modules Table
- id (UUID)
- year (1-4)
- semester (1-2)
- code (e.g., "IT3020")
- name (e.g., "Machine Learning")

### Materials Table
- id (UUID)
- module_id (Foreign Key)
- title
- type (past_paper | short_note | kuppi_video)
- file_url
- description

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── YearSelector.tsx          # Year selection interface
│   │   ├── SemesterSelector.tsx      # Semester selection
│   │   ├── ModuleList.tsx            # Module listing
│   │   ├── ModuleDashboard.tsx       # Material viewer with tabs
│   │   └── UploadMaterialForm.tsx    # Upload form with validations
│   ├── lib/
│   │   └── supabase.ts               # Supabase client configuration
│   ├── types/
│   │   └── database.ts               # TypeScript type definitions
│   ├── App.tsx                       # Main application component
│   └── main.tsx                      # Application entry point
└── supabase/
    └── migrations/                   # Database migrations
```

## Presentation Tips (2-Minute Demo)

### Step 1: Show the Hierarchy (20 seconds)
1. Start at Year selection
2. Select "Year 3"
3. Select "Semester 1"
4. Show the list of modules

### Step 2: View Materials (30 seconds)
1. Click on "IT3020 - Machine Learning"
2. Demonstrate the three tabs:
   - Past Papers
   - Short Notes
   - Kuppi Videos
3. Click on a material to show it opens the link

### Step 3: Upload Form Demo (60 seconds)
1. Click "Upload Material" button
2. **Click "Populate Dummy Data"** button to instantly fill the form
3. Show all validations are working:
   - All fields are filled correctly
   - Proper capitalization
   - Valid URL format
4. Click "Upload Material"
5. Show success message
6. Return to module to show the new material appears

### Step 4: Highlight Features (10 seconds)
- "All interfaces are complete and neat"
- "Form validations are implemented"
- "Over 35% functionality is working"
- "Dummy data feature saves presentation time"

## Form Validations Implemented

1. **Title Validation**
   - Required field
   - Minimum 5 characters

2. **Type Validation**
   - Must select a material type
   - Must select a module

3. **URL Validation**
   - Required field
   - Must be a valid URL format
   - Video URLs must be from YouTube, Vimeo, etc.

4. **Description Validation**
   - Required field
   - Minimum 10 characters

## Dummy Data Included

The database comes pre-populated with:
- 32 modules across all 4 years and 2 semesters
- Sample materials for demonstration
- Realistic course codes and names

## Running the Application

The application runs automatically. Just start demonstrating!

## Key Presentation Points

### Completeness
- All interfaces are fully implemented
- Clean, professional design
- Proper navigation flow

### Validation
- All form fields have validation
- Error messages display clearly
- Prevents invalid data submission

### Functionality
- Browse materials by hierarchy
- View materials by type
- Upload new materials
- Form autofill for quick demos

### Polish
- Proper capitalization in all labels
- Intuitive user experience
- Loading states and feedback
- Professional color scheme (blue, not purple)

## Component Descriptions

### YearSelector
Displays cards for Years 1-4 with descriptive labels (Foundation, Intermediate, Advanced, Final Year).

### SemesterSelector
Shows two semesters with date ranges, includes back navigation.

### ModuleList
Grid display of all modules for selected year/semester, fetched from database.

### ModuleDashboard
Main viewing interface with three tabs for different material types. Includes upload button.

### UploadMaterialForm
Modal form with:
- Dummy data button (crucial for presentation)
- All required validations
- Module selection dropdown
- Clear error messages
- Success feedback

## Grading Criteria Compliance

| Criteria | Status | Implementation |
|----------|--------|----------------|
| Complete Interfaces | ✅ | All 5 main interfaces fully designed |
| Form Validations | ✅ | 4 validation types implemented |
| 35% Functionality | ✅ | View + Upload fully working (>50%) |
| Proper Capitalization | ✅ | All labels follow proper case |
| Dummy Data Button | ✅ | One-click form population |

## Good Luck!

Remember to practice the flow a few times before your presentation. The dummy data button will save you valuable seconds during your 2-minute demo!
