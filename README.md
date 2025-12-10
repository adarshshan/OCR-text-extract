# Full-Stack OCR Text Extraction Application

This project is a full-stack application designed to extract structured text from documents (images and PDFs) using OCR. It features an Angular frontend and a Node.js/Express backend that uses the Google Vision API.

## Features

- **Frontend (Angular)**
  - Clean, responsive UI for file uploads.
  - Supports PNG, JPG, WEBP, and PDF files.
  - Real-time feedback for loading and error states.
  - Displays extracted data in a structured JSON format.
  - Options to copy the JSON to the clipboard or download it as a `.json` file.

- **Backend (Node.js & Express)**
  - API endpoint for secure file uploads (max 10MB).
  - Validates file types on the server.
  - Uses Google Vision API for Optical Character Recognition (OCR).
  - A parser to extract structured data from voter list documents.
  - Graceful error handling for OCR failures, invalid file types, and other issues.

---

## Project Structure

```
/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── condrollers/
│   │   └── ocrController.js
│   ├── routes/
│   │   └── ocrRoutes.js
│   └── utils/
│       ├── googleVision.js
│       └── parseVoterList.js
└── frontend/
    ├── angular.json
    ├── package.json
    ├── src/
    │   ├── main.ts
    │   ├── app/
    │   │   ├── app.ts
    │   │   ├── app.html
    │   │   ├── services/
    │   │   │   └── ocr.ts
    │   │   ├── upload/
    │   │   │   ├── upload.ts
    │   │   │   └── upload.html
    │   │   └── output/
    │   │       ├── output.ts
    │   │       └── output.html
    └── ...
```

---

## Setup and Running the Application

You will need to run the backend and frontend in two separate terminals.

### 1. Backend Setup (Node.js)

**Prerequisites:** [Node.js](https://nodejs.org/) (v14+) and `npm` installed. A Google Cloud Platform account with the Vision API enabled.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Google Vision API Credentials:**
    - Create a service account and download the JSON key file from the Google Cloud Console. Rename it to `key.json`.
    - Place the `key.json` file in the `backend` directory (or any other location).
    - Create a `.env` file in the `backend` directory.
    - Add the following line to the `.env` file, replacing `./key.json` with the correct path to your key file if you placed it elsewhere:
      ```
      GOOGLE_APPLICATION_CREDENTIALS=./key.json
      ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:5000`.

### 2. Frontend Setup (Angular)

**Prerequisites:** [Node.js](https://nodejs.org/) and `npm` installed. The Angular CLI will be installed as a local dependency.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The application will open automatically in your browser at `http://localhost:4200`.

---

## End-to-End Testing

To test the complete application flow:

1.  **Ensure both the backend and frontend servers are running.**

2.  **Open the application:**
    Open your web browser and navigate to `http://localhost:4200`.

3.  **Prepare a Test Document:**
    Have a sample image of a voter list ready. The backend parser is optimized for documents that can be processed into a JSON structure like the following:
    ```json
    {
        "header": {
            "निवडणूक संस्था": "",
            "निवडणूक विभाग": "१-",
            "निवडणूक गण": "",
            "यादी भाग क्रमांक": ""
        },
        "records": [
            {
                "क्रमांक": 1,
                "EPIC": "IGY7898075",
                "भाग": "49/1/1",
                "मतदाराचे नाव": "डोंगरे कविता रवी",
                "नाते": "• डोंगरे रवी",
                "घर क्रमांक": "२",
                "वय": "35",
                "लिंग": "स्त्री"
            },
            {
                "क्रमांक": 2,
                "EPIC": "IGY6120034",
                "भाग": "49/1/3",
                "मतदाराचे नाव": "अंकित भागवत राऊत",
                "नाते": "भागवत राऊत",
                "घर क्रमांक": "NA",
                "वय": "NA",
                "लिंग": "पु"
            }
        ]
    }
    ```

4.  **Upload the Document:**
    - Click the file input button on the main page.
    - Select your test document.

5.  **Process the Document:**
    - Click the "Process Document" button.
    - The button will become disabled, and a "Processing..." message will appear, indicating that the OCR extraction is in progress.

6.  **Verify the Output:**
    - **On Success:** Once the backend finishes processing, the "Extracted JSON Output" section will appear.
      - The extracted data will be displayed in a formatted JSON viewer.
      - **Verify Data:** Check if the values in the JSON match the data in your test document.
      - **Test "Copy JSON":** Click the button. It should change to "Copied!" for two seconds. Paste the content into a text editor to verify it was copied correctly.
      - **Test "Download JSON":** Click the button. Your browser should prompt you to download an `output.json` file.
    - **On Failure:**
      - **Invalid File Type:** Try uploading a non-supported file (e.g., a `.txt` or `.zip` file). The "Process Document" button should remain disabled, and if you attempt to bypass this, the server should reject it. An error message will appear below the process button.
      - **Unreadable Document:** If you upload a corrupted or blank image, the OCR process may fail. An error message like "OCR extraction failed..." should appear on the screen.

7.  **Check Browser and Server Consoles:**
    - The **browser's developer console** will show logs related to the frontend state.
    - The **terminal running the backend server** will show logs for incoming requests and any processing errors, including detailed OCR errors if they occur.
