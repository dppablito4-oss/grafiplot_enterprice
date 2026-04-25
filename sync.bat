@echo off
echo Sincronizando cambios con GitHub...
"C:\Program Files\Git\cmd\git.exe" add .
set /p msg="Ingresa el mensaje del commit (o presiona Enter para usar 'Actualizacion automatica'): "
if "%msg%"=="" set msg=Actualizacion automatica
"C:\Program Files\Git\cmd\git.exe" commit -m "%msg%"
"C:\Program Files\Git\cmd\git.exe" push
echo.
echo Sincronizacion completada.
pause
