#!/bin/bash

if ! command -v firebase &> /dev/null
then
    echo "Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

firebase login --no-localhost

if [ -d "build" ]; then
  echo "Removing existing build folder..."
  rm -rf build
fi

echo "Building React app..."
npm run build

if [ ! -f "firebase.json" ]; then
  echo "Firebase project is not initialized. Initializing..."
  firebase init hosting --project yourecopal-368d3
fi

echo "Deploying app to Firebase..."
firebase deploy --only hosting

echo "Deployment completed!"
