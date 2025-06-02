
# Sistema Asta Online

Un'applicazione web completa per la gestione di un'asta online con sistema di offerte automatiche (THR - Threshold).

## Funzionalità Principali

- **Registrazione e Autenticazione**: Sistema sicuro con validazione email e password
- **Gestione Sessioni**: Timeout automatico dopo 2 minuti di inattività
- **Sistema THR**: Gli utenti impostano un'offerta massima, il sistema calcola automaticamente l'offerta vincente
- **Aggiornamenti Real-time**: Il BID viene aggiornato ogni 5 secondi
- **Interface Responsive**: Ottimizzata per desktop e dispositivi mobili
- **Validazione Completa**: Controlli lato client e server per tutti i form

## Come Funziona l'Asta

1. **THR (Threshold)**: Ogni utente imposta la sua offerta massima segreta
2. **Calcolo BID**: Il sistema determina l'offerta vincente come secondo THR più alto + 0,01€
3. **Offerente Vincente**: Chi ha il THR più alto vince con il BID calcolato
4. **Parità**: In caso di THR uguali, vince chi ha offerto per primo

## Struttura del Progetto

```
src/
├── components/          # Componenti React
│   ├── Layout.tsx      # Layout principale
│   ├── Header.tsx      # Intestazione
│   ├── Sidebar.tsx     # Barra di navigazione
│   ├── Home.tsx        # Pagina home pubblica
│   ├── Register.tsx    # Registrazione utenti
│   ├── Login.tsx       # Login utenti
│   └── Profile.tsx     # Profilo e gestione THR
├── context/            # Context per gestione stato
│   ├── AuthContext.tsx # Autenticazione e sessioni
│   └── AuctionContext.tsx # Logica asta e THR
├── utils/              # Utility functions
│   └── browserCheck.ts # Controllo cookie e JS
├── styles/             # Stili CSS
│   └── global.css      # Stili globali
└── pages/
    └── Index.tsx       # Pagina principale
```

## Tecnologie Utilizzate

- **React 18** con TypeScript
- **React Router** per la navigazione
- **Tailwind CSS** per lo styling
- **Lucide React** per le icone
- **Local Storage** per la persistenza dati
- **Context API** per la gestione dello stato

## Caratteristiche Tecniche

### Sicurezza
- Hash delle password (simulato con btoa)
- Validazione input lato client e server
- Gestione sicura delle sessioni
- Controllo timeout inattività

### UX/UI
- Design moderno e responsive
- Feedback visivo per tutte le azioni
- Tooltip informativi
- Messaggi di errore/successo colorati
- Aggiornamenti real-time

### Validazioni
- **Email**: Formato valido con regex
- **Password**: Almeno una lettera e un numero
- **THR**: Multipli di 0,01€, maggiore del BID attuale
- **Sessioni**: Controllo automatico timeout

## Come Utilizzare

1. **Visitare la Home**: Vedere BID attuale e offerente
2. **Registrarsi**: Creare account con email e password valide
3. **Accedere**: Login con credenziali
4. **Impostare THR**: Nel profilo, inserire offerta massima
5. **Monitorare**: Controllare stato asta in tempo reale

## Requisiti Browser

- **Cookie abilitati**: Necessari per il funzionamento delle sessioni
- **JavaScript abilitato**: Richiesto per tutte le funzionalità
- **Browser moderni**: Supporto ES6+ e API moderne

## Stati dell'Asta

- **BID**: Offerta attuale visibile pubblicamente
- **Bidder**: Email dell'offerente attuale
- **THR**: Offerte massime segrete degli utenti
- **Sessioni**: Gestione automatica con timeout

L'applicazione è stata sviluppata seguendo le migliori pratiche di sviluppo web moderno, con particolare attenzione all'usabilità, sicurezza e performance.
