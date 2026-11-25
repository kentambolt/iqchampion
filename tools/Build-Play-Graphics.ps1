$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot=Split-Path $PSScriptRoot -Parent
$output=Join-Path $projectRoot 'android/play/graphics'
New-Item -ItemType Directory -Force $output | Out-Null
function RoundedTile($graphics,$x,$y,$width,$height,$radius,$color) {
    $path=New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter=$radius*2
    $path.AddArc($x,$y,$diameter,$diameter,180,90)
    $path.AddArc(($x+$width-$diameter),$y,$diameter,$diameter,270,90)
    $path.AddArc(($x+$width-$diameter),($y+$height-$diameter),$diameter,$diameter,0,90)
    $path.AddArc($x,($y+$height-$diameter),$diameter,$diameter,90,90)
    $path.CloseFigure()
    $brush=New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($color))
    $graphics.FillPath($brush,$path)
    $brush.Dispose();$path.Dispose()
}
foreach ($language in @('en','da')) {
    $bitmap=New-Object System.Drawing.Bitmap(1024,500)
    $graphics=[System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.Clear([System.Drawing.Color]::FromArgb(248,251,254))
    $navy=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18,42,68))
    $muted=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(63,88,117))
    $blue=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0,160,209))
    $light=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(228,243,253))
    $graphics.FillEllipse($light,600,40,490,490)
    RoundedTile $graphics 58 67 40 40 9 '#126cab'
    RoundedTile $graphics 76 49 40 40 9 '#36a4e8'
    RoundedTile $graphics 76 67 22 22 6 '#65b4e8'
    $brand=New-Object System.Drawing.Font('Segoe UI',30,[System.Drawing.FontStyle]::Bold)
    $heading=New-Object System.Drawing.Font('Segoe UI',36,[System.Drawing.FontStyle]::Bold)
    $body=New-Object System.Drawing.Font('Segoe UI',20,[System.Drawing.FontStyle]::Regular)
    $small=New-Object System.Drawing.Font('Segoe UI',16,[System.Drawing.FontStyle]::Regular)
    $question=New-Object System.Drawing.Font('Segoe UI',58,[System.Drawing.FontStyle]::Bold)
    $graphics.DrawString('IQCHAMPION',$brand,$navy,143,57)
    $headline=if ($language -eq 'da') {'Spot mønstret.'} else {'Spot the pattern.'}
    $facts=if ($language -eq 'da') {'36 visuelle opgaver · 40 minutter'} else {'36 visual puzzles · 40 minutes'}
    $note=if ($language -eq 'da') {'En IQ-udfordring for sjov'} else {'An IQ-style challenge for fun'}
    $graphics.DrawString($headline,$heading,$navy,50,191)
    $graphics.DrawString($facts,$body,$muted,53,270)
    $graphics.DrawString($note,$small,$muted,54,357)
    $state=$graphics.Save()
    $graphics.TranslateTransform(790,253)
    $graphics.RotateTransform(-12)
    foreach ($tile in @(@(-110,-110),@(5,-110),@(-110,5),@(5,5))) {
        RoundedTile $graphics ($tile[0]+5) ($tile[1]+7) 102 102 14 '#cbdfea'
        RoundedTile $graphics $tile[0] $tile[1] 102 102 14 '#ffffff'
    }
    foreach ($dot in @(@(-110,-110),@(5,-110),@(-110,5))) { $graphics.FillEllipse($blue,($dot[0]+28),($dot[1]+28),46,46) }
    $graphics.DrawString('?',$question,$navy,28,4)
    $graphics.Restore($state)
    $bitmap.Save((Join-Path $output "feature-$language.png"),[System.Drawing.Imaging.ImageFormat]::Png)
    foreach ($resource in @($graphics,$bitmap,$brand,$heading,$body,$small,$question,$navy,$muted,$blue,$light)) {$resource.Dispose()}
}
Copy-Item -LiteralPath (Join-Path $projectRoot 'images/app/icon-512.png') -Destination (Join-Path $output 'icon-512.png') -Force
