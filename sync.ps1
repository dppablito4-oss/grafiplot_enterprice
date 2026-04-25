Write-Host "Sincronizando cambios con GitHub..." -ForegroundColor Cyan
& "C:\Program Files\Git\cmd\git.exe" add .
$msg = Read-Host "Ingresa el mensaje del commit (o presiona Enter para usar 'Actualizacion automatica')"
if ([string]::IsNullOrWhiteSpace($msg)) {
    $msg = "Actualizacion automatica"
}
& "C:\Program Files\Git\cmd\git.exe" commit -m $msg
& "C:\Program Files\Git\cmd\git.exe" push
Write-Host "Sincronizacion completada." -ForegroundColor Green
Pause
