# Maloti Tour Guides

A responsive academic demonstration project, React-based tourism discovery website introducing visitors to Lesotho's landscapes, attractions, culture, and travel experiences. It includes attraction browsing and an enquiry form for demonstrating client-side validation.

## Features

- Responsive landing page with an introduction to Lesotho, travel experiences, and cultural context.
- Attraction cards with category filters, name search, and detail views.
- Attraction detail actions that preselect the destination in the enquiry form.
- Client-side enquiry form validation for name, email, phone, destination, visitors, date, and message.
- Accessible form labels, inline errors, error summary, submission feedback, and keyboard focus styling.
- Fictional example contact information in the enquiry section and footer.

## Requirements

- Node.js and npm.

## Run locally

1. Install the project dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open the local URL printed in the terminal (Create React App typically uses `http://localhost:3000`).

To create a production build, run:

```bash
npm run build
```

## Project structure

```text
public/
  images/                 Website image assets
  index.html              HTML entry point and browser metadata
src/
  components/             Reusable attraction, enquiry, field, and footer components
  data/
    attractions.js        Attraction information and image attribution metadata
    contact.js            Fictional example contact details
  utils/
    formValidation.js     Reusable field and form validation functions
  App.js                  Main page composition and navigation state
  App.css                 Page and component styles
  index.css               Global styles and design tokens
  index.js                React application entry point
```
