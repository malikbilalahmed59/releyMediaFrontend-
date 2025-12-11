# PayJunction API Test Script (PowerShell)
# Tests the PayJunction API with provided credentials

$PAYJUNCTION_SANDBOX_URL = "https://api.payjunctionlabs.com"
$PAYJUNCTION_USERNAME = "relymedia"
$PAYJUNCTION_PASSWORD = "Bilal(00)Ahmed"
$PAYJUNCTION_APP_KEY = "83ef9f5a-b3da-43ba-97fd-2044c45751d5"

Write-Host "========================================"
Write-Host "PayJunction API Integration Tests"
Write-Host "Sandbox Environment"
Write-Host "========================================"
Write-Host ""
Write-Host "Using Credentials:"
Write-Host "Username: $PAYJUNCTION_USERNAME"
Write-Host "Password: **************"
Write-Host "App Key: $PAYJUNCTION_APP_KEY"
Write-Host ""

# Create Basic Auth header
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${PAYJUNCTION_USERNAME}:${PAYJUNCTION_PASSWORD}"))
$authHeader = "Basic $credentials"

# Test 1: Charge Credit Card
Write-Host "=== TEST 1: Charge Credit Card (Default CAPTURE) ===" -ForegroundColor Cyan
$body = @{
    cardNumber = "4444333322221111"
    cardExpMonth = "01"
    cardExpYear = "2020"
    amountBase = "1.00"
}

$headers = @{
    "Accept" = "application/json"
    "X-PJ-Application-Key" = $PAYJUNCTION_APP_KEY
    "Authorization" = $authHeader
}

try {
    $response = Invoke-WebRequest -Uri "$PAYJUNCTION_SANDBOX_URL/transactions" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Error Response:" -ForegroundColor Red
    Write-Host $responseBody
}

Write-Host ""
Start-Sleep -Seconds 1

# Test 2: Authorize Credit Card (HOLD)
Write-Host "=== TEST 2: Authorize Credit Card (HOLD) ===" -ForegroundColor Cyan
$body2 = @{
    status = "HOLD"
    cardNumber = "4444333322221111"
    cardExpMonth = "01"
    cardExpYear = "2020"
    amountBase = "2.00"
}

try {
    $response2 = Invoke-WebRequest -Uri "$PAYJUNCTION_SANDBOX_URL/transactions" `
        -Method POST `
        -Headers $headers `
        -Body $body2 `
        -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "Status: $($response2.StatusCode) $($response2.StatusDescription)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    Write-Host $response2.Content
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Error Response:" -ForegroundColor Red
    Write-Host $responseBody
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete"
Write-Host "========================================" -ForegroundColor Cyan

























