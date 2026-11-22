# Build deterministic 1200x630 social images from product-owned typography and original puzzle examples.
Add-Type -AssemblyName System.Drawing
$shareRoot = Split-Path $PSScriptRoot -Parent
foreach ($lang in @('da','en')) {
  $bitmap = [System.Drawing.Bitmap]::new(1200,630)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new([System.Drawing.Rectangle]::new(0,0,1200,630),[System.Drawing.Color]::FromArgb(11,22,37),[System.Drawing.Color]::FromArgb(22,49,73),20)
  $g.FillRectangle($background,0,0,1200,630)
  $white=[System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(243,247,251))
  $muted=[System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(184,204,223))
  $accent=[System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(192,231,255))
  $ink=[System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(17,42,61))
  $headline=[System.Drawing.Font]::new('Segoe UI',43,[System.Drawing.FontStyle]::Bold)
  $body=[System.Drawing.Font]::new('Segoe UI',20,[System.Drawing.FontStyle]::Regular)
  $cta=[System.Drawing.Font]::new('Segoe UI',18,[System.Drawing.FontStyle]::Bold)
  $foot=[System.Drawing.Font]::new('Segoe UI',15,[System.Drawing.FontStyle]::Regular)
  $logo=[System.Drawing.Image]::FromFile((Join-Path $shareRoot 'images/logo.png'))
  $g.DrawImage($logo,76,64,250,60)
  $title=if($lang -eq 'da'){"Kan du finde`nmønstret?"}else{"Can you spot`nthe pattern?"}
  $g.DrawString($title,$headline,$white,[System.Drawing.RectangleF]::new(72,175,580,160))
  $g.DrawString($(if($lang -eq 'da'){'36 opgaver. 40 minutter.'}else{'36 puzzles. 40 minutes.'}),$body,$muted,78,356)
  $g.FillRectangle($accent,78,432,425,68)
  $g.DrawString($(if($lang -eq 'da'){'Prøv IQ Champion'}else{'Try IQ Champion'}),$cta,$ink,100,450)
  $g.DrawString('iqchampion.com',$foot,$muted,78,554)
  for($i=1;$i -le 9;$i++) {
    $source='2'+$i.ToString('00')
    $hash=[Convert]::ToHexString([System.Security.Cryptography.MD5]::HashData([Text.Encoding]::UTF8.GetBytes($source))).ToLowerInvariant()
    $tile=[System.Drawing.Image]::FromFile((Join-Path $shareRoot "tests/test2/$hash.png"))
    $x=712+(($i-1)%3)*142; $y=173+[math]::Floor(($i-1)/3)*112
    $g.DrawImage($tile,[int]$x,[int]$y,96,96); $tile.Dispose()
  }
  $bitmap.Save((Join-Path $shareRoot "images/share-$lang.png"),[System.Drawing.Imaging.ImageFormat]::Png)
  foreach($item in @($logo,$headline,$body,$cta,$foot,$white,$muted,$accent,$ink,$background,$g,$bitmap)){$item.Dispose()}
}
