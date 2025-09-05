#!/bin/bash
cd /home/kavia/workspace/code-generation/task-organizer-72250-72288/todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

