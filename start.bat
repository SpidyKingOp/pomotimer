@echo off
title PomoTimer Dev Server
cd /d "%~dp0"
echo Starting PomoTimer...
start http://localhost:5173
npm run dev
