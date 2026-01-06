# 🔄 Update Code to Use WebP Images
# This script will be run AFTER you convert GIFs to WebP

Write-Host "🔄 Updating code to use WebP images..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if WebP files exist
$publicFolder = Join-Path $PSScriptRoot "public"
$webpFiles = @(
    "logo-snow3.webp",
    "logo-fire.webp",
    "logo-snow.webp",
    "livreur-snip.webp"
)

Write-Host "📁 Checking for WebP files in: $publicFolder" -ForegroundColor Yellow
Write-Host ""

$missingFiles = @()
foreach ($file in $webpFiles) {
    $filePath = Join-Path $publicFolder $file
    if (Test-Path $filePath) {
        $size = [math]::Round((Get-Item $filePath).Length / 1MB, 2)
        Write-Host "  ✅ Found: $file ($size MB)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Missing: $file" -ForegroundColor Red
        $missingFiles += $file
    }
}

Write-Host ""

if ($missingFiles.Count -gt 0) {
    Write-Host "⚠️  Warning: Some WebP files are missing!" -ForegroundColor Yellow
    Write-Host "Please convert the following files first:" -ForegroundColor Yellow
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Run the conversion script first: .\convert-gifs.ps1" -ForegroundColor Cyan
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit
    }
}

Write-Host "✅ All WebP files found!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 The following files will be updated:" -ForegroundColor Cyan
Write-Host "  1. components/Logo.tsx" -ForegroundColor White
Write-Host "  2. components/LoadingScreen.tsx" -ForegroundColor White
Write-Host "  3. src/CustomerApp.tsx" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Proceed with code updates? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "🔄 Updating files..." -ForegroundColor Cyan
Write-Host ""

# Note: The actual file updates will be done by the AI assistant
# This script just validates and prepares

Write-Host "✅ Ready for code updates!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. The AI will now update your component files" -ForegroundColor White
Write-Host "2. Components will use WebP with GIF fallback" -ForegroundColor White
Write-Host "3. Test the app to ensure everything works" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
