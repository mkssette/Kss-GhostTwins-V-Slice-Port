@if (@CodeSection == @Batch) @then
@echo off
setlocal
echo Buscando archivos numericos para renombrar a AUDIO...
echo -----------------------------------------------------
:: Ejecuta la parte interna de JScript
CScript //nologo //E:JScript "%~f0"
echo.
echo Proceso terminado.
pause
goto :eof
@end

// --- CODIGO JSCRIPT ---
var fso = new ActiveXObject("Scripting.FileSystemObject");
var folder = fso.GetFolder(".");
var files = new Enumerator(folder.Files);

// Expresion regular: ^\d+$ significa "de principio a fin, solo numeros"
var regexNum = /^\d+$/; 

while (!files.atEnd()) {
    var file = files.item();
    var oldName = file.Name;
    var baseName = fso.GetBaseName(oldName);
    var ext = "." + fso.GetExtensionName(oldName);
    
    // Ignorar el propio script
    if (oldName != WScript.ScriptName) {
        
        // Verificamos si el nombre son SOLO numeros (ej: "1", "45", "120")
        if (regexNum.test(baseName)) {
            
            var num = parseInt(baseName, 10);
            var finalNum = "";

            // LOGICA DE RELLENO (PADDING)
            // Si es menor a 10 (1-9), pone un 0 antes (01, 09).
            // Si es 10 o mas, lo deja tal cual (10, 99, 100).
            if (num < 10) {
                finalNum = "" + num;
            } else {
                finalNum = num.toString();
            }

            var newName = "CUT" + finalNum + ext;

            try {
                if (!fso.FileExists(newName)) {
                    file.Name = newName;
                    WScript.Echo("Renombrado: " + oldName + " -> " + newName);
                }
            } catch(e) {
                // Ignorar errores de archivo en uso
            }
        }
    }
    files.moveNext();
}