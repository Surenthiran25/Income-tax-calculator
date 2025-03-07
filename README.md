# Income Expense Calculator

A fully functional Income Expense Calculator built with React, TypeScript, and TailwindCSS. This application allows users to track their income and expenses, providing a clear overview of their financial status.

## Features

- **Add Income and Expense Entries**: Enter descriptions and amounts for both income and expense transactions.
- **Edit and Delete Entries**: Modify or remove existing entries as needed.
- **Filter Transactions**: View all transactions, only income, or only expenses.
- **Financial Overview**: See total income, total expenses, and net balance at a glance.
- **Persistent Storage**: Data is saved to local storage, so your entries remain even after closing the browser.
- **Responsive Design**: Works well on both desktop and mobile devices.

## Technologies Used

- React
- TypeScript
- TailwindCSS
- Lucide React (for icons)
- Local Storage API

## How to Use

1. **Add a New Entry**:
   - Enter a description for the transaction
   - Enter the amount
   - Select whether it's income or expense
   - Click "Add Entry"

2. **Edit an Entry**:
   - Click the edit icon next to the entry you want to modify
   - Update the information as needed
   - Click "Update Entry"

3. **Delete an Entry**:
   - Click the trash icon next to the entry you want to remove

4. **Filter Entries**:
   - Use the radio buttons to filter by All, Income, or Expense

5. **Reset Form**:
   - Click the "Reset" button to clear the form fields

## Project Structure

- `App.tsx`: Main component containing all the application logic
- `index.css`: Contains Tailwind CSS imports
- `main.tsx`: Entry point for the React application

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Build for production with `npm run build`