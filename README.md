# Monitor Pro V3.0 - CSV Device Status Analyzer

A modern web application for uploading, analyzing, and visualizing device connection status data from CSV files. Built with Vue.js 3 and Express.js.

## Features

- **CSV File Upload**: Upload CSV files containing device data with connection status information
- **Real-time Statistics**: Dashboard displaying device status counts:
  - Online devices
  - Offline devices
  - Devices offline for more than 30 days
  - Total device count
- **Advanced Filtering**: Filter devices by connection status (ONLINE, OFFLINE, OFFLINE for more than 30 days)
- **Search Functionality**: Search across all device data with real-time filtering
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Dynamic Table Display**: Automatically displays all CSV columns with color-coded status badges

## Tech Stack

### Frontend

- **Vue.js 3**: Progressive JavaScript framework
- **Tailwind CSS**: Utility-first CSS framework for styling
- **HTML5**: Semantic markup
- **JavaScript (ES6+)**: Modern JavaScript features

### Backend

- **Express.js**: Node.js web framework
- **multer**: Middleware for handling file uploads
- **csv-parser**: CSV parsing library
- **CORS**: Cross-Origin Resource Sharing support

## Project Structure

```
CSV3/
├── app.js                 # Express server and API endpoints
├── package.json           # Project dependencies
├── public/
│   ├── index.html        # Main HTML file
│   ├── script.js         # Vue.js application logic
│   └── styles.css        # Additional custom styles
└── uploads/              # Temporary directory for uploaded files
```

## Installation

1. Clone or download the project
2. Install dependencies:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
node app.js
```

The server will start on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Seleccionar archivo" to choose a CSV file
3. Click "Analizar" to upload and process the file
4. View the statistics dashboard and device table
5. Use the search box to find specific devices
6. Use the status filter to view devices by connection state

## CSV File Format

Your CSV file should contain:

- A column named "Connection Status" (or similar) with values: `ONLINE`, `OFFLINE`, `OFFLINE for more than 30 days`
- Additional columns with device information (Name, IP Address, Last Seen, etc.)

Example CSV format:

```
Device Name,IP Address,Connection Status,Last Seen
Router-01,192.168.1.1,ONLINE,2026-01-26
Printer-05,192.168.1.50,OFFLINE,2025-12-15
Laptop-03,192.168.1.100,OFFLINE for more than 30 days,2025-11-20
```

## API Endpoints

### POST `/api/obtener-datos`

Upload and parse a CSV file.

**Request:**

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with file field named `archivoCsv`

**Response:**

- Success (200): Array of objects representing CSV rows
- Error (400): `{ error: "Falta archivo" }` - No file provided
- Error (500): `{ error: "Error procesando el archivo" }` - File processing error

## Vue.js Component Data & Methods

### Data Properties

- `datos`: Array containing parsed CSV data
- `busqueda`: Search query string
- `filtroEstado`: Current status filter (TODOS, ONLINE, OFFLINE, OFFLINE for more than 30 days)
- `cargando`: Loading state during file upload
- `errorMsg`: Error message to display to user
- `colStatus`: Column name for connection status

### Computed Properties

- `columnas`: Array of column names from the CSV
- `stats`: Object containing counts of online, offline, and long-term offline devices
- `listaFiltrada`: Filtered list of devices based on search and status filter

### Methods

- `cargarDatos()`: Handles file upload and API call
- `getTailwindBadge()`: Returns Tailwind CSS class for status badges

## Color Scheme

- **Online**: Green (#27ae60)
- **Offline**: Red (#c0392b)
- **Offline 30+ days**: Slate Gray (#546e7a)
- **Primary Action**: Blue (#3498db)

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Uploaded files are automatically deleted after processing
- The application expects a "Connection Status" column in the CSV
- Search is case-insensitive
- The interface is fully responsive and works on mobile devices

## Future Enhancements

- Export filtered data as CSV or JSON
- Add date range filtering
- Implement user authentication
- Add data persistence with database
- Create downloadable reports
- Add chart visualizations (pie charts, line graphs)

## License

This project is provided as-is for educational and commercial use.
