# ChromaDB Quick Start Script for Windows PowerShell

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  ChromaDB Server Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "OK Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "X Python not found!" -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    exit
}

Write-Host ""

# Check if ChromaDB is installed
Write-Host "Checking ChromaDB installation..." -ForegroundColor Yellow
$chromaInstalled = python -m pip show chromadb 2>&1

if ($chromaInstalled -match "Name: chromadb") {
    Write-Host "OK ChromaDB is already installed" -ForegroundColor Green
} else {
    Write-Host "ChromaDB not found. Installing..." -ForegroundColor Yellow
    python -m pip install chromadb
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK ChromaDB installed successfully" -ForegroundColor Green
    } else {
        Write-Host "X Failed to install ChromaDB" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Starting ChromaDB Server" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will run on: http://localhost:8000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start ChromaDB server
chroma run --host localhost --port 8000
