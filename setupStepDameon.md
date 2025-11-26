Here's how to set it up:

**Step 1: Create the systemd service file**

```bash
sudo nano /etc/systemd/system/docker-app.service
```

Copy and paste the content from the artifact above, but replace `/path/to/your/project` with your actual project path. For example:
```
WorkingDirectory=/home/cyberguru/Documents/project/testme
```

**Step 2: Save and exit**
- Press `Ctrl + X`, then `Y`, then `Enter`

**Step 3: Reload systemd**
```bash
sudo systemctl daemon-reload
```

**Step 4: Enable the service to start on boot**
```bash
sudo systemctl enable docker-app.service
```

**Step 5: Start the service now (optional)**
```bash
sudo systemctl start docker-app.service
```

**Useful commands:**

```bash
# Check service status
sudo systemctl status docker-app.service

# View service logs
sudo journalctl -u docker-app.service -f

# Stop the service
sudo systemctl stop docker-app.service

# Restart the service
sudo systemctl restart docker-app.service

# Disable auto-start
sudo systemctl disable docker-app.service
```

**Verify it's enabled:**
```bash
sudo systemctl is-enabled docker-app.service
```

Now your Docker Compose services will automatically start on every Ubuntu boot!
