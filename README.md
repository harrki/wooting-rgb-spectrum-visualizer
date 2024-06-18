# Wooting RGB Spectrum Visualizer
## Overview
This app visualizes the sound spectrum with Wooting RGB.

## Requirement
- Windows OS (10 or higher)
- Node.js (v20.x or higher)
- [simple-javascript-wooting-rgb](https://github.com/harrki/simple-javascript-wooting-rgb)

## Installation
1. Clone [simple-javascript-wooting-rgb](https://github.com/harrki/simple-javascript-wooting-rgb) and move to the directory
    ```
    git clone https://github.com/harrki/simple-javascript-wooting-rgb
    cd simple-javascript-wooting-rgb
    ```

2. Download or compile `.dll` files of [Wooting RGB SDK](https://github.com/WootingKb/wooting-rgb-sdk), And put the file in the root directory of the library

    ```
    C:.
    │  jest.config.js
    │  package-lock.json
    │  package.json
    │  README.md
    │  wooting-rgb-sdk64.dll <- put .dll file
    │
    ├─node_modules
    │  └─ ...
    ├─src
    │     index.js
    │
    └─test
          index.test.js
    ```

3. Clone this project and move to the directory
    ```bash
    cd ..
    git clone https://github.com/harrki/wooting-rgb-spectrum-visualizer
    cd wooting-rgb-spectrum-visualizer
    ```

4. Install the library in this project
    ```
    npm install ../simple-javascript-wooting-rgb
    ```

5. Install the libraries
    ```
    npm i
    ```

## Usage
```
cd wooting-rgb-spectrum-visualizer
npm run start
```

## Licence
This project is licensed under the Mozilla Public License Version 2.0 - see the [LICENSE](LICENSE) file for details.