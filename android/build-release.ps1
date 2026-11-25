param([string]$SdkPath, [int]$VersionCode=1, [string]$VersionName='1.0.0')
$ErrorActionPreference='Stop'
$androidRoot=$PSScriptRoot
if ($SdkPath) {
    $resolvedSdk=(Resolve-Path -LiteralPath $SdkPath).Path.Replace('\','/').Replace(':','\:')
    Set-Content -LiteralPath (Join-Path $androidRoot 'local.properties') -Value "sdk.dir=$resolvedSdk"
}
$keyPath=Join-Path $androidRoot '.local/keys/upload-v1.keystore'
$passwordPath=Join-Path $androidRoot '.local/keys/upload-v1-password.dpapi'
if (!(Test-Path -LiteralPath $keyPath) -or !(Test-Path -LiteralPath $passwordPath)) { throw 'IQ Champion upload key is not configured on this machine.' }
$protectedPassword=Get-Content -LiteralPath $passwordPath | ConvertTo-SecureString
$env:IQ_ANDROID_KEYSTORE=$keyPath
$env:IQ_ANDROID_KEY_ALIAS='iqchampion-upload'
$env:IQ_ANDROID_STORE_PASSWORD=[System.Net.NetworkCredential]::new('', $protectedPassword).Password
$env:IQ_ANDROID_KEY_PASSWORD=$env:IQ_ANDROID_STORE_PASSWORD
try {
    & (Join-Path $androidRoot 'gradlew.bat') -p $androidRoot bundleRelease lintRelease "-PiqVersionCode=$VersionCode" "-PiqVersionName=$VersionName" --console=plain
    if ($LASTEXITCODE -ne 0) { throw 'Android release checks failed.' }
} finally {
    Remove-Item Env:IQ_ANDROID_STORE_PASSWORD,Env:IQ_ANDROID_KEY_PASSWORD,Env:IQ_ANDROID_KEYSTORE,Env:IQ_ANDROID_KEY_ALIAS -ErrorAction SilentlyContinue
}
