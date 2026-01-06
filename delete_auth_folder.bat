@echo off
cd /d "c:\Users\Abdoul Niang\Desktop\UVS\master2projetabyabd\app"
if exist "(auth)" (
    echo Deleting (auth) folder...
    rmdir /s /q "(auth)"
    echo (auth) folder deleted successfully.
) else (
    echo (auth) folder does not exist.
)
pause
