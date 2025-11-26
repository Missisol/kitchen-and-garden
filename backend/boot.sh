#!/bin/bash
flask db upgrade
exec gunicorn -b :5002 --access-logfile - --error-logfile - recipe:app