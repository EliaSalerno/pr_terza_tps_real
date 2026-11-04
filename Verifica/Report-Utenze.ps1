<#
.SYNOPSIS
  Report completo di utenti, gruppi, password policy e dominio (Windows 11 Pro).
.NOTES
  Eseguire da PowerShell come AMMINISTRATORE.
  Se lo script e' bloccato:  Set-ExecutionPolicy -Scope Process Bypass
  Non legge ne' mostra le password: riporta solo lo stato (impostata, scadenza, ecc.).
#>

$ErrorActionPreference = 'Continue'

$data   = Get-Date -Format 'yyyyMMdd_HHmmss'
$nomePC = $env:COMPUTERNAME
$out    = Join-Path ([Environment]::GetFolderPath('Desktop')) "Report_${nomePC}_${data}.txt"

function Sezione($titolo) {
    "`r`n" + ('=' * 70) + "`r`n  $titolo`r`n" + ('=' * 70)
}

$report = New-Object System.Collections.Generic.List[string]
function Aggiungi($testo) { $report.Add([string]$testo) }

# ---------------------------------------------------------------- 1. MACCHINA
Aggiungi (Sezione '1. INFORMAZIONI MACCHINA')
$cs = Get-CimInstance Win32_ComputerSystem
$os = Get-CimInstance Win32_OperatingSystem
Aggiungi ("Nome computer     : {0}" -f $cs.Name)
Aggiungi ("Sistema operativo : {0} (build {1})" -f $os.Caption, $os.BuildNumber)
Aggiungi ("Data report       : {0}" -f (Get-Date))
Aggiungi ("Eseguito da       : {0}" -f (whoami))

# ---------------------------------------------------------------- 2. DOMINIO
Aggiungi (Sezione '2. DOMINIO / WORKGROUP')
if ($cs.PartOfDomain) {
    Aggiungi ("Appartenenza  : DOMINIO")
    Aggiungi ("Dominio       : {0}" -f $cs.Domain)
} else {
    Aggiungi ("Appartenenza  : WORKGROUP (nessun dominio)")
    Aggiungi ("Workgroup     : {0}" -f $cs.Workgroup)
}
Aggiungi ""
Aggiungi "Stato join Azure AD / Entra ID:"
try {
    Aggiungi ((dsregcmd /status | Select-String 'AzureAdJoined|DomainJoined|WorkplaceJoined|TenantName') -join "`r`n")
} catch { Aggiungi "  (dsregcmd non disponibile)" }

# ---------------------------------------------------------------- 3. UTENTI
Aggiungi (Sezione '3. UTENTI LOCALI')
try {
    $utenti = Get-LocalUser
    foreach ($u in $utenti) {
        Aggiungi ("--- {0}" -f $u.Name)
        Aggiungi ("  Abilitato              : {0}" -f $u.Enabled)
        Aggiungi ("  Descrizione            : {0}" -f $u.Description)
        Aggiungi ("  Tipo account           : {0}" -f $u.PrincipalSource)
        Aggiungi ("  SID                    : {0}" -f $u.SID)
        Aggiungi ("  Password richiesta     : {0}" -f $u.PasswordRequired)
        Aggiungi ("  Password impostata il  : {0}" -f $u.PasswordLastSet)
        Aggiungi ("  Password scade il      : {0}" -f $(if ($u.PasswordExpires) { $u.PasswordExpires } else { 'mai / non scade' }))
        Aggiungi ("  Utente puo' cambiarla  : {0}" -f $u.UserMayChangePassword)
        Aggiungi ("  Ultimo accesso         : {0}" -f $(if ($u.LastLogon) { $u.LastLogon } else { 'mai' }))
        Aggiungi ("  Account scade il       : {0}" -f $(if ($u.AccountExpires) { $u.AccountExpires } else { 'mai' }))
    }
} catch { Aggiungi "Errore lettura utenti: $_" }

