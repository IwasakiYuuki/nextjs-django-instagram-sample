FROM python:3.8.10

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install --no-install-recommends -y curl && \
    apt-get clean

ENV POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    PYSETUP_PATH="/opt/pysetup" 
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://install.python-poetry.org | python3 -
COPY pyproject.toml ./
RUN poetry install --no-root

EXPOSE 8000

COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
