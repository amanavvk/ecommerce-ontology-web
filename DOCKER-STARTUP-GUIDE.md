# Docker Desktop Startup Guide

## Method 1: Start Docker Desktop Manually

### Option A: Through Windows Start Menu
1. Press `Windows Key`
2. Type "Docker Desktop"
3. Click on "Docker Desktop" application
4. Wait for Docker to initialize (whale icon in system tray will stop animating)

### Option B: Through File Explorer
1. Navigate to: `C:\Program Files\Docker\Docker\`
2. Double-click `Docker Desktop.exe`
3. Wait for initialization

### Option C: Through Command Line (Alternative)
```powershell
# Try this if the path is different
& "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

## Method 2: Verify Docker is Running

After starting Docker Desktop, run these commands:

```powershell
# Check Docker daemon
docker --version

# Test Docker connection
docker ps

# Check Docker Compose
docker-compose --version
```

## Method 3: Troubleshooting

If Docker fails to start:

1. **Check Windows Features:**
   - WSL 2 must be enabled
   - Hyper-V (for Windows Home, use WSL 2)

2. **Restart Docker Service:**
   ```powershell
   # Run as Administrator
   Restart-Service "com.docker.service"
   ```

3. **Check System Requirements:**
   - Windows 10/11 64-bit
   - At least 4GB RAM
   - BIOS virtualization enabled

## Next Steps

Once Docker is running, proceed to production deployment testing.
