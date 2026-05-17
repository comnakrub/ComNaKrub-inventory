<#
.SYNOPSIS
    Deploy ComNaKrub to QNAP NAS
.DESCRIPTION
    Builds Docker images locally, pushes to QNAP, and restarts services.
    Reads connection config from deploy.env (copy deploy.env.example to get started).
#>
param(
    [switch]$Build = $true,
    [switch]$Seed,
    [string]$EnvFile = "$PSScriptRoot\deploy.env"
)

$ErrorActionPreference = 'Stop'

# Load deploy.env
if (-not (Test-Path $EnvFile)) {
    throw "Missing $EnvFile - copy deploy.env.example to deploy.env and fill in your values"
}
Get-Content $EnvFile | Where-Object { $_ -match '^\s*[^#\s]' } | ForEach-Object {
    $key, $value = $_ -split '=', 2
    Set-Variable -Name $key.Trim() -Value $value.Trim()
}

$SSH = "ssh -p $REMOTE_PORT ${REMOTE_USER}@${REMOTE_HOST}"
$SCP = "scp -O -P $REMOTE_PORT"

Write-Host '=== ComNaKrub Deploy ===' -ForegroundColor Cyan

# 1. Build
if ($Build) {
    Write-Host '[1/4] Building Docker images...' -ForegroundColor Yellow
    docker compose build
    if ($LASTEXITCODE -ne 0) { throw 'Docker build failed' }
}

# 2. Save & transfer images
Write-Host '[2/4] Transferring images to QNAP...' -ForegroundColor Yellow
$tmpImage = "$env:TEMP\comnakrub-images.tar"
Write-Host "  Saving images to $tmpImage ..." -ForegroundColor Gray
docker save -o $tmpImage comnakrub-backend comnakrub-frontend
if ($LASTEXITCODE -ne 0) { throw 'docker save failed' }

Write-Host '  Uploading to QNAP...' -ForegroundColor Gray
Invoke-Expression "$SCP `"$tmpImage`" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/comnakrub-images.tar"
if ($LASTEXITCODE -ne 0) { throw 'scp failed' }

Write-Host '  Loading images on QNAP...' -ForegroundColor Gray
Invoke-Expression "$SSH `"$DOCKER_BIN load -i $REMOTE_DIR/comnakrub-images.tar && rm $REMOTE_DIR/comnakrub-images.tar`""
if ($LASTEXITCODE -ne 0) { throw 'docker load failed' }

Remove-Item $tmpImage -ErrorAction SilentlyContinue

# 3. Sync compose file
Write-Host '[3/4] Syncing docker-compose.yml...' -ForegroundColor Yellow
Invoke-Expression "$SCP docker-compose.yml ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/docker-compose.yml"

# 4. Restart services
Write-Host '[4/4] Restarting services on QNAP...' -ForegroundColor Yellow
$remoteCmd = "APP_PORT=$APP_PORT cd $REMOTE_DIR && $DOCKER_BIN compose up -d --remove-orphans"
Invoke-Expression "$SSH `"$remoteCmd`""

if ($Seed) {
    Write-Host '[Seed] Running database seed...' -ForegroundColor Yellow
    Invoke-Expression "$SSH `"$DOCKER_BIN exec comnakrub-backend sh -c 'npx tsx prisma/seed.ts'`""
}

Write-Host ''
Write-Host '=== Deploy complete ===' -ForegroundColor Green
Write-Host "Frontend: http://${REMOTE_HOST}:${APP_PORT}" -ForegroundColor Green
