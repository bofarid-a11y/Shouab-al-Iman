# Evaluatiemodule CUR001 — voorbereiding en vervolgstappen

## Huidige situatie

De twee bestaande websiteformulieren vragen groep, taal, duidelijkheid en leeftijdsgeschiktheid (verplicht), en een opmerking (optioneel). Er is geen naamveld. De optionele rolkeuzes blijven **Leerling**, **Ouder / verzorger** en **Anders**; beroep staat apart en bevat **Student**. Groep en taal worden al vanuit de digitale les meegenomen; bij een rechtstreeks bezoek kunnen ze worden gekozen. Dat is een aanwijzing van de bezoeker, geen bewijs welk materiaal werkelijk is bekeken. De gebruikte lestaal bepaalt het tabblad, niet de interfacetaal.

De huidige webapp schrijft de oorspronkelijke antwoorden naar A–H van de twee privé bedoelde lestabbladen. Apps Script-testverzoeken zijn in beide tabbladen gecontroleerd; volledige browserinzendingen van de actuele formulieren zijn nog niet bevestigd. De voorbereide webappcode wordt niet automatisch geactiveerd door publicatie van de website.

## Voorbereid: betrouwbaar herkennen van nieuwe beoordelingen

De nieuwe `integrations/google-apps-script/Code.gs` voegt aan **nieuwe** inzendingen toe:

| Kolom | Betekenis |
|---|---|
| I | Unieke referentie met UUID; geen volgnummer of geheime toegangscode |
| J | Lescode, afgeleid van de gekozen groep en lestaal: `CUR001-K01-L01-G3-NL` enz. |
| K | Lesversie: `Niet vastgesteld` zolang niet betrouwbaar bekend is welke versie, papier of digitaal, is beoordeeld |

Er wordt geen oude reactie veranderd of achteraf een versie verzonnen. UUID's zijn praktisch uniek, maar geven geen bescherming of recht op inzage. De code controleert de verwachte koppen en schrijft niet als ze ontbreken. De exacte procedure en volgorde staan in de integratie-README. I–K is gecontroleerd en de koppen zijn voorbereid; van het overzicht is een back-up gemaakt. Controleer de situatie opnieuw vóór het inzetten van de nieuwe webappversie en test daarna beide talen werkelijk. Zolang dat niet is gebeurd werkt de huidige, ongewijzigde webapp met A–H. Een lescode is geen betrouwbare versie-identificatie. Een latere versie-identificatie vereist een eenduidig vastgestelde bron en koppeling voor papier én digitaal.

## Beheer en bewaren van geschiedenis

Gebruik voorlopig het bestaande Google Sheet als administratieve basis, **niet** een openbaar dashboard. Verifieer de deelinstellingen van het hele bestand en geef individuele inzage alleen aan bevoegde personen. Google Sheets-tabbladen zijn geen aparte beveiligingsgrens: wie toegang heeft tot het bestand kan mogelijk alle tabbladen zien. Exporteer via Google Sheets naar Excel of CSV en bewaar de export veilig; geen automatische export is ingericht.

Ontwerp voor een afzonderlijk beheersregister, gekoppeld via de referentie: `Referentie`, `Status` (Ontvangen / In behandeling / Afgehandeld), `Verantwoordelijke`, `Verbeteractie`, `Datum`, `Nieuwe lesversie`. Houd individuele beoordelingen ongewijzigd en noteer acties als **nieuwe gebeurtenissen** in een apart historielog (`Referentie`, `Datum`, `Oude status`, `Nieuwe status`, `Actie`, `Lesversie`). Zo gaat een lage beoordeling niet verloren wanneer een les wordt verbeterd. Dit is een werkwijze, geen technische garantie: Sheets-bewerkers kunnen data wijzigen of verwijderen. Maak back-ups en controleer rechten en versiegeschiedenis. De werkelijke registers, dashboards, tellingen, gemiddelden en filterweergaven zijn nog niet ingericht of getest; geen fictieve data als echt presenteren.

## Pilot gescheiden van evaluatie

Een pilot is vrijwillig en mag geen voorwaarde zijn om te beoordelen. Er is nu **geen** pilotinschrijving of verzameling van contactgegevens via de site. Ontwerp die pas nadat doel, doelgroep, verantwoordelijke, bewaartermijn, privacy-informatie en toestemmingsprocedure zijn vastgesteld. Sla eventuele contactgegevens in een apart privé bestand met afzonderlijke toegang op, niet in de beoordelingstabbladen; leg geen automatische koppeling met een leerlingbeoordeling. Voor minderjarigen zijn passende ouderlijke betrokkenheid en privacywaarborgen nodig. Toestemming en beperkte toegang zijn niet hetzelfde als anonieme deelname. Publiceer geen proefinschrijfformulier voordat opslag, bescherming en verwijdering daadwerkelijk werken.

## Nog controleren

- Bestaande sheetrechten en huidige gegevens, inclusief vrije kolommen, zonder gegevens te verwijderen.
- Na voorbereiding: live webapp-POST-test voor beide lestalen, historische gegevens en oudere formulieren; daarna echte browserinzendingen NL/AR met herkenbare tests en opslag in het juiste tabblad.
- Toegankelijkheid met toetsenbord en schermlezer, iPhone/Safari en de Arabische tekst door een menselijke taalbeoordelaar. Simulaties zijn hiervoor geen vervanging.
- Spam, Google-quota, bewaartermijn, inzage- en verwijderverzoeken; het publiek aanroepbare schrijfadres is geen beveiliging tegen misbruik.
- Afzonderlijke autorisatie en feitelijke bouw/test van eventuele dashboards; geen beheergegevens in GitHub Pages of in client-side code plaatsen.
