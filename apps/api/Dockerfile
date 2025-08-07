FROM python:3.10-slim

# set environment variables for ease of configuration
ENV PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_VERSION=2.1.3

# the working directory inside the container
WORKDIR /app

# install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# install poetry
RUN pip install "poetry==$POETRY_VERSION"

# copy only dependency files first for caching
COPY pyproject.toml poetry.lock ./

# install dependencies
RUN poetry install --no-root

COPY . .

# COPY api/ ./api/
# COPY data/ ./data/
# COPY label/ ./label/
# COPY model/ ./model/

# Expose the port the app runs on
EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]