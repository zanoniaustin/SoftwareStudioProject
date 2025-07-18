# SoftwareStudioProject

Drexel SE-691-684 - SU 24-25
Alejandro Rojas
Austin Zanoni
Dan Arthur
Justin Yang
Rahul Madhusudanan
Vipin George

## Project Setup Guide for `pokehub`

This document provides a complete guide to setting up the `pokehub` monorepo for local development, specifically for
developers using a JetBrains IDE like WebStorm.

### \#\# Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Node.js** (v18 or later)
* **Python** (v3.9 or later)
* **Poetry**
* **WebStorm**, **PyCharm Pro**, or **IntelliJ Ultimate** (with the Python plugin enabled)

### \#\# 1. Initial Workspace Setup

First, clone the repository and install all the necessary Node.js dependencies for the workspace.

```bash
git clone <your-repository-url>
cd pokehub
npm install
```

### \#\# 2. Python Backend Setup

The Python backend is managed by Poetry. The following one-time configuration is required for a smooth development
experience.

1. **Configure Poetry for Local Virtual Environments**
   This command tells Poetry to create the `.venv` folder inside your project, which makes it easy for your IDE to find.

   ```bash
   poetry config virtualenvs.in-project true
   ```

2. **Install the Poetry Export Plugin**
   The Nx build process requires this plugin to function with modern versions of Poetry.

   ```bash
   poetry self add poetry-plugin-export
   ```

3. **Install Python Dependencies**
   Navigate to the API directory and run `poetry install`.

   ```bash
   cd apps/api
   poetry install
   cd ../.. 
   ```

### \#\# 3. IDE Configuration (WebStorm)

You must configure WebStorm to recognize the Python interpreter for the `api` project.

1. Go to `Settings / Preferences > Project: pokehub > Python Interpreter`.
2. Click the interpreter dropdown menu and select `Add New Interpreter...`.
3. On the left, select **Virtualenv Environment**, then on the right, select the **`Existing`** radio button.
4. Click the `...` icon and navigate to the interpreter path: `pokehub/apps/api/.venv/bin/python`.
5. Click **OK** to apply. The IDE will index the packages.

### \#\# 4. Running the Application

All commands should be run from the **root `pokehub` directory**.

* **To run both the frontend and backend simultaneously:**

  ```bash
  npx nx run-many --target=serve --projects=@pokehub/web,api
  ```

    * Frontend will be available at `http://localhost:3000`.
    * Backend will be available at `http://localhost:8000`.

* **To run only the frontend:**

  ```bash
  npx nx serve @pokehub/web
  ```

* **To run only the backend:**

  ```bash
  npx nx serve api
  ```
