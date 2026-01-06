# GIF to WebP Conversion Script
# This script converts all GIF files in the public folder to WebP format

Write-Host "🚀 GIF to WebP Converter for Snip Taste" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if FFmpeg is installed
$ffmpegInstalled = $false
try {
    $ffmpegVersion = ffmpeg -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $ffmpegInstalled = $true
        Write-Host "✅ FFmpeg is installed" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ FFmpeg is not installed" -ForegroundColor Red
}

Write-Host ""

# Navigate to public folder
$publicFolder = Join-Path $PSScriptRoot "public"
Set-Location $publicFolder

Write-Host "📁 Working directory: $publicFolder" -ForegroundColor Yellow
Write-Host ""

# Get all GIF files
$gifFiles = Get-ChildItem -Filter "*.gif"

if ($gifFiles.Count -eq 0) {
    Write-Host "❌ No GIF files found in public folder" -ForegroundColor Red
    exit
}

Write-Host "📊 Found $($gifFiles.Count) GIF files to convert:" -ForegroundColor Cyan
foreach ($gif in $gifFiles) {
    $sizeInMB = [math]::Round($gif.Length / 1MB, 2)
    Write-Host "  - $($gif.Name) ($sizeInMB MB)" -ForegroundColor White
}
Write-Host ""

if (-not $ffmpegInstalled) {
    Write-Host "⚠️  FFmpeg is required for automatic conversion" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please choose an option:" -ForegroundColor Cyan
    Write-Host "1. Install FFmpeg automatically (recommended)" -ForegroundColor White
    Write-Host "2. Use online converter (manual)" -ForegroundColor White
    Write-Host "3. Exit" -ForegroundColor White
    Write-Host ""

    $choice = Read-Host "Enter your choice (1-3)"

    switch ($choice) {
        "1" {
            Write-Host ""
            Write-Host "Installing FFmpeg via winget..." -ForegroundColor Yellow
            try {
                winget install FFmpeg
                Write-Host "✅ FFmpeg installed successfully!" -ForegroundColor Green
                Write-Host "⚠️  Please restart this script to convert files" -ForegroundColor Yellow
            } catch {
                Write-Host "❌ Failed to install FFmpeg" -ForegroundColor Red
                Write-Host "Please install manually from: https://ffmpeg.org/download.html" -ForegroundColor Yellow
            }
            exit
        }
        "2" {
            Write-Host ""
            Write-Host "📝 Manual Conversion Steps:" -ForegroundColor Cyan
            Write-Host "1. Go to: https://cloudconvert.com/gif-to-webp" -ForegroundColor White
            Write-Host "2. Upload these files:" -ForegroundColor White
            foreach ($gif in $gifFiles) {
                Write-Host "   - $($gif.Name)" -ForegroundColor Yellow
            }
            Write-Host "3. Convert and download as WebP" -ForegroundColor White
            Write-Host "4. Save them to: $publicFolder" -ForegroundColor White
            Write-Host "5. Run the code update script" -ForegroundColor White
            Write-Host ""
            Write-Host "Opening CloudConvert in browser..." -ForegroundColor Yellow
            Start-Process "https://cloudconvert.com/gif-to-webp"
            exit
        }
        "3" {
            Write-Host "Exiting..." -ForegroundColor Yellow
            exit
        }
        default {
            Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
            exit
        }
    }
}

# Convert files with FFmpeg
Write-Host "🔄 Starting conversion..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($gif in $gifFiles) {
    $inputFile = $gif.FullName
    $outputName = $gif.BaseName -replace ' ', '-'
    $outputFile = Join-Path $publicFolder "$outputName.webp"

    Write-Host "Converting: $($gif.Name)..." -ForegroundColor Yellow

    try {
        # Convert with high quality settings
        $ffmpegArgs = @(
            "-i", $inputFile,
            "-vcodec", "libwebp",
            "-lossless", "0",
            "-compression_level", "6",
            "-q:v", "85",
            "-loop", "0",
            "-y",
            $outputFile
        )

        $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru

        if ($process.ExitCode -eq 0) {
            $originalSize = [math]::Round($gif.Length / 1MB, 2)
            $newSize = [math]::Round((Get-Item $outputFile).Length / 1MB, 2)
            $savings = [math]::Round((1 - ($newSize / $originalSize)) * 100, 1)

            Write-Host "  ✅ Success! $originalSize MB → $newSize MB (${savings}% smaller)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ❌ Failed to convert" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "  ❌ Error: $_" -ForegroundColor Red
        $failCount++
    }

    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📊 Conversion Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Successful: $successCount" -ForegroundColor Green
Write-Host "  ❌ Failed: $failCount" -ForegroundColor Red
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "🎉 Conversion complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Check the WebP files in the public folder" -ForegroundColor White
    Write-Host "2. Run the code update script to use WebP in your app" -ForegroundColor White
    Write-Host "3. Test the app to ensure everything works" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} else {
    Write-Host "❌ No files were converted successfully" -ForegroundColor Red
    Write-Host "Please try the online converter instead" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