Aggiungi (Sezione '3b. TABELLA RIASSUNTIVA UTENTI')
try {
    Aggiungi ((Get-LocalUser |
        Select-Object Name, Enabled, PasswordRequired, PasswordLastSet, PasswordExpires, LastLogon |
        Format-Table -AutoSize | Out-String -Width 250))
} catch { }

# ---------------------------------------------------------------- 4. GRUPPI
Aggiungi (Sezione '4. GRUPPI LOCALI E MEMBRI')
try {
    foreach ($g in Get-LocalGroup) {
        Aggiungi ("--- {0}  ({1})" -f $g.Name, $g.Description)
        try {
            $membri = Get-LocalGroupMember -Group $g.Name -ErrorAction Stop
            if ($membri) {
                foreach ($m in $membri) {
                    Aggiungi ("     - {0}   [{1}, origine: {2}]" -f $m.Name, $m.ObjectClass, $m.PrincipalSource)
                }
            } else { Aggiungi "     (nessun membro)" }
        } catch {
            Aggiungi "     (impossibile leggere i membri: possibile SID orfano)"
        }
    }
} catch { Aggiungi "Errore lettura gruppi: $_" }

Aggiungi (Sezione '4b. APPARTENENZA PER UTENTE')
try {
    foreach ($u in Get-LocalUser) {
        $gruppiUtente = @()
        foreach ($g in Get-LocalGroup) {
            try {
                $mem = Get-LocalGroupMember -Group $g.Name -ErrorAction Stop
                if ($mem | Where-Object { $_.SID -eq $u.SID }) { $gruppiUtente += $g.Name }
            } catch { }
        }
        Aggiungi ("{0,-25} -> {1}" -f $u.Name, $(if ($gruppiUtente) { $gruppiUtente -join ', ' } else { '(nessun gruppo)' }))
    }
} catch { }

# ---------------------------------------------------------------- 5. POLICY
Aggiungi (Sezione '5. POLICY PASSWORD E BLOCCO ACCOUNT (net accounts)')
Aggiungi ((net accounts 2>&1 | Out-String))

Aggiungi (Sezione '5b. POLICY DI SICUREZZA DETTAGLIATE (secedit)')
$tmp = Join-Path $env:TEMP "secpol_$data.cfg"
try {
    secedit /export /cfg $tmp /areas SECURITYPOLICY | Out-Null
    $righe = Get-Content $tmp |
        Select-String 'MinimumPasswordAge|MaximumPasswordAge|MinimumPasswordLength|PasswordComplexity|PasswordHistorySize|LockoutBadCount|ResetLockoutCount|LockoutDuration|ClearTextPassword'
    Aggiungi ($righe -join "`r`n")
    Aggiungi ""
    Aggiungi "(PasswordComplexity=1 significa complessita' attiva; MaximumPasswordAge=-1 significa nessuna scadenza)"
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
} catch { Aggiungi "secedit non eseguito (servono privilegi di amministratore)." }

# ---------------------------------------------------------------- 6. PROFILI
Aggiungi (Sezione '6. PROFILI UTENTE PRESENTI SUL DISCO')
try {
    $profili = Get-CimInstance Win32_UserProfile | Where-Object { -not $_.Special }
    foreach ($p in $profili) {
        $nome = try { (New-Object System.Security.Principal.SecurityIdentifier($p.SID)).Translate([System.Security.Principal.NTAccount]).Value } catch { $p.SID }
        Aggiungi ("{0,-35} {1}   ultimo uso: {2}" -f $nome, $p.LocalPath, $p.LastUseTime)
    }
} catch { }

# ---------------------------------------------------------------- 7. SESSIONI
Aggiungi (Sezione '7. SESSIONI ATTIVE')
Aggiungi ((query user 2>&1 | Out-String))

# ---------------------------------------------------------------- SALVATAGGIO
$report | Out-File -FilePath $out -Encoding UTF8
Write-Host "Report salvato in: $out" -ForegroundColor Green
